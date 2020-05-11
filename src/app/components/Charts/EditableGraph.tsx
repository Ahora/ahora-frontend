import * as React from 'react';
import SearchDocsInput, { SearchCriterias } from '../SearchDocsInput';
import DocsGraph, { DocsGraphDisplayType } from './DocsGraph';
import Form from 'react-bootstrap/Form';
import { RouteComponentProps } from 'react-router';
import Button from 'react-bootstrap/Button';

interface EditableGraphProps {
}

interface EditableGraphState {
    info: EditableGraphData;
    editMode: boolean;

}

interface EditableGraphData {
    searchCriterias?: SearchCriterias;
    primaryGroup?: string;
    secondaryGroup?: string;
    displayType?: DocsGraphDisplayType
}

interface AllProps extends RouteComponentProps<EditableGraphProps> {
    info: EditableGraphData;

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

class EditableGraph extends React.Component<AllProps, EditableGraphState> {
    constructor(props: AllProps) {
        super(props);

        this.state = { info: this.props.info, editMode: false };

    }

    async componentDidMount() {

    }

    handleChangePrimaryGroup(event: any) {
        this.setState({
            info: {
                ...this.state.info,
                primaryGroup: event.target.value
            }
        });
    }

    handleChangeSecondaryGroup(event: any) {
        this.setState({
            info: {
                ...this.state.info,
                secondaryGroup: event.target.value
            }
        });
    }

    handleDisplatTypeChange(event: any) {
        this.setState({
            info: {
                ...this.state.info,
                displayType: event.target.value
            }
        });
    }

    searchSelected(searchCriterias?: SearchCriterias, searchCriteriasText?: string): void {
        this.setState({
            info: {
                ...this.state.info,
                searchCriterias: searchCriterias
            },
            editMode: true
        });
    }

    async gotEdit() {
        this.setState({
            editMode: true
        })
    }

    async onSubmit(even: any) {
        event!.preventDefault();
        this.setState({
            editMode: false
        })
    }

    render() {
        return (
            <div className="border p-2">
                {
                    this.state.editMode ?
                        <Form className={this.state.editMode ? "d-block" : "d-none"} onSubmit={this.onSubmit.bind(this)}>
                            <Form.Group>
                                <Form.Label>query:</Form.Label>
                                <SearchDocsInput searchCriterias={this.state.info.searchCriterias} searchSelected={this.searchSelected.bind(this)} ></SearchDocsInput>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Primary Group:</Form.Label>
                                <Form.Control name="primaryGroup" value={this.state.info.primaryGroup} onChange={this.handleChangePrimaryGroup.bind(this)} as="select">
                                    {groupOptions.map((groupOption) => <option value={groupOption.value}>{groupOption.name}</option>)}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Secondary Group:</Form.Label>
                                <Form.Control name="secondaryGroup" value={this.state.info.secondaryGroup} onChange={this.handleChangeSecondaryGroup.bind(this)} as="select">
                                    {groupOptions.map((groupOption) => <option value={groupOption.value}>{groupOption.name}</option>)}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>display</Form.Label>
                                <Form.Control name="secondaryGroup" value={this.state.info.displayType || DocsGraphDisplayType.bars} onChange={this.handleDisplatTypeChange.bind(this)} as="select">
                                    <option value="bars">Bars</option>
                                    <option value="pie">Pie</option>
                                </Form.Control>
                            </Form.Group>
                            <Button type="submit">Done</Button>
                        </Form>
                        :
                        <Button onClick={this.gotEdit.bind(this)}>Edit</Button>
                }
                <DocsGraph group={[this.state.info.primaryGroup, this.state.info.secondaryGroup]} displayType={this.state.info.displayType} history={this.props.history} searchCriterias={this.state.info.searchCriterias}></DocsGraph>
            </div>
        );
    }
}



export default EditableGraph as any;