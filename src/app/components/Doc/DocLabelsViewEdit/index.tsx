import * as React from 'react';
import ViewEdit from 'app/components/ViewEdit';
import { AhoraFormField } from 'app/components/Forms/AhoraForm/data';
import LabelsList from 'app/components/LabelsSelector/details';
import LabelsSelector from 'app/components/LabelsSelector';

interface State {
    fieldData: AhoraFormField;
    labels: number[];
}
interface Props {
    labels?: number[];
    canEdit: boolean;
    onUpdate: (labels: number[]) => Promise<void>;
}

class DocLabelViewEdit extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    async onUpdate(labels: number[]) {
        this.setState({ labels });
        await this.props.onUpdate(labels);
    }

    render() {
        return (
            <ViewEdit canEdit={this.props.canEdit} onUpdate={this.onUpdate.bind(this)}
                viewComponent={() => { return <LabelsList defaultSelected={this.props.labels}></LabelsList> }}
                editComponent={(props: any) =>
                    <LabelsSelector autoFocus={false} defaultSelected={this.props.labels} onChange={props.onUpdate}></LabelsSelector>
                } />
        );
    }
}

export default DocLabelViewEdit; 