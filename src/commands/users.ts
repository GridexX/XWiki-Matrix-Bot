import axios, { AxiosResponse } from "axios";
import { MatrixClient, RichReply } from "matrix-bot-sdk";
import { MessageListUser } from "../models/messages";
import { QUERY_API_URL } from "../constants/api";
import {
    SearchUser,
    SearchUserResult,
    UserPageData,
} from "../models/userModel";

async function searchUsers(): Promise<AxiosResponse<SearchUserResult>> {
    const url = `${QUERY_API_URL}?media=json&q=object:XWiki.XWikiUsers`;
    return axios.get(url);
}

async function searchUserPage(url: string): Promise<string> {
    return (
        await (
            await axios.get<Promise<UserPageData>>(`${url}?media=json`)
        ).data
    ).xwikiAbsoluteUrl;
}

async function convertUsers(users: SearchUser[]): Promise<MessageListUser> {
    const messageUser: MessageListUser = {
        results: users.length,
        data: [],
    };

    const promises = users.map(async (user) => {
        const href = await searchUserPage(user.links[0].href);

        return {
            name: user.pageName,
            modified: new Date(user.modified),
            href,
        };
    });

    const userData = await Promise.all(promises);
    messageUser.data = userData;

    return messageUser;
}

function createRichMessage(
    roomId: string,
    ev: any,
    message: MessageListUser
): any {
    const text = `Search results: ${message.results}\n`;
    let html = "<ul>";
    message.data.forEach((result) => {
        html += `
      <li>
          <strong> ${result.name} </strong> <br/>
          ${result.modified.toDateString()} <br/>
          <a href=${result.href}>Link</a>
      </li>
      `;
    });
    html += "</ul>";
    const reply = RichReply.createFor(roomId, ev, text, html); // Note that we're using the raw event, not the parsed one!
    reply.msgtype = "m.notice";
    return reply;
}

export default async function listUsers(
    roomId: string,
    ev: any,
    client: MatrixClient
) {
    searchUsers()
        .then(async (response: AxiosResponse<SearchUserResult>) => {
            const { data } = response;
            const result = await convertUsers(data.searchResults);
            return client
                .sendMessage(roomId, createRichMessage(roomId, ev, result))
                .catch((error: any) => {
                    console.error(error); // Handle error here
                });
        })
        .catch((error: any) => {
            console.error(error);
        });
}
