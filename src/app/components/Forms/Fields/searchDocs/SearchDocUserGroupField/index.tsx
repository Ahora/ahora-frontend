import { AhoraFormField } from "app/components/Forms/AhoraForm/data";
import React from "react";
import AhoraUsersField from "../../AhoraUsersField";

interface Props {
    value?: number[];
    fieldData: AhoraFormField;
    onChange?: (value: number[]) => void;
}

export default function SearchDocUserGroupField(props: Props) {
    return <AhoraUsersField fieldData={props.fieldData} value={props.value} onChange={props.onChange} showUnassigned />
}
