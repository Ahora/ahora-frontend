import * as React from 'react';
import { Organization, OrganizationType } from 'app/services/organizations';
import AhoraForm from '../Forms/AhoraForm/AhoraForm';
import AhoraField from '../Forms/AhoraForm/AhoraField';


interface OrganizationFormProps {
    initData?: any,
    submitButtonText?: string;
    onSumbit: (organization: Organization) => Promise<void>;
}

export default class OrganizationForm extends React.Component<OrganizationFormProps> {

    private prevOrgData?: Organization;

    onUpdate(data: Organization) {
        if (!this.prevOrgData || (this.prevOrgData && this.prevOrgData.displayName !== data.displayName)) {
            data.login = data.displayName.replace(/[^A-Za-z0-9\-]/g, "");
        }
        this.prevOrgData = data;
        return data;
    }


    render() {
        return (
            <AhoraForm submitButtonText={this.props.submitButtonText} onUpdate={this.onUpdate.bind(this)} data={this.props.initData} onSumbit={this.props.onSumbit.bind(this)}>
                <AhoraField fieldName="displayName" fieldType="text" displayName="Organization Name" required={true}></AhoraField>
                <AhoraField fieldName="login" fieldType="organizationurl" displayName="Url" required={true}></AhoraField>
                <AhoraField fieldName="orgType" fieldType="enum" displayName="Type" required={true} settings={{ enum: OrganizationType, keys: ["Public", "Private"] }}></AhoraField>
                <AhoraField fieldName="isRTL" fieldType="boolean" displayName="RTL"></AhoraField>
                <AhoraField fieldName="locale" fieldType="text" displayName="Locale"></AhoraField>
                <AhoraField fieldName="defaultDomain" fieldType="text" displayName="Default Domain"></AhoraField>
            </AhoraForm>
        );
    }
}