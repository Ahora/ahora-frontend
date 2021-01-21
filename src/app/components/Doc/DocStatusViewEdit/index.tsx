import * as React from 'react';
import ViewEdit from 'app/components/ViewEdit';
import { AhoraFormField } from 'app/components/Forms/AhoraForm/data';
import AhoraDocStatusField from 'app/components/Forms/Fields/AhoraDocStatusField';
import DocStatusTag from '../DocStatusTag';

interface State {
    fieldData: AhoraFormField;
}
interface Props {
    statusId: number;
    onUpdate: (value: number) => Promise<void>;
    canEdit?: boolean;
}

class DocStatusViewEdit extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <ViewEdit canEdit={this.props.canEdit} onUpdate={this.props.onUpdate.bind(this)}
                viewComponent={() =>
                    <DocStatusTag statusId={this.props.statusId}></DocStatusTag>}
                editComponent={(props: any) =>
                    <AhoraDocStatusField autoFocus={true} onChange={props.onUpdate} value={this.props.statusId} />
                } />
        );
    }
}

export default DocStatusViewEdit; 