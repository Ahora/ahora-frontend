import * as React from 'react';
import AhoraEnumField from '../Forms/Fields/AhoraBitwiseEnumField';
import { AhoraFormField } from '../Forms/AhoraForm/data';
import { NotificationTrigger } from 'app/services/OrganizationNotification';
import Button from 'react-bootstrap/Button';

interface GroupBySelectState {
    fieldData: AhoraFormField;
    value?: number;
}

interface GroupBySelectStateProps {
    value?: number;
    onUpdate: (value?: number) => void;
}


class AhoraTriggerNotificationField extends React.Component<GroupBySelectStateProps, GroupBySelectState> {
    constructor(props: GroupBySelectStateProps) {
        super(props);

        this.state = {
            value: this.props.value,
            fieldData: {
                displayName: "Trigger",
                fieldName: "notificationTrigger",
                fieldType: "enumbitwise",
                settings: {
                    enum: NotificationTrigger, keys:
                        [
                            "OnCreate",
                            "OnEdit",
                            "onStatusChanged",
                            "OnUpdate",
                            "OnComment",
                            "OnClose"
                        ]
                }
            }
        };
    }

    onUpdate(value: number) {
        this.setState({ value });
    }

    save() {
        this.props.onUpdate(this.state.value);
    }

    render() {
        return (
            <><AhoraEnumField value={this.props.value} onUpdate={this.onUpdate.bind(this)} fieldData={this.state.fieldData}></AhoraEnumField>
                <Button onClick={this.save.bind(this)}>Save</Button></>)
    }
}

export default AhoraTriggerNotificationField;