import React from "react";
import { SearchParserOptions } from "search-query-parser";
import { SearchCriterias } from ".";

var searchOptions: SearchParserOptions = { keywords: ['status', 'docType', 'assignee', 'reporter', 'mention', 'label', "repo", "milestone", "team", "createdAt", "closedAt", "unread"], alwaysArray: true }

const printTextOfQuery = (field: string, val: string | string[]): string => {
    if (typeof (val) === "string") {
        //Wrap values with space in "".
        if (val.indexOf(" ") > -1) {
            return `${field}:"${val}"`;
        }
        else {
            return `${field}:${val}`;

        }
    }
    else {
        //Wrap values with space in "".
        return val.map((itemVal) => itemVal.indexOf(" ") > -1 ? `"${itemVal}"` : itemVal).map((itemVal) => `${field}:${itemVal}`).join(" ");

    }
}

export const SearchCriteriasToText = (searchCriterias?: SearchCriterias): string => {
    let text: string = "";
    if (searchCriterias && searchOptions.keywords) {
        const searchCriteriasAsAny: any = searchCriterias;


        searchOptions.keywords.forEach((option) => {
            if (searchCriteriasAsAny[option]) {
                text += " " + printTextOfQuery(option, searchCriteriasAsAny[option]);
            }
        });
    }
    return text;
}

export const SearchCriteriasDisplay = (props: { searchCriterias?: SearchCriterias }) => <>{SearchCriteriasToText(props.searchCriterias)}
</>
