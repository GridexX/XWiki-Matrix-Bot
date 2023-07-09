import {
    LogService,
    MatrixClient,
    MessageEvent,
    MessageEventContent,
} from "matrix-bot-sdk";
import axios from "axios";

export default async function runAskCommand(
    roomId: string,
    event: MessageEvent<MessageEventContent>,
    args: string[],
    client: MatrixClient
) {
    const XWIKI_AI_API =
        process.env.XWIKI_URL ||
        "http://192.168.150.82:15480/xwiki/rest/gptsearch/chat/completion";

    const userPrompt = args.join(" ");

    axios
        .post(
            XWIKI_AI_API,
            {
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: userPrompt },
                ],
            },
            {
                timeout: 8000, // 20 seconds
            }
        )
        .then((response) => {
            const aiReply = response.data.choices[0].message.content;

            // Enhance the AI's reply with some basic HTML formatting
            const formattedAiReply = `<i>XWiki Knowledge Base:</i> <b>${aiReply}</b>`;

            LogService.debug("runAskCommand", aiReply);

            // Now send that message as a notice
            return client.sendMessage(roomId, {
                body: aiReply,
                msgtype: "m.notice",
                format: "org.matrix.custom.html",
                formatted_body: formattedAiReply,
            });
        })
        .catch((error) => {
            // Default message if the server doesn't reply within 20s
            const defaultMessage =
                "The assistant is currently unavailable. Please try again later.";
            const formattedDefaultMessage = `<i>${defaultMessage} ${error}</i>`;

            // Send default message as a notice
            return client.sendMessage(roomId, {
                body: defaultMessage,
                msgtype: "m.notice",
                format: "org.matrix.custom.html",
                formatted_body: formattedDefaultMessage,
            });
        });
}
