import { Button, Form, Space } from "antd";
import { UserType } from "app/services/users";
import React, { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import { SearchCriterias } from ".";
import AhoraLabelsField from "../Forms/Fields/AhoraLabelsField";
import AhoraUsersField from "../Forms/Fields/AhoraUsersField";
import SearchDocDocTypeField from "../Forms/Fields/searchDocs/SearchDocDocTypeField";
import SearchDocIsPrivateField from "../Forms/Fields/searchDocs/SearchDocIsPrivateField";
import SearchDocStatusField from "../Forms/Fields/searchDocs/SearchDocStatusField";
import SearchDocUserGroupField from "../Forms/Fields/searchDocs/SearchDocUserGroupField";

interface Props {
    searchCriterias?: SearchCriterias;
    searchSelected(searchCriterias?: SearchCriterias, searchCriteriasText?: string): void
    showSaveButton?: boolean
    onSave?: (searchCriterias: SearchCriterias) => void;
}

export default function SimpleDocsInput(props: Props) {

    const formRef: React.RefObject<any> = React.createRef();

    const onValuesChange = (changedValues: any, allValues: SearchCriterias) => {
        props.searchSelected(allValues);
    }

    useEffect(() => {
        formRef.current.resetFields();
    }, [props.searchCriterias]);
    return <Form onFinish={(searchCriterias: SearchCriterias) => props.onSave && props.onSave(searchCriterias)} ref={formRef} onValuesChange={onValuesChange} layout="inline" initialValues={props.searchCriterias}>
        <Form.Item style={{ minWidth: "170px" }} name="label" label={<FormattedMessage id="searchLabelText" />}>
            <AhoraLabelsField fieldData={{}}></AhoraLabelsField>
        </Form.Item>
        <Form.Item style={{ minWidth: "170px" }} name="reporter" label={<FormattedMessage id="searchReporterText" />}>
            <AhoraUsersField fieldData={{}}></AhoraUsersField>
        </Form.Item>
        <Form.Item style={{ minWidth: "170px" }} name="mention" label={<FormattedMessage id="searchMentionText" />}>
            <AhoraUsersField fieldData={{}}></AhoraUsersField>
        </Form.Item>
        <Form.Item style={{ minWidth: "170px" }} name="assignee" label={<FormattedMessage id="searchAssigneeText" />}>
            <SearchDocUserGroupField userType={UserType.User} fieldData={{} as any}></SearchDocUserGroupField>
        </Form.Item>
        <Form.Item style={{ minWidth: "170px" }} name="status" label={<FormattedMessage id="searchStatusText" />}>
            <SearchDocStatusField fieldData={{} as any}></SearchDocStatusField>
        </Form.Item>
        <Form.Item style={{ minWidth: "170px" }} name="docType" label={<FormattedMessage id="searchDocTypeText" />}>
            <SearchDocDocTypeField fieldData={{} as any}></SearchDocDocTypeField>
        </Form.Item>
        <Form.Item style={{ minWidth: "170px" }} name="private" label={<FormattedMessage id="searchIsPrivateText" />}>
            <SearchDocIsPrivateField></SearchDocIsPrivateField>
        </Form.Item>
        {props.showSaveButton &&
            <Space>
                <Button htmlType="submit" type="primary"><FormattedMessage id="ahoraFormSubmitText" /></Button>
            </Space>
        }
    </Form>
}