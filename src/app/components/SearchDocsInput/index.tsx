import * as React from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { parse, SearchParserOptions, } from "search-query-parser";

var options: SearchParserOptions = { keywords: ['assignee', 'label', 'status', 'docType'], alwaysArray: true }

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
    searchCriteria?: string;
    searchSelected(searchCriterias?: SearchCriterias, searchCriteriasText?: string): void
}

interface State {
    searchCriteriaText?: string;
}

export default class SearchDocsInput extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            searchCriteriaText: this.props.searchCriteria
        }
    }

    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.searchCriteria !== this.props.searchCriteria) {
            this.setState({
                searchCriteriaText: nextProps.searchCriteria
            });
        }
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
    }
    render = () => {
        return (
            <div>
                <form onSubmit={this.search.bind(this)}>
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
                                <Button type="submit" color="primary" variant="primary">Search</Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form.Group>
                </form>
            </div>
        );
    };
}
