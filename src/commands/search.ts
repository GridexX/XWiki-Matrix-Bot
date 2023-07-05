import axios, { AxiosResponse } from "axios";
import {
    MatrixClient,
    MessageEvent,
    MessageEventContent,
    RichReply,
} from "matrix-bot-sdk";
import { SearchResult, SearchResults } from "../models/search";
import { MessageSearch } from "../models/messageSearch";

const urlRegex =
    /(http.*?:\/\/)(.*?)([.].*?)(\/rest\/wikis\/)(.*?)\/spaces\/(.*)/;
const xwikiUrl = process.env.XWIKI_URL || "https://www.xwiki.org";
// const xwikiUsername = process.env.XWIKI_USERNAME;
// const xwikiPassword = process.env.XWIKI_PASSWORD;

axios.interceptors.request.use((config) => {
    config.headers.Accept = "application/json";
    config.headers["User-Agent"] = "nosso";
    return config;
});

function searchXWiki(query: string): Promise<AxiosResponse<any>> {
    const url = `${xwikiUrl}/xwiki/rest/wikis/query?media=json&prettyNames=true&type=solr&q=${query}`;
    return axios.get(url);
}

// TODO: Instead, request the first link in the HREF Array. Find the URL behind the <xwikiAbsoluteUrl></xwikiAbsoluteUrl> TAG
function replaceUrl(url: string): string {
    let urlReplace = url.replace("/xwiki/rest/wikis", "");
    urlReplace = urlReplace.replace("/pages/WebHome", "");
    urlReplace = urlReplace.replace("/spaces", "");
    urlReplace = urlReplace.replace("%20", " ");
    urlReplace = urlReplace.replace(xwikiUrl, `${xwikiUrl}/bin/view`);
    return urlReplace;
}

// This function takes the results from the REST API and converts them into message data for the BOT
function convertSearchResults(searchResults: SearchResult[]): MessageSearch {
    let messageSearch: MessageSearch = {
        results: searchResults.length,
        data: [],
    };

    searchResults.forEach((searchResult) => {
        messageSearch.data.push({
            author: searchResult.author,
            authorName: searchResult.authorName,
            modified: new Date(searchResult.modified),
            pageFullName: searchResult.pageFullName,
            title: searchResult.title,
            score: searchResult.score,
            href: replaceUrl(searchResult.links[0].href),
        });
    });

    //TODO Sort result based on score

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
        .then((response: AxiosResponse<SearchResults>) => {
            const data = response.data;
            const result = convertSearchResults(data.searchResults);

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
