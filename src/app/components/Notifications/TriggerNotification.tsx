import * as React from 'react';
import { NotificationTrigger } from 'app/services/OrganizationNotification';

interface Props {
    value?: number;
}

const possibleValues: string[] = [
    "OnCreate",
    "OnEdit",
    "onStatusChanged",
    "OnUpdate",
    "OnComment",
    "OnClose"
];

class TriggerNotification extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        let items: string[] = [];
        if (this.props.value) {
            items = possibleValues.filter((value: string) => {
                const enumObj = NotificationTrigger as any;
                return (((this.props.value || 0) & enumObj[value]) === enumObj[value]);
            });
        }

        return (
            <>{items.join(", ")}</>)
    }
}

export default TriggerNotification;