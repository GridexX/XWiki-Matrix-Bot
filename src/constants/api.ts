import config from "../config";

export const XWIKI_URL = config.xwikiUrl;
export const QUERY_API_URL = `${XWIKI_URL}/xwiki/rest/wikis/query`;
export const MAX_ROW = process.env.MAX_ROW ?? 10;
