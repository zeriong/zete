import axios from 'axios';
import {exportApis} from './generated';
import {API_URL} from '../common/constants';

export const REFRESH_TOKEN_PATH = '/auth/refresh';

export const ApiInstance = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
});

/** OpenAPI Autogen Ajax 매서드 */
export const Api = exportApis(ApiInstance);