import * as React from 'react';
import { ApplicationState } from 'app/store';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Label } from 'app/services/labels';
import { Tag } from 'antd';
import { requestLabelData } from 'app/store/labels/actions';
import AhoraSpinner from '../Forms/Basics/Spinner';

interface InjectableProps {
    label?: Label;
}

interface LabelTagProps extends InjectableProps, DispatchProps {
    labelId?: number;
    onClose: (event?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    closable: boolean;
}

interface DispatchProps {
    requestLabelInfo(labelId: number): void;
}

class LabelTag extends React.Component<LabelTagProps> {

    constructor(props: LabelTagProps) {
        super(props);
    }

    async componentDidMount() {
        if (this.props.labelId && !this.props.label) {
            console.log("request", this.props.labelId);
            this.props.requestLabelInfo(this.props.labelId);
        }
    }

    render() {
        if (this.props.label) {
            return <Tag onClose={this.props.onClose} closable={this.props.closable} color={`#${this.props.label.color || "0366d6"}`} key={this.props.label.id}>{this.props.label.name}</Tag>;
        }
        else {
            return <AhoraSpinner />
        }
    }
}


const mapStateToProps = (state: ApplicationState, props: LabelTagProps): InjectableProps => {
    let label = props.label;
    if (props.labelId && !label) {
        label = state.labels.mapById.get(props.labelId);
    }
    return { label };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        requestLabelInfo: (labelId) => dispatch(requestLabelData(labelId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LabelTag as any)