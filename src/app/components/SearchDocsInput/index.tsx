import * as React from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { parse, SearchParserOptions, } from "search-query-parser";

var searchOptions: SearchParserOptions = { keywords: ['assignee', 'reporter', 'label', 'status', 'docType', "repo"], alwaysArray: true }

export interface SearchCriterias {
    assignee?: string[];
    reporter?: string[];
    label?: string | string[];
    status?: string | string[];
    repo?: string | string[];
    text?: string | string[]
    docType?: string | string[]
}


interface Props {
    searchCriteriaText?: string;
    searchCriterias?: SearchCriterias;
    searchSelected(searchCriterias?: SearchCriterias, searchCriteriasText?: string): void
}

interface State {
    searchCriteriaText?: string;
    searchCriterias?: SearchCriterias;
}

export default class SearchDocsInput extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
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


    printTextOfQuery(field: string, val: string | string[]): string {
        if (typeof (val) === "string") {
            return `${field}:${val}`;
        }
        else {
            return val.map((itemVal) => `${field}:${itemVal}`).join(" ");

        }
    }

    reloadData(searchCriterias?: SearchCriterias) {
        let text: string = "";
        if (searchCriterias && searchOptions.keywords) {
            const searchCriteriasAsAny: any = searchCriterias;


            searchOptions.keywords.forEach((option) => {
                if (searchCriteriasAsAny[option]) {
                    text += " " + this.printTextOfQuery(option, searchCriteriasAsAny[option]);
                }
            });
        }

        this.setState({
            searchCriteriaText: text
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
            this.props.searchSelected();
        }
    }

    handleBlur() {
        this.search();
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
                <Form.Group>
                    <InputGroup>
                        <Form.Control
                            type="text"
                            value={this.state.searchCriteriaText}
                            onChange={this.onTextChange.bind(this)}
                            placeholder="enter your search criteria"
                            aria-describedby="inputGroupPrepend"
                            onKeyDown={this.handleKeyDown.bind(this)}
                            onBlur={this.handleBlur.bind(this)}
                        />
                        <InputGroup.Append>
                            <Button type="button" onClick={this.search.bind(this)} color="primary" variant="primary">Search</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Form.Group>
            </div>
        );
    };
}
