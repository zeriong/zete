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
 * @interface GetOneMemoOutput
 */
export interface GetOneMemoOutput {
    /**
     * 
     * @type {string}
     * @memberof GetOneMemoOutput
     */
    'error'?: string;
    /**
     * 
     * @type {string}
     * @memberof GetOneMemoOutput
     */
    'target'?: string;
    /**
     * 
     * @type {string}
     * @memberof GetOneMemoOutput
     */
    'message'?: string;
    /**
     * 
     * @type {boolean}
     * @memberof GetOneMemoOutput
     */
    'success': boolean;
    /**
     * 
     * @type {Memo}
     * @memberof GetOneMemoOutput
     */
    'memo'?: Memo;
}

