import { stringify } from "query-string";
import { fetchUtils } from "ra-core";

/**
 * Maps react-admin queries to a json-server powered REST API
 *
 * @see https://github.com/typicode/json-server
 *
 * @example
 *
 * getList          => GET http://my.api.url/posts?_sort=title&_order=ASC&_start=0&_end=24
 * getOne           => GET http://my.api.url/posts/123
 * getManyReference => GET http://my.api.url/posts?author_id=345
 * getMany          => GET http://my.api.url/posts?id=123&id=456&id=789
 * create           => POST http://my.api.url/posts/123
 * update           => PUT http://my.api.url/posts/123
 * updateMany       => PUT http://my.api.url/posts/123, PUT http://my.api.url/posts/456, PUT http://my.api.url/posts/789
 * delete           => DELETE http://my.api.url/posts/123
 *
 * @example
 *
 * import * as React from "react";
 * import { Admin, Resource } from 'react-admin';
 * import jsonServerProvider from 'ra-data-json-server';
 *
 * import { PostList } from './posts';
 *
 * const App = () => (
 *     <Admin dataProvider={jsonServerProvider('http://jsonplaceholder.typicode.com')}>
 *         <Resource name="posts" list={PostList} />
 *     </Admin>
 * );
 *
 * export default App;
 */
export default (apiUrl, httpClient = fetchUtils.fetchJson) => ({
	getList: (resource, params) => {
		const { page, perPage } = params.pagination;
		const { field, order } = params.sort;
		const query = {
			...fetchUtils.flattenObject(params.filter),
			_sort: field,
			_order: order,
			_start: (page - 1) * perPage,
			_end: page * perPage,
		};
		const url = `${apiUrl}/${resource}?${stringify(query)}`;

		return httpClient(url).then(({ headers, json }) => {
			if (!headers.has("x-total-count")) {
				throw new Error(
					"The X-Total-Count header is missing in the HTTP Response. The jsonServer Data Provider expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare X-Total-Count in the Access-Control-Expose-Headers header?"
				);
			}
			return {
				// Transform _id to id
				data: json.map((resource) => ({ ...resource, id: resource._id })),
				total: parseInt(headers.get("x-total-count").split("/").pop(), 10),
			};
		});
	},

	getOne: (resource, params) =>
		httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
			data: { ...json, id: json._id },
		})),

	getMany: (resource, params) => {
		const query = {
			id: params.ids,
		};
		const url = `${apiUrl}/${resource}?${stringify(query)}`;
		return httpClient(url).then(({ json }) => ({
			data: json.map((resource) => ({ ...resource, id: resource._id })),
		}));
	},

	getManyReference: (resource, params) => {
		const { page, perPage } = params.pagination;
		const { field, order } = params.sort;
		const query = {
			...fetchUtils.flattenObject(params.filter),
			[params.target]: params.id,
			_sort: field,
			_order: order,
			_start: (page - 1) * perPage,
			_end: page * perPage,
		};
		const url = `${apiUrl}/${resource}?${stringify(query)}`;

		return httpClient(url).then(({ headers, json }) => {
			if (!headers.has("x-total-count")) {
				throw new Error(
					"The X-Total-Count header is missing in the HTTP Response. The jsonServer Data Provider expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare X-Total-Count in the Access-Control-Expose-Headers header?"
				);
			}
			return {
				data: json.map((resource) => ({ ...resource, id: resource._id })),
				total: parseInt(headers.get("x-total-count").split("/").pop(), 10),
			};
		});
	},

	update: async (resource, params) => {
		// If there is'not image proced normally
		if (!params.data.img) {
			return httpClient(`${apiUrl}/${resource}/${params.id}`, {
				method: "PUT",
				body: JSON.stringify(params.data),
			}).then(({ json }) => ({
				data: { ...params.data, id: json._id },
			}));
		}
		// If the image is not an blob, don't need to make the change
		else if (params.data.img.imgBlob) {
			const base64Image = await convertFileToBase64(params.data.img);
			const data = {
				...params.data,
				img: {
					src: base64Image,
					title: `${params.data.title}`,
				},
			};
			return httpClient(`${apiUrl}/${resource}/${params.id}`, {
				method: "PUT",
				body: JSON.stringify(data),
			}).then(({ json }) => ({
				data: { ...params.data, id: json._id },
			}));
		}
	},
	// json-server doesn't handle filters on UPDATE route, so we fallback to calling UPDATE n times instead
	updateMany: (resource, params) =>
		Promise.all(
			params.ids.map((id) =>
				httpClient(`${apiUrl}/${resource}/${id}`, {
					method: "PUT",
					body: JSON.stringify(params.data),
				})
			)
		).then((responses) => ({ data: responses.map(({ json }) => json.id) })),

	create: async (resource, params) => {
		// Convert image to base & send
		if (params.data.img) {
			const base64Image = await convertFileToBase64(params.data.img);
			const data = {
				...params.data,
				img: {
					src: base64Image,
					title: `${params.data.title}`,
				},
			};
			return httpClient(`${apiUrl}/${resource}`, {
				method: "POST",
				body: JSON.stringify(data),
			}).then(({ json }) => ({
				data: { ...params.data, id: json._id },
			}));
		}
		// If there is'not image proced normally
		return httpClient(`${apiUrl}/${resource}`, {
			method: "POST",
			body: JSON.stringify(params.data),
		}).then(({ json }) => ({
			data: { ...params.data, id: json._id },
		}));
	},
	delete: (resource, params) =>
		httpClient(`${apiUrl}/${resource}/${params.id}`, {
			method: "DELETE",
		}).then(({ json }) => ({ data: json })),

	// json-server doesn't handle filters on DELETE route, so we fallback to calling DELETE n times instead
	deleteMany: (resource, params) =>
		Promise.all(
			params.ids.map((id) =>
				httpClient(`${apiUrl}/${resource}/${id}`, {
					method: "DELETE",
				})
			)
		).then((responses) => ({ data: responses.map(({ json }) => json.id) })),
});

/**
 * Convert a `File` object returned by the upload input into a base 64 string.
 * That's not the most optimized way to store images in production, but it's
 * enough to illustrate the idea of data provider decoration.
 */
const convertFileToBase64 = (file) =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result);
		reader.onerror = reject;
		reader.readAsDataURL(file.rawFile);
	});
