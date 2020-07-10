import * as React from 'react';
import Form from 'react-bootstrap/Form';
import { AhoraFormField } from '../../AhoraForm/data';

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

    onCheckChange(event: any) {
        const value = event.target.value;
        this.setState({ value });
        this.props.onUpdate(value);
    }

    render() {
        return (
            <Form.Control value={this.props.value ? this.props.value.toString() : undefined} onChange={this.onCheckChange.bind(this)} as="select">
                {this.props.fieldData.settings!.keys.map((key: string) => {
                    return (<option key={key} value={this.props.fieldData.settings!.enum[key]}>{key}</option>);
                })}
            </Form.Control>)
    }
}