import * as React from 'react';
import Form from 'react-bootstrap/Form';
import { AhoraFormField } from '../../AhoraForm/data';

interface GroupBySelectState {
    value: string;
}

interface GroupBySelectStateProps {
    value?: string;
    fieldData: AhoraFormField;
    onUpdate: (value: string) => void;
}


class AhoraTextField extends React.Component<GroupBySelectStateProps, GroupBySelectState> {
    constructor(props: GroupBySelectStateProps) {
        super(props);

        this.state = {
            value: this.props.value || ""
        };
    }


    handleChange(event: any) {
        this.setState({ value: event.target.value });
        this.props.onUpdate(event.target.value);

    }

    render() {
        return (
            <Form.Control required={this.props.fieldData.required} type="text" value={this.props.value} onChange={this.handleChange.bind(this)} />
        );
    }
}

export default AhoraTextField;