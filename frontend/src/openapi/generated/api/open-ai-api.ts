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
import { CreateCompletionDto } from '../model';
// @ts-ignore
import { CreateCompletionOutputDto } from '../model';
/**
 * OpenAiApi - axios parameter creator
 * @export
 */
export const OpenAiApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {CreateCompletionDto} createCompletionDto 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createCompletion: async (createCompletionDto: CreateCompletionDto, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'createCompletionDto' is not null or undefined
            assertParamExists('createCompletion', 'createCompletionDto', createCompletionDto)
            const localVarPath = `/openAi/createCompletion`;
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
            localVarRequestOptions.data = serializeDataIfNeeded(createCompletionDto, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * OpenAiApi - functional programming interface
 * @export
 */
export const OpenAiApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = OpenAiApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @param {CreateCompletionDto} createCompletionDto 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async createCompletion(createCompletionDto: CreateCompletionDto, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<CreateCompletionOutputDto>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.createCompletion(createCompletionDto, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * OpenAiApi - factory interface
 * @export
 */
export const OpenAiApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = OpenAiApiFp(configuration)
    return {
        /**
         * 
         * @param {CreateCompletionDto} createCompletionDto 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createCompletion(createCompletionDto: CreateCompletionDto, options?: any): AxiosPromise<CreateCompletionOutputDto> {
            return localVarFp.createCompletion(createCompletionDto, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * OpenAiApi - object-oriented interface
 * @export
 * @class OpenAiApi
 * @extends {BaseAPI}
 */
export class OpenAiApi extends BaseAPI {
    /**
     * 
     * @param {CreateCompletionDto} createCompletionDto 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof OpenAiApi
     */
    public createCompletion(createCompletionDto: CreateCompletionDto, options?: AxiosRequestConfig) {
        return OpenAiApiFp(this.configuration).createCompletion(createCompletionDto, options).then((request) => request(this.axios, this.basePath));
    }
}