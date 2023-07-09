import { LogService } from "matrix-bot-sdk";
import * as dotenv from "dotenv";

interface IConfig {
    matrixBot: {
        homeserverUrl: string;
        use: boolean;
        username: string;
        password: string;
        accessToken: string;
        dataPath: string;
        autoJoin: boolean;
    };
    openai: {
        url: string;
        apiKey: string;
    };
    xwikiUrl: string;
}

function readConfig(): IConfig {
    const config: IConfig = {
        matrixBot: {
            homeserverUrl: process.env.MATRIX_BOT_HOMESERVER_URL || "",
            use: true,
            username: process.env.MATRIX_BOT_USERNAME || "",
            password: process.env.MATRIX_BOT_PASSWORD || "",
            accessToken: process.env.MATRIX_BOT_ACCESS_TOKEN || "",
            dataPath: process.env.MATRIX_BOT_DATA_PATH || "",
            autoJoin: process.env.MATRIX_BOT_AUTOJOIN === "true",
        },
        openai: {
            url:
                process.env.OPENAI_URL ||
                "https://api.openai.com/v1/completions",
            apiKey: process.env.OPENAI_API_KEY || "",
        },
        xwikiUrl: process.env.XWIKI_URL || "",
    };

    const missingFields: string[] = [];

    // Check for missing values
    if (!config.matrixBot.homeserverUrl)
        missingFields.push("MATRIX_BOT_HOMESERVER_URL");
    if (!config.matrixBot.username) missingFields.push("MATRIX_BOT_USERNAME");
    if (!config.matrixBot.password) missingFields.push("MATRIX_BOT_PASSWORD");
    if (!config.matrixBot.accessToken)
        missingFields.push("MATRIX_BOT_ACCESS_TOKEN");
    if (!config.matrixBot.dataPath) missingFields.push("MATRIX_BOT_DATA_PATH");
    if (!config.openai.apiKey) missingFields.push("OPENAI_API_KEY");
    if (!config.xwikiUrl) missingFields.push("XWIKI_URL");

    if (missingFields.length > 0) {
        const errorMessage = `Missing configuration values: ${missingFields.join(
            ", "
        )}`;
        LogService.error(errorMessage);
        throw new Error(errorMessage);
    }

    return config;
}

// Load environment variables from the .env file
dotenv.config();

// Call readConfig to get the configuration object
const config: IConfig = readConfig();

export default config;
