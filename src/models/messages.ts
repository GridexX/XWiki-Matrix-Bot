export type MessageSearch = {
    results: number;
    data: SearchData[];
};

type SearchData = {
    pageFullName: string;
    title: string;
    href: string;
    score: number;
    author: string;
    authorName: string;
    modified: Date;
};

export type MessageListUser = {
    results: number;
    data: UserData[];
};

export type UserData = {
    name: string;
    href: string;
    modified: Date;
};
