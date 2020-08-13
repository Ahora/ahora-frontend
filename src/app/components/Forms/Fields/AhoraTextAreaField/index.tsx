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


class AhoraTextAreaField extends React.Component<GroupBySelectStateProps, GroupBySelectState> {
    constructor(props: GroupBySelectStateProps) {
        super(props);

        this.state = {
            value: this.props.value || ""
        };
    }


    onChange(event: any) {
        this.setState({ value: event.target.value });
        this.props.onChange(event.target.value);
    }

    render() {
        return (
            <Input.TextArea rows={6} allowClear onChange={this.onChange.bind(this)}>{this.state.value}</Input.TextArea>
        );
    }
}

export default AhoraTextAreaField;