import { MatrixClient, MessageEvent, MessageEventContent } from "matrix-bot-sdk";
import * as htmlEscape from "escape-html";

export async function runEchoCommand(roomId: string, event: MessageEvent<MessageEventContent>, args: string[], client: MatrixClient) {

	let echo = args;
	echo.shift();
    let text = echo.join(' ');

    // Now send that message as a notice
    return client.sendMessage(roomId, {
        body: text,
        msgtype: "m.notice",
        format: "org.matrix.custom.html",
        formatted_body: text,
    });
}
