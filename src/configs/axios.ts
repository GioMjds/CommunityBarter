import axios, {
	type AxiosInstance,
	AxiosRequestConfig,
	AxiosResponse,
} from 'axios';
import { getCookie } from './cookies';

interface ApiParams {
	url: string;
	config?: AxiosRequestConfig;
}

interface ParamsWithData extends ApiParams {
	data: any;
}

const baseConfig: AxiosRequestConfig = {
	headers: { 'Content-Type': 'application/json' },
	withCredentials: true,
};

const api: AxiosInstance = axios.create({
	baseURL: `${process.env.NEXT_PUBLIC_API}/api`,
	...baseConfig,
});

api.interceptors.request.use(
	(config) => {
		const token = getCookie('access_token');
		if (token) config.headers.Authorization = `Bearer ${token}`;
		return config;
	},
	(error) => Promise.reject(error)
);

api.interceptors.response.use(
	(response: AxiosResponse) => response.data,
	(error) => {
		const errorMessage = error.response?.data?.error;
		return Promise.reject(errorMessage);
	}
);

/**
 * GET - Performs a GET request.
 * @param url - API endpoint URL (relative to base URL)
 * @param config - Optional Axios config
 * @returns Promise with the response data
 *
 * To use:
 * ```typescript
 * import { GET } from '@/configs/axios';
 *
 * // Basic GET request
 * const response = await GET({ url: '/users' });
 * console.log(response);
 *
 * // GET with dynamic route
 * const userId = 123;
 * const user = await GET({ url: `/users/${userId}` });
 * console.log(user);
 *
 * // GET with query parameters
 * const users = await GET({
 *   url: '/users',
 *   config: {
 *     params: {
 *       page: 1,
 *       limit: 10,
 *       search: 'john'
 *     }
 *   }
 * });
 * console.log(users);
 *
 * // GET with dynamic route and query parameters
 * const posts = await GET({
 *   url: `/users/${userId}/posts`,
 *   config: {
 *     params: {
 *       status: 'published',
 *       sort: 'created_at'
 *     }
 *   }
 * });
 * console.log(posts);
 * ```
 */
export const GET = async <T>({ url, config }: ApiParams): Promise<T> => {
	return api.get<T>(url, config) as Promise<T>;
};

/**
 * POST - Performs a POST request.
 * @param url - API endpoint URL (relative to base URL)
 * @param data - Data to send
 * @param config - Optional Axios config
 * @returns Promise with the response data
 *
 * To use:
 * ```typescript
 * import { POST } from '@/configs/axios';
 *
 * // Basic POST request
 * const result = await POST({ 
 *   url: '/users', 
 *   data: { name: 'John', email: 'john@example.com' } 
 * });
 * console.log(result);
 *
 * // POST with dynamic route
 * const userId = 123;
 * const post = await POST({ 
 *   url: `/users/${userId}/posts`, 
 *   data: { title: 'New Post', content: 'Post content' } 
 * });
 * console.log(post);
 *
 * // POST with query parameters
 * const user = await POST({
 *   url: '/users',
 *   data: { name: 'Jane', email: 'jane@example.com' },
 *   config: {
 *     params: {
 *       notify: true,
 *       source: 'admin'
 *     }
 *   }
 * });
 * console.log(user);
 *
 * // POST with dynamic route and query parameters
 * const comment = await POST({
 *   url: `/posts/${postId}/comments`,
 *   data: { content: 'Great post!', author: 'user123' },
 *   config: {
 *     params: {
 *       notify_author: true,
 *       moderated: false
 *     }
 *   }
 * });
 * console.log(comment);
 * ```
 */
export const POST = async <T>({
    url,
    data,
    config,
}: ParamsWithData): Promise<T> => {
    return api.post<T>(url, data, config) as Promise<T>;
};

/**
 * PUT - Performs a PUT request.
 * @param url - API endpoint URL (relative to base URL)
 * @param data - Data to update
 * @param config - Optional Axios config
 * @returns Promise with the response data
 *
 * To use:
 * ```typescript
 * import { PUT } from '@/configs/axios';
 *
 * // Basic PUT request
 * const updated = await PUT({ 
 *   url: '/users/1', 
 *   data: { name: 'John Updated', email: 'john.updated@example.com' } 
 * });
 * console.log(updated);
 *
 * // PUT with dynamic route
 * const userId = 123;
 * const user = await PUT({ 
 *   url: `/users/${userId}`, 
 *   data: { name: 'Jane', email: 'jane@example.com', status: 'active' } 
 * });
 * console.log(user);
 *
 * // PUT with query parameters
 * const product = await PUT({
 *   url: '/products/456',
 *   data: { name: 'Updated Product', price: 99.99 },
 *   config: {
 *     params: {
 *       notify_subscribers: true,
 *       update_inventory: false
 *     }
 *   }
 * });
 * console.log(product);
 *
 * // PUT with dynamic route and query parameters
 * const postId = 789;
 * const post = await PUT({
 *   url: `/posts/${postId}`,
 *   data: { title: 'Updated Title', content: 'Updated content', status: 'published' },
 *   config: {
 *     params: {
 *       send_notification: true,
 *       update_modified_date: true
 *     }
 *   }
 * });
 * console.log(post);
 * ```
 */
export const PUT = async <T>({
    url,
    data,
    config,
}: ParamsWithData): Promise<T> => {
    return api.put<T>(url, data, config) as Promise<T>;
};

/**
 * PATCH - Performs a PATCH request.
 * @param url - API endpoint URL (relative to base URL)
 * @param data - Partial data to update
 * @param config - Optional Axios config
 * @returns Promise with the response data
 *
 * To use:
 * ```typescript
 * import { PATCH } from '@/configs/axios';
 *
 * // Basic PATCH request - partial update
 * const updated = await PATCH({ 
 *   url: '/users/1', 
 *   data: { email: 'newemail@example.com' } 
 * });
 * console.log(updated);
 *
 * // PATCH with dynamic route
 * const userId = 123;
 * const user = await PATCH({ 
 *   url: `/users/${userId}`, 
 *   data: { status: 'inactive', lastLogin: new Date().toISOString() } 
 * });
 * console.log(user);
 *
 * // PATCH with query parameters
 * const profile = await PATCH({
 *   url: '/profiles/456',
 *   data: { bio: 'Updated bio', preferences: { theme: 'dark' } },
 *   config: {
 *     params: {
 *       validate: true,
 *       send_email: false
 *     }
 *   }
 * });
 * console.log(profile);
 *
 * // PATCH with dynamic route and query parameters
 * const postId = 789;
 * const post = await PATCH({
 *   url: `/posts/${postId}`,
 *   data: { status: 'published', publishedAt: new Date().toISOString() },
 *   config: {
 *     params: {
 *       notify_subscribers: true,
 *       schedule_social_media: false
 *     }
 *   }
 * });
 * console.log(post);
 *
 * // PATCH for toggling boolean fields
 * const taskId = 101;
 * const task = await PATCH({
 *   url: `/tasks/${taskId}`,
 *   data: { completed: true }
 * });
 * console.log(task);
 * ```
 */
export const PATCH = async <T>({
    url,
    data,
    config,
}: ParamsWithData): Promise<T> => {
    return api.patch<T>(url, data, config) as Promise<T>;
};

/**
 * DELETE - Performs a DELETE request.
 * @param url - API endpoint URL (relative to base URL)
 * @param config - Optional Axios config
 * @returns Promise with the response data
 *
 * To use:
 * ```typescript
 * import { DELETE } from '@/configs/axios';
 *
 * // Basic DELETE request
 * const result = await DELETE({ url: '/users/1' });
 * console.log(result);
 *
 * // DELETE with dynamic route
 * const userId = 123;
 * const deleted = await DELETE({ url: `/users/${userId}` });
 * console.log(deleted);
 *
 * // DELETE with query parameters for soft delete
 * const user = await DELETE({
 *   url: '/users/456',
 *   config: {
 *     params: {
 *       soft_delete: true,
 *       reason: 'user_request'
 *     }
 *   }
 * });
 * console.log(user);
 *
 * // DELETE multiple items
 * const deletedPosts = await DELETE({
 *   url: '/posts',
 *   config: {
 *     params: {
 *       ids: [1, 2, 3, 4],
 *       force: false
 *     }
 *   }
 * });
 * console.log(deletedPosts);
 *
 * // DELETE with dynamic route and query parameters
 * const postId = 789;
 * const comment = await DELETE({
 *   url: `/posts/${postId}/comments/123`,
 *   config: {
 *     params: {
 *       notify_author: false,
 *       cascade: true
 *     }
 *   }
 * });
 * console.log(comment);
 *
 * // DELETE with confirmation parameters
 * const account = await DELETE({
 *   url: '/accounts/456',
 *   config: {
 *     params: {
 *       confirmation_token: 'abc123xyz',
 *       backup_data: true
 *     }
 *   }
 * });
 * console.log(account);
 * ```
 */
export const DELETE = async <T>({ url, config }: ApiParams): Promise<T> => {
    return api.delete<T>(url, config) as Promise<T>;
};

export { api as default };