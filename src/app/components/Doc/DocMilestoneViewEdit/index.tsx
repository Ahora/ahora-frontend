import * as React from 'react';
import ViewEdit from 'app/components/ViewEdit';
import { AhoraFormField } from 'app/components/Forms/AhoraForm/data';
import Form from 'react-bootstrap/Form';
import { OrganizationMilestone } from 'app/services/OrganizationMilestones';
import AhoraDocMilestoneField from 'app/components/Forms/Fields/AhoraDocMilestoneField';

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
                viewComponent={() => { return <>Milestone: {milestone ? milestone.title : "Empty"}</> }}
                editComponent={(props: any) =>
                    <Form inline>
                        <AhoraDocMilestoneField autoFocus={true} onUpdate={props.onUpdate} value={this.props.milestone ? this.props.milestone.id : undefined} />
                    </Form>
                } />
        );
    }
}

export default DocMilestoneViewEdit; 