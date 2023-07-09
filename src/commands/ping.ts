import { MatrixClient } from "matrix-bot-sdk";

export default async function runPingCommand(
    roomId: string,
    client: MatrixClient
) {
    const text = `Pong!`;

    // Now send that message as a notice
    return client.sendMessage(roomId, {
        body: text,
        msgtype: "m.notice",
        format: "org.matrix.custom.html",
        formatted_body: text,
    });
}
