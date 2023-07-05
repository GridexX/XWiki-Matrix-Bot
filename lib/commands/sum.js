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
const jsdom_1 = require("jsdom");
const summurizer_1 = require("./summurizer");
function runSumCommand(roomId, event, args, client) {
    return __awaiter(this, void 0, void 0, function* () {
        // Parse the URL from the command arguments
        const url = args[1];
        if (!url) {
            console.log("Error: Invalid URL");
            return;
        }
        try {
            // Send a GET request to the Wiki page
            const response = yield fetch(url);
            const text = yield response.text();
            // Parse the HTML response
            const dom = new jsdom_1.JSDOM(text);
            // Extract the main content from the parsed HTML
            const mainContent = dom.window.document.getElementById('mainContentArea').textContent;
            // Generate a summary of the main content using an AI model
            const summary = yield summurizer_1.summarize(mainContent);
            // Send the summary as a notice
            return client.sendMessage(roomId, {
                body: summary,
                msgtype: "m.notice",
                format: "org.matrix.custom.html",
                formatted_body: summary,
            });
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.runSumCommand = runSumCommand;
//# sourceMappingURL=sum.js.map