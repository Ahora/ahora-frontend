import * as React from 'react';
import { AhoraFormField } from '../../AhoraForm/data';
import { ApplicationState } from 'app/store';
import { connect } from 'react-redux';
import { Status } from 'app/services/statuses';
import { Select } from 'antd';

interface State {
    value: number;
}

interface InjectedProps {
    statuses: Status[];
}

interface Props extends InjectedProps {
    value: number;
    autoFocus?: boolean;
    fieldData: AhoraFormField;
    onUpdate: (value: number) => void;
}


class AhoraDocStatusField extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            value: this.props.value,
        };
    }

    handleChange(value: number) {
        this.setState({ value });
        this.props.onUpdate(value);
    }

    onBlur() {
        this.props.onUpdate(this.state.value);
    }


    render() {
        return (
            <div>
                <Select autoFocus={this.props.autoFocus} onBlur={this.onBlur.bind(this)} value={this.state.value} onChange={this.handleChange.bind(this)}>
                    {this.props.statuses.map((status) => <Select.Option key={status.id} value={status.id!}>{status.name}</Select.Option>)}
                </Select>
            </div>)
    }
}


const mapStateToProps = (state: ApplicationState) => {
    return {
        statuses: state.statuses.statuses
    };
};

export default connect(mapStateToProps, null)(AhoraDocStatusField as any); 