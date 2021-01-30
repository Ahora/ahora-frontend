import { Select } from "antd"
import React, { ReactNode } from "react"
class MulipleValuesSelect extends Select<string[]> {

}

interface MultipleValuesProps {
    value?: string[];
    mode?: 'multiple' | 'single';
    getValues: () => ReactNode;
    onChange?: (value: string[]) => void;
}

export default function MultipleValuesField(props: MultipleValuesProps) {
    return <MulipleValuesSelect
        mode={props.mode ? (props.mode === "single" ? undefined : props.mode) : "multiple"}
        onChange={props.onChange}
        showSearch={false}
        value={props.value}>
        {props.getValues()}
    </MulipleValuesSelect>
}