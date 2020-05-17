import * as React from 'react';
import Card from 'react-bootstrap/Card';
import { RouteComponentProps } from 'react-router';
import { BasicDashboardGadget } from 'app/services/dashboardGadgets';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import GadgetFactory from './GadgetFactory';
import AhoraSDK from 'app/sdk';
import { DashboardGadgetConfiguration } from 'app/sdk/DashboardGadgets';

interface EditableGraphState {
    info: BasicDashboardGadget;
    editMode: boolean;

}

interface AllProps extends RouteComponentProps {
    info: BasicDashboardGadget;
    editMode: boolean;
    onUpdate: (info: BasicDashboardGadget) => Promise<void>;
    onDelete: (info: BasicDashboardGadget) => Promise<void>;
}

class DashboardGadget extends React.Component<AllProps, EditableGraphState> {

    private gadgetInstance: DashboardGadgetConfiguration | undefined;

    constructor(props: AllProps) {
        super(props);

        this.state = {
            info: {
                ...this.props.info
            },
            editMode: this.props.editMode
        };

        this.gadgetInstance = AhoraSDK.getInstance().dashboardGadgets.getGadget(props.info.gadgetType);


    }

    async remove() {
        this.props.onDelete(this.props.info);
    }

    async edit() {
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

    async onSubmit() {
        event!.preventDefault();
        this.setState({
            editMode: false
        });

        await this.props.onUpdate(this.state.info);
    }

    onGadgetFormUpdate(metadata: any) {
        this.setState({
            info: {
                ...this.state.info,
                metadata
            }
        });
    }


    async componentDidMount() {

    }

    render() {

        return (
            <Card>
                <Card.Body>
                    <Card.Title>
                        {this.props.info.title}
                        <DropdownButton id={`gadget-settings-${this.props.info.id}`} className="float-right" size="sm" title="Settings">
                            <Dropdown.Item onClick={this.edit.bind(this)}>Edit</Dropdown.Item>
                            <Dropdown.Item onClick={this.remove.bind(this)}>Remove</Dropdown.Item>
                        </DropdownButton>
                    </Card.Title>
                    {
                        this.state.editMode &&
                        <>
                            <Form className={this.state.editMode ? "d-block" : "d-none"} onSubmit={this.onSubmit.bind(this)}>
                                <Form.Group>
                                    <Form.Label>Title:</Form.Label>
                                    <Form.Control value={this.state.info.title} name="title" onChange={this.handleTitleChange.bind(this)} type="title" />
                                </Form.Group>
                                {
                                    this.gadgetInstance && React.createElement(this.gadgetInstance.formComponent, {
                                        key: this.props.info.id,
                                        onUpdate: this.onGadgetFormUpdate.bind(this),
                                        data: this.props.info.metadata,
                                        history: this.props.history,
                                        match: this.props.match,
                                        location: this.props.location,
                                    })}

                                <Button type="submit"> Done</Button>
                            </Form>
                        </>
                    }
                    {
                        this.state.info &&
                        <>
                            <GadgetFactory info={this.state.info} history={this.props.history} match={this.props.match} location={this.props.location}></GadgetFactory>
                        </>
                    }
                </Card.Body>
            </Card >
        )
    }

}

export default DashboardGadget;