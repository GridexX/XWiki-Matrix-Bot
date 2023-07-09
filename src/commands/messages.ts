import { LogService, MatrixClient, RichReply } from "matrix-bot-sdk";
import { RedisClientType } from "redis";
import * as htmlEscape from "escape-html";
import { RedisMessage } from "../models/RedisMessage";

function createRichMessage(roomId: string, ev: any, messages: RedisMessage[]) {
    const text = `Search results: ${messages.length}\n`;
    let html = "";
    if (messages.length < 1) {
        html = "No last messages";
    } else {
        html = `<p>Last ${messages.length} messages :</p><ul>`;
        messages.forEach((message) => {
            html += `
        <li>
        <p><strong> ${message.sender} </strong>
        ${new Date(message.timestamp).toLocaleString()} </p>
        <i>${htmlEscape(message.text)}</i>
        </li>
        <br/>
        `;
        });
        html += "</ul>";
    }
    const reply = RichReply.createFor(roomId, ev, text, html); // Note that we're using the raw event, not the parsed one!
    reply.msgtype = "m.notice";
    return reply;
}

export default async function runMessageCommand(
    roomId: string,
    ev: any,
    args: string[],
    client: MatrixClient,
    redisClient: RedisClientType<any>
) {
    const numberMessages = 20;

    const messages = await redisClient.lRange("messages", 0, numberMessages);
    const redisMessages: RedisMessage[] = [];

    messages.forEach((message) => {
        const redisMessage: RedisMessage = JSON.parse(message);
        // Appends messages if roomId are similar
        if (redisMessage.roomId === roomId) {
            redisMessages.push(JSON.parse(message));
        }
    });

    return client
        .sendMessage(roomId, createRichMessage(roomId, ev, redisMessages))
        .catch((error: any) => {
            LogService.error("runMessageCommand", error);
        })
        .then(() => {
            LogService.debug("runMessageCommand", messages);
        });
}
