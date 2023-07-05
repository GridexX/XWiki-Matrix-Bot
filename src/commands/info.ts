import { MatrixClient, MessageEvent, MessageEventContent } from "matrix-bot-sdk";
import * as htmlEscape from "escape-html";

export async function runInfoCommand(roomId: string, event: MessageEvent<MessageEventContent>, args: string[], client: MatrixClient) {

    // Define the information to be returned
    const botVersion = "0.0.1";
    const botDesc = "This is an example bot, that aims to provide a XWiki integration into a Matrix environment";

    // Format the information text
    let text = `Bot Version: ${botVersion}\nDescription: ${botDesc}`;

    // Now send that message as a notice
    return client.sendMessage(roomId, {
        body: text,
        msgtype: "m.notice",
        format: "org.matrix.custom.html",
        formatted_body: text,
    });
}
