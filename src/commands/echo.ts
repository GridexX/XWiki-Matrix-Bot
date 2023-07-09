import { MatrixClient } from "matrix-bot-sdk";

export default async function runEchoCommand(
    roomId: string,
    args: string[],
    client: MatrixClient
) {
    const echo = args;
    echo.shift();
    const text = echo.join(" ");

    // Now send that message as a notice
    return client.sendMessage(roomId, {
        body: text,
        msgtype: "m.notice",
        format: "org.matrix.custom.html",
        formatted_body: text,
    });
}
