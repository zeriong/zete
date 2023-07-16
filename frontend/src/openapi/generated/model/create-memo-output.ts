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


// May contain unused imports in some cases
// @ts-ignore
import { Memo } from './memo';

/**
 * 
 * @export
 * @interface CreateMemoOutput
 */
export interface CreateMemoOutput {
    /**
     * 
     * @type {string}
     * @memberof CreateMemoOutput
     */
    'error'?: string;
    /**
     * 
     * @type {string}
     * @memberof CreateMemoOutput
     */
    'target'?: string;
    /**
     * 
     * @type {string}
     * @memberof CreateMemoOutput
     */
    'message'?: string;
    /**
     * 
     * @type {boolean}
     * @memberof CreateMemoOutput
     */
    'success': boolean;
    /**
     * 
     * @type {Memo}
     * @memberof CreateMemoOutput
     */
    'savedMemo': Memo;
}

