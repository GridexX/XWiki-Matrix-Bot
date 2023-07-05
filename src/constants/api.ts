import config from "../config";

export const XWIKI_URL =
    process.env.XWIKI_URL || config.xwikiUrl || "https://www.xwiki.org";
export const QUERY_API_URL = XWIKI_URL + "/xwiki/rest/wikis/query";
export const MAX_ROW = process.env.MAX_ROW ?? 10;
