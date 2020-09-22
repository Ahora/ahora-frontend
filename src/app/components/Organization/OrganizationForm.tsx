import * as React from 'react';
import { Organization, OrganizationType } from 'app/services/organizations';
import AhoraForm from '../Forms/AhoraForm/AhoraForm';
import AhoraField from '../Forms/AhoraForm/AhoraField';

interface OrganizationFormProps {
    initData?: any,
    onUpdate: (organization: Organization) => Promise<void>;

}

export default class OrganizationForm extends React.Component<OrganizationFormProps> {
    render() {
        return (
            <AhoraForm data={this.props.initData} onSumbit={this.props.onUpdate.bind(this)}>
                <AhoraField fieldName="displayName" fieldType="text" displayName="Organization Name" required={true}></AhoraField>
                <AhoraField fieldName="login" fieldType="organizationurl" displayName="Url" required={true}></AhoraField>
                <AhoraField fieldName="orgType" fieldType="enum" displayName="Type" required={true} settings={{ enum: OrganizationType, keys: ["Public", "Private"] }}></AhoraField>
            </AhoraForm>
        );
    }
}