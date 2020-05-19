import * as React from 'react';
import DocsDateTimeGraphData from './data';
import SearchDocsInput, { SearchCriterias } from 'app/components/SearchDocsInput';
import Form from 'react-bootstrap/Form';

interface DocsDateTimeGraphState {
    form: DocsDateTimeGraphData;
}

interface DocsDateTimeGraphProps {
    data: DocsDateTimeGraphData;
    onUpdate: (metadata: DocsDateTimeGraphData) => void;
}

const groupOptions: { name: string, value: string }[] = [
    {
        name: "",
        value: ""
    }, {
        name: "Status",
        value: "status"
    },
    {
        name: "Type",
        value: "docType"
    }, {
        name: "Repository",
        value: "repo"
    },
    {
        name: "label",
        value: "label"
    },
    {
        name: "reporter",
        value: "reporter"
    },
    {
        name: "assignee",
        value: "assignee"
    },
    {
        name: "createdAt",
        value: "createdAt"
    },
    {
        name: "updatedAt",
        value: "updatedAt"
    }];


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

    handleChangePrimaryGroup(event: any) {
        const form = {
            ...this.state.form,
            primaryGroup: event.target.value
        };
        this.setState({ form });
        this.update(form);
    }

    handleChangeSecondaryGroup(event: any) {
        const form = {
            ...this.state.form,
            secondaryGroup: event.target.value
        };
        this.setState({ form });
        this.update(form);
    }

    handleDisplatTypeChange(event: any) {
        const form = {
            ...this.state.form,
            displayType: event.target.value
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
                    <SearchDocsInput searchCriterias={this.state.form.searchCriterias} searchSelected={this.searchSelected.bind(this)} ></SearchDocsInput>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Primary Group:</Form.Label>
                    <Form.Control name="primaryGroup" value={this.state.form.primaryGroup} onChange={this.handleChangePrimaryGroup.bind(this)} as="select">
                        {groupOptions.map((groupOption) => <option key={groupOption.value} value={groupOption.value}>{groupOption.name}</option>)}
                    </Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Secondary Group:</Form.Label>
                    <Form.Control name="secondaryGroup" value={this.state.form.secondaryGroup} onChange={this.handleChangeSecondaryGroup.bind(this)} as="select">
                        {groupOptions.map((groupOption) => <option key={groupOption.value} value={groupOption.value}>{groupOption.name}</option>)}
                    </Form.Control>
                </Form.Group>
            </>
        );
    }
}

export default DocsDateTimeGraphForm;