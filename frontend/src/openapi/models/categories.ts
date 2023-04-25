/* tslint:disable */
/* eslint-disable */
/**
 * My API
 * An API to do awesome things
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


// May contain unused imports in some cases
// @ts-ignore
import { Memos } from './memos';
// May contain unused imports in some cases
// @ts-ignore
import { Tags } from './tags';

/**
 * 
 * @export
 * @interface Categories
 */
export interface Categories {
    /**
     * 
     * @type {number}
     * @memberof Categories
     */
    'id': number;
    /**
     * 
     * @type {string}
     * @memberof Categories
     */
    'createAt': string;
    /**
     * 
     * @type {string}
     * @memberof Categories
     */
    'updateAt': string;
    /**
     * 
     * @type {string}
     * @memberof Categories
     */
    'cateName': string | null;
    /**
     * 
     * @type {object}
     * @memberof Categories
     */
    'user': object;
    /**
     * 
     * @type {Memos}
     * @memberof Categories
     */
    'memos': Memos;
    /**
     * 
     * @type {Tags}
     * @memberof Categories
     */
    'tags': Tags;
}

