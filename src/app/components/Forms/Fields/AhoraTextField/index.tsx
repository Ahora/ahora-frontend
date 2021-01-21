import * as React from 'react';
import { AhoraFormField } from '../../AhoraForm/data';
import { Input } from 'antd';

interface State {
    value: string;
}

interface Props {
    value?: string;
    fieldData: AhoraFormField;
    onChange: (value: string) => void;
}


class AhoraTextField extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            value: this.props.value || ""
        };
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.value && this.props.value !== this.state.value) {
            this.setState({ value: this.props.value })
        }
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