import { MatrixClient, MessageEvent, MessageEventContent } from "matrix-bot-sdk";
import { JSDOM } from 'jsdom';
import { summarize } from './summurizer';

export async function runSumCommand(roomId: string, event: MessageEvent<MessageEventContent>, args: string[], client: MatrixClient) {
    // Parse the URL from the command arguments
    const url = args[1];
    if (!url) {
        console.log("Error: Invalid URL")
        return;
    }

    try {
        // Send a GET request to the Wiki page
        const response = await fetch(url);
        const text = await response.text();

        // Parse the HTML response
        const dom = new JSDOM(text);

        // Extract the main content from the parsed HTML
        const mainContent = dom.window.document.getElementById('mainContentArea').textContent;

        // Generate a summary of the main content using an AI model
        const summary = await summarize(mainContent);

        // Send the summary as a notice
        return client.sendMessage(roomId, {
            body: summary,
            msgtype: "m.notice",
            format: "org.matrix.custom.html",
            formatted_body: summary,
        });
    } catch (error) {
        console.error(error);
    }
}
