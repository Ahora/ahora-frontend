import * as React from 'react';
import { AhoraFormField } from '../../AhoraForm/data';
import { Switch } from 'antd';

interface State {
    value?: boolean;
}

interface Props {
    value?: boolean;
    fieldData: AhoraFormField;
    onChange?: (value: boolean) => void;
}


class AhoraBooleanField extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            value: this.props.value
        };
    }


    handleChange(value: any) {
        this.setState({ value });
        if (this.props.onChange)
            this.props.onChange(value);
    }

    render() {
        return (
            <Switch checked={this.props.value} onChange={this.handleChange.bind(this)} />
        );
    }
}

export default AhoraBooleanField;