import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { Label } from 'app/services/labels';
import { Tag } from 'antd';

interface LabelsSelectorState {
    selectedLabels?: Label[];
}

interface LabelsSelectorProps {
    labelMap: Map<number, Label>;
}

interface AllProps extends LabelsSelectorProps {
    onChange(labels: Label[]): void;
    defaultSelected?: number[];
}

class LabelsList extends React.Component<AllProps, LabelsSelectorState> {
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

    onChange(labels: Label[]) {
        this.props.onChange(labels);
        this.setState({
            selectedLabels: labels
        })
    }

    render() {
        return (
            <>
                {this.state.selectedLabels && this.state.selectedLabels.map((label: Label) => {
                    return <Tag color={`#${label.color}`} key={label.id}>{label.name}</Tag>;
                })}

            </>
        );
    }
}

const mapStateToProps = (state: ApplicationState,): LabelsSelectorProps => {
    return {
        labelMap: state.labels.mapById
    };
};

export default connect(mapStateToProps, null)(LabelsList as any); 