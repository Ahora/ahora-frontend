import * as React from 'react';
import { AhoraFormField } from '../../AhoraForm/data';
import { InputNumber } from 'antd';

interface GroupBySelectState {
    value?: any;
}

interface GroupBySelectStateProps {
    value?: any;
    fieldData: AhoraFormField;
    onUpdate: (value: number) => void;
}


class AhoraNumberField extends React.Component<GroupBySelectStateProps, GroupBySelectState> {
    constructor(props: GroupBySelectStateProps) {
        super(props);

        this.state = {
            value: this.props.value
        };
    }


    handleChange(value: any) {
        this.setState({ value });
        this.props.onUpdate(value);
    }

    render() {
        return (
            <InputNumber min={1} max={100} defaultValue={this.props.value || 30} onChange={this.handleChange.bind(this)} />
        );
    }
}

export default AhoraNumberField;