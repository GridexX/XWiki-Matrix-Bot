import { LinkSearchResult } from "./search";

export type SearchUserResult = {
    searchResults: SearchUser[];
};

export type SearchUser = {
    links: LinkSearchResult[];
    pageName: string;
    modified: string;
};

export type UserPageData = {
    xwikiAbsoluteUrl: string;
};
