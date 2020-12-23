import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { BasicDashboardGadget } from 'app/services/dashboardGadgets';
import GadgetFactory from './GadgetFactory';
import AhoraSDK from 'app/sdk';
import { DashboardGadgetConfiguration } from 'app/sdk/DashboardGadgets';
import { Card, Button, Menu, Dropdown } from 'antd';
import { AhoraFormField } from '../Forms/AhoraForm/data';
import AhoraForm from '../Forms/AhoraForm/AhoraForm';

interface EditableGraphState {
    info: BasicDashboardGadget;
    initInfo: BasicDashboardGadget;
    editMode: boolean;
    fields: AhoraFormField[];

}

interface AllProps extends RouteComponentProps {
    info: BasicDashboardGadget;
    editMode: boolean;
    canEdit: boolean;
    onUpdate: (info: BasicDashboardGadget) => Promise<void>;
    onDelete: (info: BasicDashboardGadget) => Promise<void>;
}

class DashboardGadget extends React.Component<AllProps, EditableGraphState> {

    private gadgetInstance: DashboardGadgetConfiguration | undefined;

    constructor(props: AllProps) {
        super(props);


        this.gadgetInstance = AhoraSDK.getInstance().dashboardGadgets.getGadget(props.info.gadgetType);

        let fields: AhoraFormField[] = [{
            fieldName: "title",
            fieldType: "text",
            displayName: "Title"
        }];

        if (this.gadgetInstance) {
            fields = [...fields, ...this.gadgetInstance.formComponent.fields || []]
        }

        this.state = {
            fields: fields,
            info: this.props.info,
            initInfo: { ...this.props.info },
            editMode: this.props.editMode
        };
    }

    async remove() {
        this.props.onDelete(this.props.info);
    }

    async edit() {
        this.setState({
            editMode: true
        })
    }

    async onSubmit(metadata: any): Promise<void> {
        const info = {
            ...this.state.info,
            metadata
        };
        this.setState({
            editMode: false,
            info
        });
        await this.props.onUpdate(info);
    }

    onGadgetFormUpdate(metadata: any) {
        this.setState({
            info: {
                ...this.state.info,
                metadata
            }
        });
    }

    render() {
        return (
            <Card
                title={this.state.info.metadata.title}
                extra={<>
                    {this.props.canEdit &&
                        <Dropdown overlay={
                            <Menu>
                                <Menu.Item><Button type="text" block onClick={this.edit.bind(this)}>Edit</Button></Menu.Item>
                                <Menu.Item><Button type="text" block onClick={this.remove.bind(this)}>Remove</Button></Menu.Item>
                            </Menu>
                        }><Button>settings</Button></Dropdown>
                    }
                </>}>
                <>
                    {this.state.editMode &&
                        <>
                            <div style={{ display: this.state.editMode ? "block" : "none" }}>
                                <AhoraForm data={this.state.initInfo.metadata} onUpdate={this.onGadgetFormUpdate.bind(this)} onSumbit={this.onSubmit.bind(this)} fields={this.state.fields}></AhoraForm>
                            </div>
                        </>
                    }
                    {
                        this.state.info && <GadgetFactory info={this.state.info} history={this.props.history} match={this.props.match} location={this.props.location}></GadgetFactory>
                    }
                </>
            </Card >
        )
    }

}

export default DashboardGadget;