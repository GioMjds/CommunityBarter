import axios, { type AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { getCookie } from "./cookies";

interface ApiParams {
    url: string;
    config?: AxiosRequestConfig;
}

interface ParamsWithData extends ApiParams {
    data: any;
}

const baseConfig: AxiosRequestConfig = {
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
}

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
    (error) => Promise.reject(error)
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
 * const response = await GET({ url: '/endpoint' });
 * console.log(response);
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
 * const result = await POST({ url: '/endpoint', data: { key: 'value' } });
 * console.log(result);
 * ```
 */
export const POST = async <T>({ url, data, config }: ParamsWithData): Promise<T> => {
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
 * const updated = await PUT({ url: '/endpoint/1', data: { key: 'newValue' } });
 * console.log(updated);
 * ```
 */
export const PUT = async <T>({ url, data, config }: ParamsWithData): Promise<T> => {
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
 * const patched = await PATCH({ url: '/endpoint/1', data: { key: 'patchedValue' } });
 * console.log(patched);
 * ```
 */
export const PATCH = async <T>({ url, data, config }: ParamsWithData): Promise<T> => {
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
 * const result = await DELETE({ url: '/endpoint/1' });
 * console.log(result);
 * ```
 */
export const DELETE = async <T>({ url, config }: ApiParams): Promise<T> => {
    return api.delete<T>(url, config) as Promise<T>;
};

export { api as default };