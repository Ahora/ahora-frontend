import * as React from 'react';
import { parse, SearchParserOptions, } from "search-query-parser";
import { Mentions } from 'antd';
import { searchUsers } from 'app/services/users';
import { store } from "app/store";
import { searchTeams } from 'app/services/organizationTeams';
const autoCompleteOptions: Map<string, (text: string) => Promise<string[]>> = new Map();

const usersSearch = async (text: string): Promise<string[]> => {
    if (text && text.length > 1) {
        const users = await searchUsers(text);
        return users.map((user) => user.username);
    }
    return [];
}

autoCompleteOptions.set("team:", async (text: string): Promise<string[]> => {
    const teams = await searchTeams(text);
    return teams.map((team) => team.name);
});


autoCompleteOptions.set("assignee:", usersSearch);
autoCompleteOptions.set("reporter:", usersSearch);
autoCompleteOptions.set("mention:", usersSearch);
autoCompleteOptions.set("status:", async (text: string): Promise<string[]> => {
    return store.getState().statuses.statuses.map((status) => status.name);
});

autoCompleteOptions.set("private:", async (text: string): Promise<string[]> => {
    return ["true", "false"]
});

autoCompleteOptions.set("label:", async (text: string): Promise<string[]> => {
    return store.getState().labels.labels.map((label) => label.name);
});

autoCompleteOptions.set("docType:", async (text: string): Promise<string[]> => {
    return store.getState().docTypes.docTypes.map((docTypes) => docTypes.name);
});

autoCompleteOptions.set("milestone:", async (text: string): Promise<string[]> => {
    return store.getState().milestones.milestones.map((milestone) => milestone.title);
});



var searchOptions: SearchParserOptions = { keywords: ['status', 'docType', 'private', 'assignee', 'reporter', 'mention', 'label', "repo", "milestone", "team", "createdAt", "closedAt", "unread"], alwaysArray: true }
const autoComleteTokens: string[] = searchOptions.keywords!.map((token) => `${token}:`);

export interface SearchCriterias {
    assignee?: (number | null)[];
    reporter?: (number | null)[];
    label?: number[];
    status?: string[];
    milestone?: string | string[];
    docType?: string[]
    mention?: string[] | number[]
    private?: boolean;
}

interface Props {
    required?: boolean;
    searchCriteriaText?: string;
    searchCriterias?: SearchCriterias;
    searchSelected(searchCriterias?: SearchCriterias, searchCriteriasText?: string): void
}

interface State {
    searchCriteriaText?: string;
    searchCriterias?: SearchCriterias;
    possibleOptions: string[];
    isLoading: boolean;
}

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

export default class SearchDocsInput extends React.Component<Props, State> {

    private previousText?: string;

    constructor(props: Props) {
        super(props);

        this.state = {
            isLoading: false,
            possibleOptions: [],
            searchCriteriaText: this.props.searchCriteriaText,
            searchCriterias: this.props.searchCriterias
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.searchCriterias !== this.props.searchCriterias) {
            this.setState({
                searchCriterias: this.props.searchCriterias
            });

            this.reloadData(this.props.searchCriterias);
        }
    }

    reloadData(searchCriterias?: SearchCriterias) {
        this.setState({
            searchCriteriaText: SearchCriteriasToText(searchCriterias)
        });
    }

    onTextChange(text: string) {
        this.setState({
            searchCriteriaText: text
        });
    }

    search() {
        if (this.state.searchCriteriaText) {
            const queryObject: SearchCriterias = parse(this.state.searchCriteriaText, searchOptions) as any;
            this.setState({
                searchCriterias: queryObject
            });

            const result: any = {};
            if (searchOptions.keywords) {
                const searchCriteriasAsAny: any = queryObject;

                searchOptions.keywords.forEach((option) => {
                    if (searchCriteriasAsAny[option]) {
                        result[option] = searchCriteriasAsAny[option];
                    }
                });
            }

            //Sometimes on blur we don't want to reload the doc list again, if the search critetira wasn't changed.
            if (this.previousText !== this.state.searchCriteriaText) {
                this.props.searchSelected(result, this.state.searchCriteriaText);
            }
            this.previousText = this.state.searchCriteriaText;
        }
        else {
            this.props.searchSelected({});
        }
    }

    handleBlur() {
        this.search();
    }

    async searchAutoComplete(text: string, prefix: string) {
        const autoCompleteHandler = autoCompleteOptions.get(prefix);
        if (autoCompleteHandler) {
            this.setState({ isLoading: true });
            this.setState({ isLoading: false, possibleOptions: await autoCompleteHandler(text) });
        }
        else {
            this.setState({ possibleOptions: [], isLoading: false });
        }
    }

    onPressEnter(e: any) {
        e.preventDefault()
        e.stopPropagation();
        this.search();
    }

    async componentDidMount() {
        this.reloadData(this.state.searchCriterias);
    }
    render = () => {
        return (
            <div>
                <Mentions
                    style={{ width: '100%' }}
                    required={this.props.required === undefined ? true : this.props.required}
                    value={this.state.searchCriteriaText}
                    placeholder="enter your search criteria"
                    prefix={autoComleteTokens}
                    loading={this.state.isLoading}
                    onChange={this.onTextChange.bind(this)}
                    onPressEnter={this.onPressEnter.bind(this)}
                    onBlur={this.handleBlur.bind(this)}
                    onSearch={this.searchAutoComplete.bind(this)}
                >
                    {this.state.possibleOptions.map(value => (
                        <Mentions.Option key={value} value={value.indexOf(" ") > -1 ? `"${value}"` : value}>
                            {value}
                        </Mentions.Option>
                    ))}
                </Mentions>
            </div >
        );
    };
}