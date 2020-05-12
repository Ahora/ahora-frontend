import * as React from 'react';
import SearchDocsInput, { SearchCriterias } from '../SearchDocsInput';
import DocsGraph, { DocsGraphDisplayType } from './DocsGraph';
import Form from 'react-bootstrap/Form';
import { RouteComponentProps } from 'react-router';
import Button from 'react-bootstrap/Button';
import { BasicDashboardGadget } from 'app/services/dashboardGadgets';

interface EditableGraphProps {
}

interface EditableGraphState {
    info: BasicDashboardGadget;
    editMode: boolean;

}

export interface EditableGraphData {
    id?: number;
    searchCriterias?: SearchCriterias;
    primaryGroup?: string;
    secondaryGroup?: string;
    displayType?: DocsGraphDisplayType;
    title: string
}

interface AllProps extends RouteComponentProps<EditableGraphProps> {
    info: BasicDashboardGadget;
    isNew: boolean;

    onUpdate: (info: BasicDashboardGadget) => Promise<void>;
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

        this.state = {
            info: {
                ...this.props.info,
                metadata: {
                    ...this.props.info.metadata,
                    displayType: this.props.info.metadata.displayType || DocsGraphDisplayType.bars
                }
            },
            editMode: this.props.isNew
        };

    }

    async componentDidMount() {

    }

    handleChangePrimaryGroup(event: any) {
        this.setState({
            info: {
                ...this.state.info,
                metadata: {
                    ...this.state.info.metadata,
                    primaryGroup: event.target.value
                }
            }
        });
    }

    handleChangeSecondaryGroup(event: any) {
        this.setState({
            info: {
                ...this.state.info,
                metadata: {
                    ...this.state.info.metadata,
                    secondaryGroup: event.target.value
                }
            }
        });
    }

    handleDisplatTypeChange(event: any) {
        this.setState({
            info: {
                ...this.state.info,
                metadata: {
                    ...this.state.info.metadata,
                    displayType: event.target.value
                }
            }
        });
    }

    searchSelected(searchCriterias?: SearchCriterias, searchCriteriasText?: string): void {
        this.setState({
            info: {
                ...this.state.info,
                metadata: {
                    ...this.state.info.metadata,
                    searchCriterias: searchCriterias
                }
            },
            editMode: true
        });
    }

    async gotEdit() {
        this.setState({
            editMode: true
        })
    }

    handleTitleChange(event: any) {
        let fleldVal = event.target.value;

        this.setState({
            info: {
                ...this.state.info,
                title: fleldVal
            }
        })
    }

    async onSubmit(even: any) {
        event!.preventDefault();
        this.setState({
            editMode: false
        });

        await this.props.onUpdate(this.state.info);
    }

    render() {
        return (
            <div className="border p-2">
                {
                    this.state.editMode ?
                        <Form className={this.state.editMode ? "d-block" : "d-none"} onSubmit={this.onSubmit.bind(this)}>
                            <Form.Group>
                                <Form.Label>Title:</Form.Label>
                                <Form.Control value={this.state.info.title} name="title" onChange={this.handleTitleChange.bind(this)} type="title" />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>query:</Form.Label>
                                <SearchDocsInput searchCriterias={this.state.info.metadata.searchCriterias} searchSelected={this.searchSelected.bind(this)} ></SearchDocsInput>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Primary Group:</Form.Label>
                                <Form.Control name="primaryGroup" value={this.state.info.metadata.primaryGroup} onChange={this.handleChangePrimaryGroup.bind(this)} as="select">
                                    {groupOptions.map((groupOption) => <option value={groupOption.value}>{groupOption.name}</option>)}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Secondary Group:</Form.Label>
                                <Form.Control name="secondaryGroup" value={this.state.info.metadata.secondaryGroup} onChange={this.handleChangeSecondaryGroup.bind(this)} as="select">
                                    {groupOptions.map((groupOption) => <option value={groupOption.value}>{groupOption.name}</option>)}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>display</Form.Label>
                                <Form.Control name="secondaryGroup" value={this.state.info.metadata.displayType || DocsGraphDisplayType.bars} onChange={this.handleDisplatTypeChange.bind(this)} as="select">
                                    <option value="bars">Bars</option>
                                    <option value="pie">Pie</option>
                                </Form.Control>
                            </Form.Group>
                            <Button type="submit">Done</Button>
                        </Form>
                        :
                        <div>
                            <div>{this.state.info.title}</div>
                            <Button onClick={this.gotEdit.bind(this)}>Edit</Button>
                        </div>
                }
                {
                    this.state.info && this.state.info.metadata &&
                    (this.state.info.metadata.primaryGroup || this.state.info.metadata.secondaryGroup) &&
                    this.state.info.metadata.displayType &&
                    <DocsGraph group={[this.state.info.metadata.primaryGroup, this.state.info.metadata.secondaryGroup]} displayType={this.state.info.metadata.displayType || "bars"} history={this.props.history} searchCriterias={this.state.info.metadata.searchCriterias}></DocsGraph>

                }
            </div>
        );
    }
}



export default EditableGraph as any;