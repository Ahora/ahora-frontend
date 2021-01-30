import { Button, Form, Space } from "antd";
import React, { useEffect } from "react";
import { SearchCriterias } from ".";
import AhoraLabelsField from "../Forms/Fields/AhoraLabelsField";
import AhoraUsersField from "../Forms/Fields/AhoraUsersField";
import SearchDocDocTypeField from "../Forms/Fields/searchDocs/SearchDocDocTypeField";
import SearchDocStatusField from "../Forms/Fields/searchDocs/SearchDocStatusField";
import SearchDocUserGroupField from "../Forms/Fields/searchDocs/SearchDocUserGroupField";

interface Props {
    searchCriterias?: SearchCriterias;
    searchSelected(searchCriterias?: SearchCriterias, searchCriteriasText?: string): void
    showSaveButton?: boolean
}

export default function SimpleDocsInput(props: Props) {

    const formRef: React.RefObject<any> = React.createRef();

    const onValuesChange = (changedValues: any, allValues: SearchCriterias) => {
        props.searchSelected(allValues);
    }


    useEffect(() => {
        //formRef.current.initialValue = props.searchCriterias;
        formRef.current.resetFields();
    }, [props.searchCriterias]);
    return <Form ref={formRef} onValuesChange={onValuesChange} layout="inline" initialValues={props.searchCriterias}>
        <Form.Item style={{ minWidth: "150px" }} name="label" label="תוויות">
            <AhoraLabelsField fieldData={{}}></AhoraLabelsField>
        </Form.Item>
        <Form.Item style={{ minWidth: "150px" }} name="reporter" label="מדוח">
            <AhoraUsersField fieldData={{}}></AhoraUsersField>
        </Form.Item>
        <Form.Item style={{ minWidth: "150px" }} name="mention" label="מוזכר">
            <AhoraUsersField fieldData={{}}></AhoraUsersField>
        </Form.Item>
        <Form.Item style={{ minWidth: "150px" }} name="assignee" label="מוזכר">
            <SearchDocUserGroupField fieldData={{} as any}></SearchDocUserGroupField>
        </Form.Item>
        <Form.Item style={{ minWidth: "150px" }} name="status" label="סטאטוס">
            <SearchDocStatusField fieldData={{} as any}></SearchDocStatusField>
        </Form.Item>
        <Form.Item style={{ minWidth: "150px" }} name="docType" label="סוג">
            <SearchDocDocTypeField fieldData={{} as any}></SearchDocDocTypeField>
        </Form.Item>
        {props.showSaveButton &&
            <Space>
                <Button htmlType="submit" type="primary">save</Button>
            </Space>
        }
    </Form>
}