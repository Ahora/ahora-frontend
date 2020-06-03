import * as React from 'react';
import Form from 'react-bootstrap/Form';
import { AhoraFormField } from '../../AhoraForm/data';

interface GroupBySelectState {
    value: string;
}

interface GroupBySelectStateProps {
    value?: number;
    fieldData: AhoraFormField;
    onUpdate: (value: string) => void;
}


class AhoraNumberField extends React.Component<GroupBySelectStateProps, GroupBySelectState> {
    constructor(props: GroupBySelectStateProps) {
        super(props);

        this.state = {
            value: this.props.value ? this.props.value.toString() : ""
        };
    }


    handleChange(event: any) {
        this.setState({ value: event.target.value });
        this.props.onUpdate(event.target.value);
    }

    render() {
        return (
            <Form.Control className="mb-2 mr-sm-2" required={this.props.fieldData.required} type="number" value={this.state.value} onChange={this.handleChange.bind(this)} />
        );
    }
}

export default AhoraNumberField;