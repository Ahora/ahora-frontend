import { Select } from "antd";
import React from "react";
import { FormattedMessage } from "react-intl";
import MultipleValuesField from "../../MultipleValuesField/Index";

interface Props {
    value?: string[];
    onChange?: (value: string[]) => void;
}

export default function SearchDocIsPrivateField(props: Props) {

    const getValues = () => {
        return <>
            <Select.Option value=""><FormattedMessage id="all"></FormattedMessage></Select.Option>
            <Select.Option value="true"><FormattedMessage id="private"></FormattedMessage></Select.Option>
            <Select.Option value="false"><FormattedMessage id="public"></FormattedMessage></Select.Option>
        </>
    }

    return <MultipleValuesField mode="single" getValues={getValues} value={props.value || [""]} onChange={props.onChange} />
}