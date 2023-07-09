import axios, { AxiosResponse } from "axios";
import { LogService, MatrixClient, RichReply } from "matrix-bot-sdk";
import { Configuration, OpenAIApi } from "openai";
import { MAX_ROW, QUERY_API_URL } from "../constants/api";
import {
    PageSearchResult,
    SearchResult,
    SearchResults,
} from "../models/searchModel";
import { MessageSearch } from "../models/messages";
import config from "../config";

function searchPage(url: string): Promise<AxiosResponse<PageSearchResult>> {
    return axios.get(`${url}?media=json`);
}

// Get the resume of the article by calling ChatGPT prompt
async function getResume(content_json: string): Promise<string> {
    // Check if content_json is null or empty
    if (!content_json || content_json.trim() === "") {
        LogService.warn("Search - getResume", "content empty or null");
        return "No Description Provided";
    }

    const truncateText = (text: string, maxTokens: number) => {
        let tokens = text.split(" ");
        if (tokens.length > maxTokens) {
            tokens = tokens.slice(0, maxTokens);
        }
        return tokens.join(" ");
    };
    const maxTokens = 512;
    const promptEnding =
        "Please return a summary of the information above in one short sentence";
    const prompt =
        truncateText(content_json, maxTokens - promptEnding.length) +
        promptEnding;
    const configuration = new Configuration({
        apiKey: config.openai.apiKey,
    });
    try {
        const openai = new OpenAIApi(configuration);

        const apiResponse = await openai.createCompletion({
            model: "text-davinci-003",
            prompt,
            max_tokens: maxTokens,
            temperature: 0.4,
        });
        return apiResponse.data.choices[0].text;
    } catch (error) {
        LogService.error("Search - getResume", error);
        return "";
    }
}

function searchXWiki(query: string): Promise<AxiosResponse<SearchResults>> {
    const url = `${QUERY_API_URL}/query?media=json&prettyNames=true&type=solr&number=${MAX_ROW}&q=${query}`;
    return axios.get(url);
}

async function getPage(url: string): Promise<PageSearchResult> {
    const pageResult = await searchPage(url);
    return pageResult.data;
}

async function convertSearchResults(
    searchResults: SearchResult[]
): Promise<MessageSearch> {
    const messageSearch: MessageSearch = {
        results: searchResults.length,
        data: [],
    };

    // Retrieve each pages and the content for each of them
    const promises = searchResults.map(async (searchResult) => {
        const { xwikiAbsoluteUrl: href, content } = await getPage(
            searchResult.links[0].href
        );
        const resume = await getResume(content);

        return {
            author: searchResult.author,
            authorName: searchResult.authorName,
            modified: new Date(searchResult.modified),
            pageFullName: searchResult.pageFullName,
            title: searchResult.title,
            score: searchResult.score,
            href,
            resume,
        };
    });

    const searchData = await Promise.all(promises);
    messageSearch.data = searchData;

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
            <a href=${result.href}>Link</a><br/>
            <i>${result.resume}</i>
        </li>
        <br/>
        `;
    });
    html += "</ul>";
    const reply = RichReply.createFor(roomId, ev, text, html); // Note that we're using the raw event, not the parsed one!
    reply.msgtype = "m.notice";
    return reply;
}

export default async function runSearchCommand(
    roomId: string,
    ev: any,
    args: string[],
    client: MatrixClient
) {
    const echo = args;
    echo.shift();
    const query = echo.join(" ");

    searchXWiki(query)
        .then(async (response: AxiosResponse<SearchResults>) => {
            const { data } = response;
            const result = await convertSearchResults(data.searchResults);

            // Return the result to the chat
            return client
                .sendMessage(roomId, createRichMessage(roomId, ev, result))
                .catch((error: any) => {
                    LogService.error("runSearchCommand", error);
                });
        })
        .catch((error: any) => {
            LogService.error("runSearchCommand", error);
        });
}
