import { MatrixClient, MessageEvent, MessageEventContent } from "matrix-bot-sdk";
import { Configuration, OpenAIApi } from "openai";
import axios from "axios";
import { JSDOM } from "jsdom";
const Readability = require('@mozilla/readability').Readability;

export async function runSumCommand(roomId: string, event: MessageEvent<MessageEventContent>, args: string[], client: MatrixClient) {
    const URL = args[1];
    const apiKey = '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';
    const maxTokens = 512;
    const promptEnding = 'Please return a summary of the information above in a short paragraph in natural language';

    // tslint:disable-next-line:no-shadowed-variable
    const truncateText = (text: string, maxTokens: number) => {
        let tokens = text.split(' ');
        if (tokens.length > maxTokens) {
            tokens = tokens.slice(0, maxTokens);
        }
        return tokens.join(' ');
    };

    let content;
    try {
        const response = await axios.get(URL);
        const doc = new JSDOM(response.data);
        const reader = new Readability(doc.window.document);
        const article = reader.parse();

        if (!article) {
            console.log("Content is null for URL: ", URL);
            content = "No Description Provided";
        } else {
            content = article.textContent;
        }

        const prompt = truncateText(content, maxTokens - promptEnding.length) + promptEnding;

        const configuration = new Configuration({
            apiKey: apiKey,
        });

        const openai = new OpenAIApi(configuration);

        const apiResponse = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: maxTokens,
            temperature: 0.4,
        });

        let summary = apiResponse.data.choices[0].text.trim();
        summary = summary.replace(/^\.\n/, '');

        return client.sendMessage(roomId, {
            body: summary,
            msgtype: "m.notice",
            format: "org.matrix.custom.html",
            formatted_body: summary,
        });

    } catch (error) {
        console.log("Error: ", error);
    }
}
