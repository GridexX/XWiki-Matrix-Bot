import { MAX_ROW, QUERY_API_URL } from "../constants/api";
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
import { Configuration, OpenAIApi } from "openai";
import { MessageSearch } from "../models/messages";

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

// @ts-ignore
async function getResume(content_json: string): Promise<string> {
    // Check if content_json is null or empty
    if (!content_json || content_json.trim() === "") {
        console.log("Content is null or empty");
        return "No Description Provided";
    }

    // tslint:disable-next-line:no-shadowed-variable
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
        apiKey: "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",
    });

    const openai = new OpenAIApi(configuration);

    const apiResponse = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: maxTokens,
        temperature: 0.4,
    });
    return apiResponse.data.choices[0].text;
}

function searchXWiki(query: string): Promise<AxiosResponse<SearchResults>> {
    const url = `${QUERY_API_URL}/query?media=json&prettyNames=true&type=solr&number=${MAX_ROW}&q=${query}`;
    return axios.get(url);
}

async function getPage(url: string): Promise<PageSearchResult> {
    const pageResult = await searchPage(url);
    return pageResult.data;
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
        const { xwikiAbsoluteUrl: href, content } = await getPage(
            searchResult.links[0].href
        );
        const resume = await getResume(content);

        messageSearch.data.push({
            author: searchResult.author,
            authorName: searchResult.authorName,
            modified: new Date(searchResult.modified),
            pageFullName: searchResult.pageFullName,
            title: searchResult.title,
            score: searchResult.score,
            href,
            resume,
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
            <a href=${result.href}>Link</a><br/>
            <i>${result.resume}</i>
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
            return (
                client
                    .sendMessage(roomId, createRichMessage(roomId, ev, result))
                    // tslint:disable-next-line:no-shadowed-variable
                    .catch((error: any) => {
                        console.error(error); // Handle error here
                    })
            );
        })
        // tslint:disable-next-line:no-shadowed-variable
        .catch((error: any) => {
            console.error(error); // Handle error here
        });
}
