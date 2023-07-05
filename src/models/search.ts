export type SearchResults = {
    searchResults: SearchResult[];
};

export type SearchResult = {
    type: string;
    id: string;
    pageFullName: string;
    title: string;
    wiki: string;
    space: string;
    pageName: string;
    modified: number;
    author: string;
    authorName: string;
    version: string;
    language: string;
    className: string;
    objectNumber: string;
    filename: string;
    score: number;
    object: string;
    hierarchy: string;
    links: LinkSearchResult[];
};

export type LinkSearchResult = {
    href: string;
    rel: string;
};

export type PageSearchResult = {
    xwikiAbsoluteUrl: string;
};
