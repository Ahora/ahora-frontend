import * as React from 'react';
import ViewEdit from 'app/components/ViewEdit';
import AhoraDocMilestoneField from 'app/components/Forms/Fields/AhoraDocMilestoneField';
import MilestoneTag from 'app/components/Basics/MilestoneTag';

interface Props {
    milestoneId?: number;
    canEdit?: boolean;
    onUpdate: (value: number) => Promise<void>;
}

class DocMilestoneViewEdit extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <ViewEdit canEdit={this.props.canEdit} onUpdate={this.props.onUpdate.bind(this)}
                viewComponent={() => { return <MilestoneTag milestoneId={this.props.milestoneId}></MilestoneTag> }}
                editComponent={(props: any) =>
                    <AhoraDocMilestoneField autoFocus={true} onChange={props.onUpdate} value={this.props.milestoneId} />
                } />
        );
    }
}

export default DocMilestoneViewEdit; 