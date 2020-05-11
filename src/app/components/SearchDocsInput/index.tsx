import * as React from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { parse, SearchParserOptions, } from "search-query-parser";

var options: SearchParserOptions = { keywords: ['assignee', 'label', 'status', 'docType', "repo"], alwaysArray: true }

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
        if (searchCriterias) {

            if (searchCriterias.status) {
                text += " " + this.printTextOfQuery("status", searchCriterias.status);
            }

            if (searchCriterias.label) {
                text += " " + this.printTextOfQuery("label", searchCriterias.label);
            }

            if (searchCriterias.repo) {
                text += " " + this.printTextOfQuery("repo", searchCriterias.repo);
            }

            if (searchCriterias.docType) {
                text += " " + this.printTextOfQuery("docType", searchCriterias.docType);
            }

            if (searchCriterias.assignee) {
                text += " " + this.printTextOfQuery("assignee", searchCriterias.assignee);
            }

            if (searchCriterias.reporter) {
                text += " " + this.printTextOfQuery("reporter", searchCriterias.reporter);
            }
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

    search(event: any) {
        if (event) {
            event!.preventDefault();
        }

        if (this.state.searchCriteriaText) {
            const queryObject: SearchCriterias = parse(this.state.searchCriteriaText, options) as any;
            this.setState({
                searchCriterias: queryObject,
                searchCriteriaText: this.state.searchCriteriaText
            });
            this.props.searchSelected({
                assignee: queryObject.assignee,
                docType: queryObject.docType,
                repo: queryObject.repo,
                label: queryObject.label,
                text: queryObject.text,
                status: queryObject.status
            }, this.state.searchCriteriaText);
        }
        else {
            this.props.searchSelected();
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
