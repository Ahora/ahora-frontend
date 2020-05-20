import * as React from 'react';
import DocListData from './data';
import SearchDocsInput, { SearchCriterias } from 'app/components/SearchDocsInput';
import Form from 'react-bootstrap/Form';

interface DocListGadgetState {
    form: DocListData;
}

interface DocListGadgetProps {
    data: DocListData;
    onUpdate: (metadata: DocListData) => void;
}

class DocListGadgetForm extends React.Component<DocListGadgetProps, DocListGadgetState> {
    constructor(props: DocListGadgetProps) {
        super(props);

        this.state = {
            form: this.props.data
        };
    }

    searchSelected(searchCriterias?: SearchCriterias): void {
        const form = {
            ...this.state.form,
            searchCriterias: searchCriterias
        };
        this.setState({ form });
        this.update(form);
    }

    update(form: DocListData) {
        this.props.onUpdate(form);
    }

    render() {
        return (
            <>
                <Form.Group>
                    <Form.Label>query:</Form.Label>
                    <SearchDocsInput searchCriterias={this.state.form.searchCriterias} searchSelected={this.searchSelected.bind(this)} ></SearchDocsInput>
                </Form.Group>
            </>
        );
    }
}

export default DocListGadgetForm;