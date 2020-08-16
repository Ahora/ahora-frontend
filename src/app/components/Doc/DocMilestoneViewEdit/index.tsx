import * as React from 'react';
import ViewEdit from 'app/components/ViewEdit';
import { AhoraFormField } from 'app/components/Forms/AhoraForm/data';
import { OrganizationMilestone } from 'app/services/OrganizationMilestones';
import AhoraDocMilestoneField from 'app/components/Forms/Fields/AhoraDocMilestoneField';
import { Tag } from 'antd';

interface State {
    fieldData: AhoraFormField;
}
interface Props {
    milestone?: OrganizationMilestone;
    canEdit?: boolean;
    onUpdate: (value: number) => Promise<void>;
}

class DocMilestoneViewEdit extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        const milestone = this.props.milestone;
        return (
            <ViewEdit canEdit={this.props.canEdit} onUpdate={this.props.onUpdate.bind(this)}
                viewComponent={() => { return <Tag>{milestone ? milestone.title : "No milestone"}</Tag> }}
                editComponent={(props: any) =>
                    <AhoraDocMilestoneField autoFocus={true} onChange={props.onUpdate} value={this.props.milestone ? this.props.milestone.id : undefined} />
                } />
        );
    }
}

export default DocMilestoneViewEdit; 