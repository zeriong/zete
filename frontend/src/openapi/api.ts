import {store} from '../store';
import axios, {AxiosRequestConfig} from 'axios';
import {exportApis} from './generated';
import {API_URL} from '../common/constants';
import {refreshAccessTokenAction} from '../store/auth/auth.actions';
import {setLogoutReducer} from '../store/auth/auth.slice';

export const REFRESH_TOKEN_PATH = '/auth/refresh';

const instance = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
});

/** OpenAPI Autogen Ajax 매서드 */
export const Api = exportApis(instance);

/** axios interceptor 사용하여 token 통신 */
export const InitApi = () => {
    instance.interceptors.request.use((config) => {
        config.headers['Authorization'] = `Bearer ${store.getState().auth.accessToken}`;
        return config;
    });

    instance.interceptors.response.use((value: any) => value, async (error) => {
            const originalConfig = error.config;
            // accessToken 발급요청이 에러를 내면 무한루프에 빠짐
            if (error.config.url === REFRESH_TOKEN_PATH) return Promise.reject(error);
            if (error.response?.status === 401 && !originalConfig.retry) { // 권한 오류가 발생했고 재실행된(무한루프방지) 경우가 아니라면
                try {
                    await store.dispatch(refreshAccessTokenAction());

                    originalConfig.headers['Authorization'] = `Bearer ${store.getState().auth.accessToken}`;
                    originalConfig.retry = true; // 아래 내용 처리 이후 해당 요청을 재실행

                    return instance(originalConfig);
                } catch (_error) { // 토큰발급 실패, 로그인정보 초기화 및 로그인창 이동
                    store.dispatch(setLogoutReducer());
                    return Promise.reject(_error);
                }
            }
            return Promise.reject(error);
        }
    );

    instance.interceptors.request.use(
        (config: AxiosRequestConfig) => config,
        (error) => Promise.reject(error)
    );
};