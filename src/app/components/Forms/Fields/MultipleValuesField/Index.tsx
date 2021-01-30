import { Select } from "antd"
import React, { ReactNode } from "react"
class MulipleValuesSelect extends Select<string[]> {

}

interface MultipleValuesProps {
    value?: string[];
    getValues: () => ReactNode;
    onChange: (value: string[]) => void;
}

export default function MultipleValuesField(props: MultipleValuesProps) {


    const onUpdate = (values: string[]) => {
        props.onChange(values);
    }

    return <MulipleValuesSelect
        mode="multiple"
        onChange={onUpdate}
        showSearch={false}
        value={props.value}>
        {props.getValues()}
    </MulipleValuesSelect>
}