import type { RequestInfo, RequestInit, Response } from "node-fetch";

interface CompletionResponse {
    choices: {
        text: string;
    }[];
}

export default async function summarize(content: string): Promise<string> {
    const API_URL = "https://api.openai.com/v1/completions";
    const API_KEY = "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";

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
