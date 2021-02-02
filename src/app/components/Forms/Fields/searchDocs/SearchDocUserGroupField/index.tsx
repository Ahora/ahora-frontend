import { AhoraFormField } from "app/components/Forms/AhoraForm/data";
import { UserType } from "app/services/users";
import React from "react";
import AhoraUsersField from "../../AhoraUsersField";

interface Props {
    value?: number[];
    fieldData: AhoraFormField;
    onChange?: (value: number[]) => void;
    userType?: UserType;
}

export default function SearchDocUserGroupField(props: Props) {
    return <AhoraUsersField userType={props.userType} fieldData={props.fieldData} value={props.value} onChange={props.onChange} showUnassigned />
}
