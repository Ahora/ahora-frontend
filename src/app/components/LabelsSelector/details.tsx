import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { Label } from 'app/services/labels';
import { Tag, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface LabelsSelectorState {
    selectedLabels?: Label[];
    selectedLabelsMap: Map<number, Label>;
    isDropDownOpened: boolean;
    labeldropdown?: string;
}

interface LabelsSelectorProps {
    labelMap: Map<number, Label>;
    labelByNameMap: Map<string, Label>;
    possibleLabels: Label[];
}

interface AllProps extends LabelsSelectorProps {
    onChange(labels: number[]): void;
    defaultSelected?: number[];
    canEdit?: boolean;

}

class LabelsList extends React.Component<AllProps, LabelsSelectorState> {

    constructor(props: AllProps) {
        super(props);

        this.state = {
            isDropDownOpened: false,
            selectedLabelsMap: new Map()
        };
    }

    initData() {
        if (this.props.defaultSelected && this.props.labelMap) {
            let selectedLabels: Label[] = [];
            const selectedLabelsMap = this.state.selectedLabelsMap;
            selectedLabelsMap.clear();
            if (this.props.labelMap && this.props.defaultSelected) {
                this.props.defaultSelected.forEach((id) => {
                    const label: Label | undefined = this.props.labelMap.get(id);
                    if (label) {
                        selectedLabelsMap.set(label.id!, label);
                        selectedLabels.push(label);
                    }
                });
            }

            this.setState({ selectedLabels, selectedLabelsMap });
        }
    }

    componentDidMount() {
        this.initData();
    }

    componentDidUpdate(prevProps: AllProps) {
        if (this.props.defaultSelected && prevProps.defaultSelected !== this.props.defaultSelected) {
            this.initData();
        }
    }

    onClose(deletedLabel: Label) {
        if (this.state.selectedLabels) {
            const labels = this.state.selectedLabels.filter((label) => label.id !== deletedLabel.id);
            const map = this.state.selectedLabelsMap;
            map.delete(deletedLabel.id!);
            this.setState({ selectedLabels: labels, selectedLabelsMap: map });
            this.onChange(labels);
        }
    }

    onChange(labels: Label[]) {
        this.props.onChange(labels.map((label) => label.id!));
    }

    onLabelAdded(value: any) {
        const selectedLabel: Label | undefined = this.props.labelByNameMap.get(value)
        const map = this.state.selectedLabelsMap;
        if (selectedLabel) {
            const labels: Label[] = this.state.selectedLabels ? [...this.state.selectedLabels!, selectedLabel] : [selectedLabel];
            map.set(selectedLabel.id!, selectedLabel);

            this.setState({
                labeldropdown: "",
                selectedLabelsMap: map,
                selectedLabels: labels
            });
            this.onChange(labels);
        }
    }

    openDropDown() {
        this.setState({ isDropDownOpened: true });
    }

    render() {
        const possibleLabelsToAdd = this.props.possibleLabels.filter((label) => !this.state.selectedLabelsMap.has(label.id!));
        return (
            <>
                {this.state.selectedLabels && this.state.selectedLabels.map((label: Label) => {
                    return <Tag onClose={this.onClose.bind(this, label)} closable={this.props.canEdit} color={`#${label.color}`} key={label.id}>{label.name}</Tag>;
                })}
                {
                    (this.props.canEdit && possibleLabelsToAdd.length > 0) &&
                    <>
                        {
                            this.state.isDropDownOpened ?
                                <Select value={this.state.labeldropdown} autoFocus={true} onSelect={this.onLabelAdded.bind(this)} style={{ width: "200px" }} showSearch>
                                    {possibleLabelsToAdd.map((label) =>
                                        <Select.Option value={label.name} key={label.id}>
                                            <Tag color={`#${label.color}`} key={label.id}>{label.name}</Tag>
                                        </Select.Option>)}
                                </Select> :
                                <Tag className="site-tag-plus" onClick={this.openDropDown.bind(this)}>
                                    <PlusOutlined /> New Label
                                </Tag>
                        }
                    </>
                }


            </>
        );
    }
}

const mapStateToProps = (state: ApplicationState,): LabelsSelectorProps => {
    return {
        labelMap: state.labels.mapById,
        labelByNameMap: state.labels.mapByName,
        possibleLabels: state.labels.labels
    };
};

export default connect(mapStateToProps, null)(LabelsList as any); 