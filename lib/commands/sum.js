"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSumCommand = void 0;
const openai_1 = require("openai");
const axios_1 = require("axios");
const jsdom_1 = require("jsdom");
const Readability = require('@mozilla/readability').Readability;
function runSumCommand(roomId, event, args, client) {
    return __awaiter(this, void 0, void 0, function* () {
        const URL = args[1];
        const apiKey = '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';
        const maxTokens = 512;
        const promptEnding = 'Please return a summary of the information above in a short paragraph in natural language';
        // tslint:disable-next-line:no-shadowed-variable
        const truncateText = (text, maxTokens) => {
            let tokens = text.split(' ');
            if (tokens.length > maxTokens) {
                tokens = tokens.slice(0, maxTokens);
            }
            return tokens.join(' ');
        };
        let content;
        try {
            const response = yield axios_1.default.get(URL);
            const doc = new jsdom_1.JSDOM(response.data);
            const reader = new Readability(doc.window.document);
            const article = reader.parse();
            if (!article) {
                console.log("Content is null for URL: ", URL);
                content = "No Description Provided";
            }
            else {
                content = article.textContent;
            }
            const prompt = truncateText(content, maxTokens - promptEnding.length) + promptEnding;
            const configuration = new openai_1.Configuration({
                apiKey: apiKey,
            });
            const openai = new openai_1.OpenAIApi(configuration);
            const apiResponse = yield openai.createCompletion({
                model: "text-davinci-003",
                prompt: prompt,
                max_tokens: maxTokens,
                temperature: 0.4,
            });
            let summary = apiResponse.data.choices[0].text.trim();
            summary = summary.replace(/^\.\n/, '');
            return client.sendMessage(roomId, {
                body: summary,
                msgtype: "m.notice",
                format: "org.matrix.custom.html",
                formatted_body: summary,
            });
        }
        catch (error) {
            console.log("Error: ", error);
        }
    });
}
exports.runSumCommand = runSumCommand;
//# sourceMappingURL=sum.js.map