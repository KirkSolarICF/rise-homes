import {Jsona} from "jsona";
import {DrupalJsonApiParams} from "drupal-jsonapi-params";
import type {DrupalNode} from "../types.ts";
import type {TJsonApiBody} from "jsona/lib/JsonaTypes";

// NOTE, required for localhost to connect to Drupal. node default connection is IPv6, this forces IPv4
// import dns from 'node:dns';
// dns.setDefaultResultOrder('ipv4first');

// Get the Drupal Base Url.
export const baseUrl: string = import.meta.env.DRUPAL_BASE_URL;

/**
 * Fetch url from Drupal.
 *
 * @param url
 *
 * @return Promise<TJsonaModel | TJsonaModel[]> as Promise<any>
 */
export const fetchUrl = async (url: string): Promise<any> => {
    const request: Response = await fetch(url);
    const json: string | TJsonApiBody = await request.json();
    const dataFormatter: Jsona = new Jsona();
    return dataFormatter.deserialize(json);
}

/**
 * Get all published pages.
 *
 * @return Promise<DrupalNode[]>
 */
export const getPages= async (): Promise<DrupalNode[]> => {
    const params: DrupalJsonApiParams = new DrupalJsonApiParams();
    params
        .addFields('node--page',  [
            "title",
            "path",
            "field_media_image",
            "body",
            "created",
        ])
        .addInclude(['field_media_image.field_media_image'])
        .addFields('media--image', ['field_media_image'])
        .addFields('file--file', ['uri', 'image_style_uri', 'resourceIdObjMedia'])
        .addFilter("status", "1");
    const path: string = params.getQueryString();
    return await fetchUrl(baseUrl + '/jsonapi/node/page?' + path);
}


/**
 * Get all published pages of the flex_content Drupal content type.
 *
 * @return Promise<DrupalNode[]>
 */
export const getFlexContent = async (): Promise<DrupalNode[]> => {
    // builds the query string parameters for an article
    const params: DrupalJsonApiParams = new DrupalJsonApiParams();
    // include any field you need to retrieve from the database within the "article" content type
    params
        .addFields("node--flex_content", [
            "title",
            "path",
            "field_hero",
            "field_main_content",
        ])
        .addInclude([
          'field_hero',
          'field_hero.field_image.field_media_image',
          'field_main_content.field_wrapped_content',
          // 'field_main_content.field_thumb_card', // seems we dont need this include.
          'field_main_content.field_thumb_card.field_image.field_media_svg'
        ])
        .addFields('media--image', ['field_media_image'])
        .addFields('media--vector', ['field_media_svg'])
        .addFields('file--file', ['uri', 'image_style_uri', 'resourceIdObjMedia'])
        .addFilter("status", "1");
    // convert the params into a query string
    const path: string = params.getQueryString();
    // console.log(baseUrl + '/jsonapi/node/flex_content?' + path);
    // append the params to build the database fetch, export the result to the article page template
    return await fetchUrl(baseUrl + '/jsonapi/node/flex_content?' + path);
}
