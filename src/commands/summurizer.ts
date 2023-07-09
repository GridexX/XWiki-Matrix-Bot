import type { RequestInfo, RequestInit, Response } from "node-fetch";
import config from "../config";

interface CompletionResponse {
    choices: {
        text: string;
    }[];
}

export default async function summarize(content: string): Promise<string> {
    const API_URL = config.openai.url;
    const API_KEY = config.openai.apiKey;

    const data = {
        model: "text-davinci-003",
        prompt: `${content} Main goal: Summurize all the information above in natural language`,
        max_tokens: 1024,
    };

    // Dynamically import node-fetch
    const nodeFetch = await import("node-fetch");
    const fetch = nodeFetch.default as (
        url: RequestInfo,
        init?: RequestInit
    ) => Promise<Response>;

    const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
        },
    });

    const responseData = (await response.json()) as CompletionResponse;
    const summary = responseData.choices[0].text.trim();
    return summary;
}
