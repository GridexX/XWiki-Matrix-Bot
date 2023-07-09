import {
    LogService,
    MatrixClient,
    MessageEvent,
    RichReply,
    UserID,
} from "matrix-bot-sdk";
import * as htmlEscape from "escape-html";
import { RedisClientType } from "redis";
import runHelloCommand from "./hello";
import runPingCommand from "./ping";
import runEchoCommand from "./echo";
import runInfoCommand from "./info";
import runSumCommand from "./sum";
import runSearchCommand from "./search";
import runAskCommand from "./ask";
import listUsers from "./users";
import { RedisMessage } from "../models/RedisMessage";
import runMessageCommand from "./messages";

// The prefix required to trigger the bot. The bot will also respond
// to being pinged directly.
export const COMMAND_PREFIX = "!aibot";

// This is where all of our commands will be handled
export default class CommandHandler {
    // Just some variables so we can cache the bot's display name and ID
    // for command matching later.
    private displayName: string;

    private userId: string;

    private localpart: string;

    constructor(
        private client: MatrixClient,
        private redisClient: RedisClientType<any>
    ) {}

    public async start() {
        // Populate the variables above (async)
        await this.prepareProfile();

        // Set up the event handler
        this.client.on("room.message", this.onMessage.bind(this));
    }

    private async prepareProfile() {
        this.userId = await this.client.getUserId();
        this.localpart = new UserID(this.userId).localpart;

        try {
            const profile = await this.client.getUserProfile(this.userId);
            if (profile && profile.displayname)
                this.displayName = profile.displayname;
        } catch (e) {
            // Non-fatal error - we'll just log it and move on.
            LogService.warn("CommandHandler", e);
        }
    }

    private async onMessage(roomId: string, ev: any) {
        const event = new MessageEvent(ev);
        if (event.isRedacted) return; // Ignore redacted events that come through
        if (event.sender === this.userId) return; // Ignore ourselves
        if (event.messageType !== "m.text") return; // Ignore non-text messages

        // Ensure that the event is a command before going on. We allow people to ping
        // the bot as well as using our COMMAND_PREFIX.
        const prefixes = [
            COMMAND_PREFIX,
            `${this.localpart}:`,
            `${this.displayName}:`,
            `${this.userId}:`,
        ];
        const prefixUsed = prefixes.find((p) => event.textBody.startsWith(p));
        // Not a command (as far as we're concerned)
        // SAve the message in Redis
        if (!prefixUsed) {
            const redisMessage: RedisMessage = {
                sender: event.sender,
                text: event.textBody,
                timestamp: event.timestamp,
                roomId,
            };
            this.redisClient
                .lPush("messages", JSON.stringify(redisMessage))
                .then(() =>
                    LogService.debug(
                        "RedisClient",
                        `Entry added ${JSON.stringify(redisMessage)}`
                    )
                )
                .catch((error) => LogService.error("RedisClient", error));
            return;
        }

        // Check to see what the arguments were to the command
        const args = event.textBody
            .substring(prefixUsed.length)
            .trim()
            .split(" ");

        // Try and figure out what command the user ran, defaulting to help
        try {
            switch (args[0]) {
                case "hello": {
                    await runHelloCommand(roomId, event, args, this.client);
                    break;
                }
                case "ping": {
                    await runPingCommand(roomId, this.client);
                    break;
                }
                case "echo": {
                    await runEchoCommand(roomId, args, this.client);
                    break;
                }
                case "info": {
                    await runInfoCommand(roomId, this.client);
                    break;
                }
                case "sum": {
                    await runSumCommand(roomId, args, this.client);
                    break;
                }
                case "search": {
                    await runSearchCommand(roomId, ev, args, this.client);
                    break;
                }
                case "users": {
                    listUsers(roomId, ev, this.client);
                    break;
                }

                case "ask": {
                    await runAskCommand(roomId, event, args, this.client);
                    break;
                }

                case "messages": {
                    await runMessageCommand(
                        roomId,
                        ev,
                        args,
                        this.client,
                        this.redisClient
                    );
                    break;
                }
                default: {
                    const help =
                        "" +
                        `!${COMMAND_PREFIX} search [words]     - Search for pages into an XWiki instance\n` +
                        `!${COMMAND_PREFIX} users              - List users in XWiki \n` +
                        `!${COMMAND_PREFIX} ask [question]     - Ask a question based on XWiki details\n` +
                        `!${COMMAND_PREFIX} messages           - List last 20 messages` +
                        `!${COMMAND_PREFIX} help               - This menu\n`;

                    const text = `Help menu:\n${help}`;
                    const html = `<b>Help menu:</b><br /><pre><code>${htmlEscape(
                        help
                    )}</code></pre>`;
                    const reply = RichReply.createFor(roomId, ev, text, html); // Note that we're using the raw event, not the parsed one!
                    reply.msgtype = "m.notice"; // Bots should always use notices
                    await this.client.sendMessage(roomId, reply);
                }
            }
        } catch (e) {
            // Log the error
            LogService.error("CommandHandler", e);

            // Tell the user there was a problem
            const message = "There was an error processing your command";
            const reply = RichReply.createFor(roomId, ev, message, message); // We don't need to escape the HTML because we know it is safe
            reply.msgtype = "m.notice";
            await this.client.sendMessage(roomId, reply);
        }
    }
}
