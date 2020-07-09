import * as React from 'react';
import DocsDateTimeGraphData from './data';
import SearchDocsInput, { SearchCriterias } from 'app/components/SearchDocsInput';
import Form from 'react-bootstrap/Form';
import GroupBySelect from 'app/components/Forms/Basics/GroupBySelect';

interface DocsDateTimeGraphState {
    form: DocsDateTimeGraphData;
}

interface DocsDateTimeGraphProps {
    data: DocsDateTimeGraphData;
    onUpdate: (metadata: DocsDateTimeGraphData) => void;
}

class DocsDateTimeGraphForm extends React.Component<DocsDateTimeGraphProps, DocsDateTimeGraphState> {
    constructor(props: DocsDateTimeGraphProps) {
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

    handleChange(event: any) {
        const form = {
            ...this.state.form,
            isCompulative: !this.state.form.isCompulative
        };
        this.setState({ form });
        this.update(form);
    }

    handleChangePrimaryGroup(value: string) {
        const form = {
            ...this.state.form,
            primaryGroup: value
        };
        this.setState({ form });
        this.update(form);
    }

    update(form: DocsDateTimeGraphData) {
        this.props.onUpdate(form);
    }

    render() {
        return (
            <>
                <Form.Group>
                    <Form.Label>query:</Form.Label>
                    <SearchDocsInput required={false} searchCriterias={this.state.form.searchCriterias} searchSelected={this.searchSelected.bind(this)} ></SearchDocsInput>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Primary Group:</Form.Label>
                    <GroupBySelect onUpdate={this.handleChangePrimaryGroup.bind(this)} value={this.state.form.primaryGroup}></GroupBySelect>
                </Form.Group>
                <Form.Group>
                    <Form.Check type="checkbox" checked={this.state.form.isCompulative} onChange={this.handleChange.bind(this)} label="Is Compulative?" />
                </Form.Group>
            </>
        );
    }
}

export default DocsDateTimeGraphForm;