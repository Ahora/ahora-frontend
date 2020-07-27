import * as React from 'react';
import { AhoraFormField } from '../../AhoraForm/data';
import { DatePicker } from 'antd';

interface GroupBySelectState {
    value?: Date;
}

interface GroupBySelectStateProps {
    value: any;
    fieldData: AhoraFormField;
    onUpdate: (value: string) => void;
}


class AhoraDateField extends React.Component<GroupBySelectStateProps, GroupBySelectState> {
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
            <DatePicker value={this.props.value} style={{ width: "100%" }} onChange={this.handleChange.bind(this)} />);
    }
}

export default AhoraDateField;