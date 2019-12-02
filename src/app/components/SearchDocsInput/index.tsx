import * as React from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { parse, SearchParserOptions } from "search-query-parser";

var options: SearchParserOptions = { keywords: ['assignee', 'label', 'status'], alwaysArray: true }

export interface SearchCriterias {
    assignee: string[] | undefined;
    label: string[] | undefined;
    status: string[] | undefined;
    text: string | string[]
}


interface Props {
    searchCriteria?: string;
    searchSelected(searchCriterias?: SearchCriterias): void
}

interface State {
    searchCriteria?: string;
}

export default class SearchDocsInput extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    onTextChange(event: any) {
        this.setState({
            searchCriteria: event.target.value
        });
    }

    search() {
        if (this.state.searchCriteria) {
            const queryObject: SearchCriterias = parse(this.state.searchCriteria, options) as any;
            this.props.searchSelected(queryObject);
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
                <Form.Group controlId="validationCustomUsername">
                    <InputGroup>
                        <Form.Control
                            type="text"
                            value={this.props.searchCriteria}
                            onChange={this.onTextChange.bind(this)}
                            placeholder="enter your search criteria"
                            aria-describedby="inputGroupPrepend"
                            required
                        />
                        <InputGroup.Append>
                            <Button color="primary" variant="primary" onClick={this.search.bind(this)}>Search</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </Form.Group>
            </div>
        );
    };
}
