/* tslint:disable */
/* eslint-disable */
/**
 * Cats example
 * The cats API description
 *
 * The version of the OpenAPI document: v1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import type { Configuration } from '../configuration';
import type { AxiosPromise, AxiosInstance, AxiosRequestConfig } from 'axios';
import globalAxios from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from '../common';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from '../base';
// @ts-ignore
import { CoreOutput } from '../model';
// @ts-ignore
import { CreateAccountDto } from '../model';
// @ts-ignore
import { ResetGptDailyLimitInputDto } from '../model';
// @ts-ignore
import { ResetGptDailyLimitOutputDto } from '../model';
// @ts-ignore
import { UpdateAccountDto } from '../model';
// @ts-ignore
import { User } from '../model';
/**
 * UserApi - axios parameter creator
 * @export
 */
export const UserApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        _delete: async (id: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'id' is not null or undefined
            assertParamExists('_delete', 'id', id)
            const localVarPath = `/user/{id}`
                .replace(`{${"id"}}`, encodeURIComponent(String(id)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'DELETE', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {CreateAccountDto} createAccountDto 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createAccount: async (createAccountDto: CreateAccountDto, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'createAccountDto' is not null or undefined
            assertParamExists('createAccount', 'createAccountDto', createAccountDto)
            const localVarPath = `/user/register`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(createAccountDto, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getAll: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/user/all`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        profile: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/user/profile`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {UpdateAccountDto} updateAccountDto 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        profileUpdate: async (updateAccountDto: UpdateAccountDto, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'updateAccountDto' is not null or undefined
            assertParamExists('profileUpdate', 'updateAccountDto', updateAccountDto)
            const localVarPath = `/user/modify`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'PATCH', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(updateAccountDto, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {ResetGptDailyLimitInputDto} resetGptDailyLimitInputDto 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        resetGptDailyLimit: async (resetGptDailyLimitInputDto: ResetGptDailyLimitInputDto, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'resetGptDailyLimitInputDto' is not null or undefined
            assertParamExists('resetGptDailyLimit', 'resetGptDailyLimitInputDto', resetGptDailyLimitInputDto)
            const localVarPath = `/user/resetGptDailyLimit`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'PATCH', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(resetGptDailyLimitInputDto, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * UserApi - functional programming interface
 * @export
 */
export const UserApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = UserApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async _delete(id: number, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<CoreOutput>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator._delete(id, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @param {CreateAccountDto} createAccountDto 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async createAccount(createAccountDto: CreateAccountDto, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<CoreOutput>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.createAccount(createAccountDto, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getAll(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<User>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getAll(options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async profile(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<User>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.profile(options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @param {UpdateAccountDto} updateAccountDto 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async profileUpdate(updateAccountDto: UpdateAccountDto, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<CoreOutput>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.profileUpdate(updateAccountDto, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @param {ResetGptDailyLimitInputDto} resetGptDailyLimitInputDto 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async resetGptDailyLimit(resetGptDailyLimitInputDto: ResetGptDailyLimitInputDto, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ResetGptDailyLimitOutputDto>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.resetGptDailyLimit(resetGptDailyLimitInputDto, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * UserApi - factory interface
 * @export
 */
export const UserApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = UserApiFp(configuration)
    return {
        /**
         * 
         * @param {number} id 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        _delete(id: number, options?: any): AxiosPromise<CoreOutput> {
            return localVarFp._delete(id, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {CreateAccountDto} createAccountDto 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createAccount(createAccountDto: CreateAccountDto, options?: any): AxiosPromise<CoreOutput> {
            return localVarFp.createAccount(createAccountDto, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getAll(options?: any): AxiosPromise<Array<User>> {
            return localVarFp.getAll(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        profile(options?: any): AxiosPromise<User> {
            return localVarFp.profile(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {UpdateAccountDto} updateAccountDto 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        profileUpdate(updateAccountDto: UpdateAccountDto, options?: any): AxiosPromise<CoreOutput> {
            return localVarFp.profileUpdate(updateAccountDto, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {ResetGptDailyLimitInputDto} resetGptDailyLimitInputDto 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        resetGptDailyLimit(resetGptDailyLimitInputDto: ResetGptDailyLimitInputDto, options?: any): AxiosPromise<ResetGptDailyLimitOutputDto> {
            return localVarFp.resetGptDailyLimit(resetGptDailyLimitInputDto, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * UserApi - object-oriented interface
 * @export
 * @class UserApi
 * @extends {BaseAPI}
 */
export class UserApi extends BaseAPI {
    /**
     * 
     * @param {number} id 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public _delete(id: number, options?: AxiosRequestConfig) {
        return UserApiFp(this.configuration)._delete(id, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {CreateAccountDto} createAccountDto 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public createAccount(createAccountDto: CreateAccountDto, options?: AxiosRequestConfig) {
        return UserApiFp(this.configuration).createAccount(createAccountDto, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public getAll(options?: AxiosRequestConfig) {
        return UserApiFp(this.configuration).getAll(options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public profile(options?: AxiosRequestConfig) {
        return UserApiFp(this.configuration).profile(options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {UpdateAccountDto} updateAccountDto 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public profileUpdate(updateAccountDto: UpdateAccountDto, options?: AxiosRequestConfig) {
        return UserApiFp(this.configuration).profileUpdate(updateAccountDto, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {ResetGptDailyLimitInputDto} resetGptDailyLimitInputDto 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof UserApi
     */
    public resetGptDailyLimit(resetGptDailyLimitInputDto: ResetGptDailyLimitInputDto, options?: AxiosRequestConfig) {
        return UserApiFp(this.configuration).resetGptDailyLimit(resetGptDailyLimitInputDto, options).then((request) => request(this.axios, this.basePath));
    }
}
