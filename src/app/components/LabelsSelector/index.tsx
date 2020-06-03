import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { Label } from 'app/services/labels';
import { Typeahead } from 'react-bootstrap-typeahead';

interface LabelsSelectorState {
    selectedLabels?: Label[];
}

interface LabelsSelectorProps {
    labels: Label[],
    labelMap: Map<number, Label>;
}

interface AllProps extends LabelsSelectorProps {
    onChange(labels: number[]): void;
    defaultSelected?: number[];
    autoFocus?: boolean;
}

class LabelsSelector extends React.Component<AllProps, LabelsSelectorState> {
    constructor(props: AllProps) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
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

    onBlur() {
        if (this.state.selectedLabels) {
            this.props.onChange(this.state.selectedLabels!.map((label) => label.id!));
        }
        else {
            this.props.onChange([]);
        }
    }

    onChange(labels: Label[]) {
        this.setState({
            selectedLabels: labels
        })
    }

    render() {
        return (<Typeahead autoFocus={this.props.autoFocus} onBlur={this.onBlur.bind(this)} multiple={true} selected={this.state.selectedLabels} onChange={this.onChange.bind(this)} labelKey="name" options={this.props.labels}></Typeahead>);
    }
}

const mapStateToProps = (state: ApplicationState, ): LabelsSelectorProps => {
    return {
        labels: state.labels.labels,
        labelMap: state.labels.mapById
    };
};


export default connect(mapStateToProps, null)(LabelsSelector as any); 