import * as React from 'react';
import Form from 'react-bootstrap/Form';
import { AhoraFormField } from '../../AhoraForm/data';

interface GroupBySelectState {
    value: number;
    enumValues: string[];
}

interface GroupBySelectStateProps {
    value?: number;
    fieldData: AhoraFormField;
    onUpdate: (value: number) => void;
}


class AhoraEnumField extends React.Component<GroupBySelectStateProps, GroupBySelectState> {
    constructor(props: GroupBySelectStateProps) {
        super(props);

        this.state = {
            value: this.props.value || 0,
            enumValues: this.props.fieldData.settings!.keys
        };
    }

    onCheckChange(event: any) {
        const checked: boolean = event.target.checked;
        const key: string = event.target.name;

        let value = 0

        if (checked) {
            value = this.state.value | this.props.fieldData.settings!.enum[key];
        }
        else {
            value = this.state.value & ~this.props.fieldData.settings!.enum[key];
        }
        this.setState({ value });
        this.props.onUpdate(value);
    }

    render() {
        return (
            <div>
                {this.state.enumValues.map((key) => {
                    return (
                        <Form.Check onChange={this.onCheckChange.bind(this)} name={key} checked={(this.state.value & this.props.fieldData.settings!.enum[key]) === this.props.fieldData.settings!.enum[key]} key={key} label={key} type="checkbox" id={`inline-checkbox-${key}`} />);
                })}
            </div>)
    }
}

export default AhoraEnumField;