import axios, { AxiosResponse } from "axios";
import {
    MatrixClient,
    MessageEvent,
    MessageEventContent,
    RichReply,
} from "matrix-bot-sdk";
import {
    PageSearchResult,
    SearchResult,
    SearchResults,
} from "../models/search";
import { MessageSearch } from "../models/messageSearch";
import { error } from "console";

const xwikiUrl = process.env.XWIKI_URL || "https://www.xwiki.org";
// const xwikiUsername = process.env.XWIKI_USERNAME;
// const xwikiPassword = process.env.XWIKI_PASSWORD;

axios.interceptors.request.use((config) => {
    config.headers.Accept = "application/json";
    config.headers["User-Agent"] = "nosso";
    return config;
});

function searchPage(url: string): Promise<AxiosResponse<PageSearchResult>> {
    return axios.get(`${url}?media=json`);
}

function searchXWiki(query: string): Promise<AxiosResponse<SearchResults>> {
    const url = `${xwikiUrl}/xwiki/rest/wikis/query?media=json&prettyNames=true&type=solr&q=${query}`;
    return axios.get(url);
}

async function getHrefFromPage(url: string): Promise<string> {
    const pageResult = await searchPage(url);
    return pageResult.data.xwikiAbsoluteUrl;
}

// This function takes the results from the REST API and converts them into message data for the BOT
async function convertSearchResults(
    searchResults: SearchResult[]
): Promise<MessageSearch> {
    let messageSearch: MessageSearch = {
        results: searchResults.length,
        data: [],
    };

    for (let index = 0; index < searchResults.length; index++) {
        const searchResult = searchResults[index];
        const href = await getHrefFromPage(searchResult.links[0].href);
        messageSearch.data.push({
            author: searchResult.author,
            authorName: searchResult.authorName,
            modified: new Date(searchResult.modified),
            pageFullName: searchResult.pageFullName,
            title: searchResult.title,
            score: searchResult.score,
            href,
        });
    }

    return messageSearch;
}

function createRichMessage(
    roomId: string,
    ev: any,
    message: MessageSearch
): any {
    const text = `Search results: ${message.results}\n`;
    let html = "<ul>";
    message.data.forEach((result) => {
        html += `
        <li>
            <strong> ${result.title} </strong> <br/>
            <i>${result.authorName}</i> / 
            ${result.modified.toDateString()} <br/>
            <a href=${result.href}>Link</a>
        </li>
        `;
    });
    html += "</ul>";
    const reply = RichReply.createFor(roomId, ev, text, html); // Note that we're using the raw event, not the parsed one!
    reply["msgtype"] = "m.notice";
    return reply;
}

export async function runSearchCommand(
    roomId: string,
    ev: any,
    event: MessageEvent<MessageEventContent>,
    args: string[],
    client: MatrixClient
) {
    let echo = args;
    echo.shift();
    const query = echo.join(" ");

    searchXWiki(query)
        .then(async (response: AxiosResponse<SearchResults>) => {
            const data = response.data;
            const result = await convertSearchResults(data.searchResults);

            // Return the result to the chat
            return client
                .sendMessage(roomId, createRichMessage(roomId, ev, result))
                .catch((error: any) => {
                    console.error(error); // Handle error here
                });
        })
        .catch((error: any) => {
            console.error(error); // Handle error here
        });
}
