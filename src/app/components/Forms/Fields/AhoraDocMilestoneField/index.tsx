import * as React from 'react';
import { AhoraFormField } from '../../AhoraForm/data';
import { ApplicationState } from 'app/store';
import { connect } from 'react-redux';
import { OrganizationMilestone } from 'app/services/OrganizationMilestones';
import { Select } from 'antd';

interface State {
    value?: number;
}

interface InjectedProps {
    milestones: OrganizationMilestone[];
}

interface Props extends InjectedProps {
    value?: number;
    autoFocus?: boolean;
    fieldData: AhoraFormField;
    onChange: (value: number | null) => void;
}


class AhoraDocStatusField extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            value: this.props.value,
        };
    }

    handleChange(value?: number) {
        this.setState({ value });
        this.props.onChange(value || null);
    }

    onBlur() {
        this.props.onChange(this.state.value || null);
    }

    render() {
        return (
            <div>
                <Select autoFocus={this.props.autoFocus} onBlur={this.onBlur.bind(this)} value={this.state.value} onChange={this.handleChange.bind(this)}>
                    <Select.Option key="-1" value=""> </Select.Option>
                    {this.props.milestones.map((milestone) => <Select.Option key={milestone.id} value={milestone.id!}>{milestone.title}</Select.Option>)}
                </Select>
            </div>)
    }
}


const mapStateToProps = (state: ApplicationState) => {
    return {
        milestones: state.milestones.milestones
    };
};

export default connect(mapStateToProps, null)(AhoraDocStatusField as any); 