import * as React from 'react';
import { AhoraFormField } from '../../AhoraForm/data';
import { Select } from 'antd';

interface GroupBySelectState {
    value: number;
}

interface GroupBySelectStateProps {
    value?: number;
    fieldData: AhoraFormField;
    onChange: (value: number) => void;
}


export default class AhoraEnumField extends React.Component<GroupBySelectStateProps, GroupBySelectState> {
    constructor(props: GroupBySelectStateProps) {
        super(props);
        const currentEnum = this.props.fieldData.settings!.enum;


        this.state = {
            value: this.props.value || currentEnum[this.props.fieldData.settings!.keys[0]]
        };
    }

    onCheckChange(value: any) {
        this.setState({ value });
        this.props.onChange(value);
    }

    render() {
        const currentEnum = this.props.fieldData.settings!.enum;
        return (
            <Select value={this.state.value} onSelect={this.onCheckChange.bind(this)}>
                {this.props.fieldData.settings!.keys.map((key: string) => {
                    return (<Select.Option key={key} value={currentEnum[key]}>{key}</Select.Option>);
                })}
            </Select>)
    }
}