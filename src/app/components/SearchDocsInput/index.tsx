import * as React from 'react';
import { parse, SearchParserOptions, } from "search-query-parser";
import { Input } from 'antd';

var searchOptions: SearchParserOptions = { keywords: ['status', 'docType', 'assignee', 'reporter', 'label', "repo", "milestone", "team", "createdAt", "closedAt"], alwaysArray: true }

export interface SearchCriterias {
    assignee?: string[];
    reporter?: string[];
    label?: string | string[];
    status?: string | string[];
    repo?: string | string[];
    milestone?: string | string[];
    text?: string | string[]
    docType?: string | string[]
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
    isFocused: boolean;
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

    constructor(props: Props) {
        super(props);

        this.state = {
            searchCriteriaText: this.props.searchCriteriaText,
            searchCriterias: this.props.searchCriterias,
            isFocused: false
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

    onTextChange(event: any) {
        this.setState({
            searchCriteriaText: event.target.value
        });
    }

    search() {
        if (this.state.searchCriteriaText) {
            const queryObject: SearchCriterias = parse(this.state.searchCriteriaText, searchOptions) as any;
            this.setState({
                searchCriterias: queryObject,
                searchCriteriaText: this.state.searchCriteriaText
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

            this.props.searchSelected(result, this.state.searchCriteriaText);
        }
        else {
            this.props.searchSelected({});
        }
    }

    handleFocus() {
        this.setState({ isFocused: true });
    }

    handleBlur() {
        this.search();
        this.setState({ isFocused: false });
    }

    handleKeyDown(e: any) {
        if (e.key === 'Enter') {
            this.search();
        }
    }

    async componentDidMount() {
        this.reloadData(this.state.searchCriterias);
    }
    render = () => {
        return (
            <div>
                <Input.Search
                    type="text"
                    required={this.props.required === undefined ? true : this.props.required}
                    onFocus={this.handleFocus.bind(this)}
                    value={this.state.searchCriteriaText}
                    onChange={this.onTextChange.bind(this)}
                    placeholder="enter your search criteria"
                    onKeyDown={this.handleKeyDown.bind(this)}
                    onBlur={this.handleBlur.bind(this)}
                    enterButton="Search"
                />
            </div >
        );
    };
}
