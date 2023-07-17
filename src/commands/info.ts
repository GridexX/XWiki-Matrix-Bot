import { MatrixClient } from "matrix-bot-sdk";

export default async function runInfoCommand(
    roomId: string,
    client: MatrixClient
) {
    // Define the information to be returned
    const botVersion = "0.1.0";
    const botDesc =
        "This is an example bot, that aims to provide a XWiki integration into a Matrix environment";

    // Format the information text
    const text = `AIbot Version: ${botVersion}\nDescription: ${botDesc}`;

    // Now send that message as a notice
    return client.sendMessage(roomId, {
        body: text,
        msgtype: "m.notice",
        format: "org.matrix.custom.html",
        formatted_body: text,
    });
}
