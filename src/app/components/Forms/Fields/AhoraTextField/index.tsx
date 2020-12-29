import * as React from 'react';
import { AhoraFormField } from '../../AhoraForm/data';
import { Input } from 'antd';

interface GroupBySelectState {
    value: string;
}

interface GroupBySelectStateProps {
    value?: string;
    fieldData: AhoraFormField;
    onChange: (value: string) => void;
}


class AhoraTextField extends React.Component<GroupBySelectStateProps, GroupBySelectState> {
    constructor(props: GroupBySelectStateProps) {
        super(props);

        this.state = {
            value: this.props.value || ""
        };
    }


    handleChange(event: any) {
        this.setState({ value: event!.target.value });
        this.props.onChange(event!.target.value);
    }

    render() {
        return (
            <Input value={this.state.value} autoFocus={this.props.fieldData.autoFocus} onChange={this.handleChange.bind(this)} ></Input>
        );
    }
}

export default AhoraTextField;