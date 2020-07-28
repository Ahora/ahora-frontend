import * as React from 'react';
import { AhoraFormField } from '../../AhoraForm/data';
import { Select } from 'antd';

interface GroupBySelectState {
    value: number;
}

interface GroupBySelectStateProps {
    value?: number;
    fieldData: AhoraFormField;
    onUpdate: (value: number) => void;
}


export default class AhoraEnumField extends React.Component<GroupBySelectStateProps, GroupBySelectState> {
    constructor(props: GroupBySelectStateProps) {
        super(props);

        this.state = {
            value: this.props.value || 0
        };
    }

    onCheckChange(value: any) {
        this.setState({ value });
        this.props.onUpdate(value);
    }

    render() {
        return (
            <Select value={this.props.value ? this.props.value.toString() : undefined} onChange={this.onCheckChange.bind(this)}>
                {this.props.fieldData.settings!.keys.map((key: string) => {
                    return (<Select.Option key={key} value={this.props.fieldData.settings!.enum[key]}>{key}</Select.Option>);
                })}
            </Select>)
    }
}