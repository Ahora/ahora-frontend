import * as React from 'react';
import Form from 'react-bootstrap/Form';
import { AhoraFormField } from '../../AhoraForm/data';
import { ApplicationState } from 'app/store';
import { connect } from 'react-redux';
import { OrganizationMilestone } from 'app/services/OrganizationMilestones';

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
    onUpdate: (value: number) => void;
}


class AhoraDocStatusField extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            value: this.props.value,
        };
    }

    handleChange(event: any) {
        const value: number = parseInt(event.target.value);
        this.setState({ value });
        this.props.onUpdate(value);
    }

    render() {
        return (
            <div>
                <Form.Control autoFocus={this.props.autoFocus} onBlur={this.handleChange.bind(this)} value={this.state.value ? this.state.value.toString() : ""} onChange={this.handleChange.bind(this)} as="select">
                    <option key={-1} value={undefined}></option>
                    {this.props.milestones.map((milestone) => <option key={milestone.id} value={milestone.id}>{milestone.title}</option>)}
                </Form.Control>
            </div>)
    }
}


const mapStateToProps = (state: ApplicationState) => {
    return {
        milestones: state.milestones.milestones
    };
};

export default connect(mapStateToProps, null)(AhoraDocStatusField as any); 