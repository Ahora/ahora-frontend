import * as React from 'react';
import { ApplicationState } from 'app/store';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Label } from 'app/services/labels';
import { Tag } from 'antd';
import { addLabelToState, requestLabelData } from 'app/store/labels/actions';
import AhoraSpinner from '../Forms/Basics/Spinner';

interface State {
    addingLabel: boolean;
}
interface InjectableProps {
    label?: Label;
    mapByName: Map<string, Label>;
}

interface LabelTagProps extends InjectableProps, DispatchProps {
    labelId?: number;
    labelName?: string;
    onLabelAdded?: (label: Label) => void;
    onClose: (event?: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    closable: boolean;
}

interface DispatchProps {
    requestLabelInfo(labelId: number): void;
    addLabelToState(label: Label): void;
}

class LabelTag extends React.Component<LabelTagProps, State> {

    constructor(props: LabelTagProps) {
        super(props);

        this.state = {
            addingLabel: false
        }
    }

    async componentDidMount() {
        if (this.props.labelId && !this.props.labelId) {
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
    if (props.labelName && !label) {
        label = state.labels.mapByName.get(props.labelName);
    }
    return { label, mapByName: state.labels.mapByName };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        requestLabelInfo: (labelId) => dispatch(requestLabelData(labelId)),
        addLabelToState: label => dispatch(addLabelToState(label))
    }
}

const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(LabelTag as any)