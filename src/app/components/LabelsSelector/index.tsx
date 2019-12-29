import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { Dispatch } from 'redux';
import { Label } from 'app/services/labels';
import { requestLabelsData } from 'app/store/labels/actions';
import { Typeahead } from 'react-bootstrap-typeahead';

interface LabelsSelectorState {
    selectedLabels?: Label[];
}

interface LabelsSelectorProps {
    labels: Label[],
    labelMap: Map<number, Label>;
}

interface DispatchProps {
    requestLabels(): void;
}

interface AllProps extends LabelsSelectorProps, DispatchProps {
    onChange(labels: Label[]): void;
    defaultSelected?: number[];
}

class LabelsSelector extends React.Component<AllProps, LabelsSelectorState> {
    constructor(props: AllProps) {
        super(props);

        this.state = {};
    }

    componentDidUpdate() {
        if (this.props.defaultSelected && this.props.labelMap && !this.state.selectedLabels) {
            let selectedLabels: Label[] = [];
            if (this.props.labelMap && this.props.defaultSelected) {
                this.props.defaultSelected.forEach((id) => {
                    const label: Label | undefined = this.props.labelMap.get(id);
                    if (label) {
                        selectedLabels.push(label);
                    }
                });
            }

            this.setState({ selectedLabels });
        }

    }

    async componentDidMount() {
        this.props.requestLabels();

    }

    onChange(labels: Label[]) {
        this.props.onChange(labels);
        this.setState({
            selectedLabels: labels
        })
    }

    render() {
        return (<Typeahead multiple={true} selected={this.state.selectedLabels} onChange={this.onChange.bind(this)} labelKey="name" options={this.props.labels}></Typeahead>);
    }
}

const mapStateToProps = (state: ApplicationState, ): LabelsSelectorProps => {
    return {
        labels: state.labels.labels,
        labelMap: state.labels.mapById
    };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        requestLabels: () => dispatch(requestLabelsData())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LabelsSelector as any); 