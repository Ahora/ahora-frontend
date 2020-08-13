import * as React from 'react';
import { AhoraFormField } from '../../AhoraForm/data';
import GroupBySelect from '../../Basics/GroupBySelect';

interface AhoraGroupDocFieldState {
    value: string;
}

interface AhoraGroupDocFieldProps {
    value?: string;
    fieldData: AhoraFormField;
    onChange: (value: string) => void;
}


class AhoraGroupDocField extends React.Component<AhoraGroupDocFieldProps, AhoraGroupDocFieldState> {
    constructor(props: AhoraGroupDocFieldProps) {
        super(props);

        this.state = {
            value: this.props.value || ""
        };
    }


    handleChange(value: string) {
        this.setState({ value });
        this.props.onChange(value);
    }

    render() {
        return (
            <GroupBySelect onUpdate={this.handleChange.bind(this)} value={this.props.value}></GroupBySelect>
        );
    }
}

export default AhoraGroupDocField;