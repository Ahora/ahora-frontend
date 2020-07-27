import * as React from 'react';
import ViewEdit from 'app/components/ViewEdit';
import { AhoraFormField } from 'app/components/Forms/AhoraForm/data';
import { Status } from 'app/services/statuses';
import AhoraDocStatusField from 'app/components/Forms/Fields/AhoraDocStatusField';
import { Tag } from 'antd';

interface State {
    fieldData: AhoraFormField;
}
interface Props {
    status?: Status;
    onUpdate: (value: number) => Promise<void>;
    canEdit?: boolean;
}

class DocStatusViewEdit extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        const status = this.props.status;
        return (
            <ViewEdit canEdit={this.props.canEdit} onUpdate={this.props.onUpdate.bind(this)}
                viewComponent={() => <Tag color="processing">{status ? status.name : "Empty"}</Tag>}
                editComponent={(props: any) =>
                    <AhoraDocStatusField autoFocus={true} onUpdate={props.onUpdate} value={this.props.status ? this.props.status.id : undefined} />
                } />
        );
    }
}

export default DocStatusViewEdit; 