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
// May contain unused imports in some cases
// @ts-ignore
import { Tag } from './tag';

/**
 * 
 * @export
 * @interface Category
 */
export interface Category {
    /**
     * 
     * @type {number}
     * @memberof Category
     */
    'id': number;
    /**
     * 
     * @type {string}
     * @memberof Category
     */
    'cateName': string | null;
    /**
     * 
     * @type {number}
     * @memberof Category
     */
    'userId': number;
    /**
     * 
     * @type {Array<Memo>}
     * @memberof Category
     */
    'memo': Array<Memo>;
    /**
     * 
     * @type {Array<Tag>}
     * @memberof Category
     */
    'tag': Array<Tag>;
}

