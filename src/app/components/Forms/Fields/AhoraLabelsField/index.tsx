import { Select, Spin } from 'antd';
import LabelTag from 'app/components/Labels/LabelTag';
import * as React from 'react';
import { AhoraFormField } from '../../AhoraForm/data';
import debounce from 'lodash/debounce';
import { Label, searchLabels } from 'app/services/labels';
import { ApplicationState } from 'app/store';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { addLabelFromState } from 'app/store/labels/actions';

interface GroupBySelectState {
    value: number[];
    defaultTags: string[];
    currentTags: string[];
    searchedLabels: Label[];
    fetchingData: boolean;
}

interface InjectableProps {
    mapByName: Map<string, Label>;
    mapById: Map<number, Label>;
}

interface DispatchProps {
    addLabel(label: Label): void;
}

interface Props extends InjectableProps, DispatchProps {
    value?: number[];
    fieldData: AhoraFormField;
    onChange: (value: number[]) => void;
}

class AhoraLabelsField extends React.Component<Props, GroupBySelectState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            value: this.props.value || [],
            defaultTags: [],
            currentTags: [],
            fetchingData: false,
            searchedLabels: []
        };

        this.fetchLabels = debounce(this.fetchLabels, 500);
    }

    async startSearch(q: string) {
        this.setState({ fetchingData: true, searchedLabels: [] });
        await this.fetchLabels(q);
    }

    async fetchLabels(q: string) {
        let labels: Label[] = await searchLabels(q);

        if (labels.length === 0) {
            labels = [{ name: q }];
        }
        this.setState({ searchedLabels: labels, fetchingData: false });
    }

    onSelectUpdate(value: string[]) {
        this.onUpdate(value);
    }

    onUpdate(value: string[], newLabel: Label | undefined = undefined) {

        if (newLabel) {
            this.props.mapByName.set(newLabel.name, newLabel);
        }
        const numberValue = value.map((tagName: string) => {
            const label = this.props.mapByName.get(tagName);
            return label ? label.id! : -1;
        }).filter((val: number) => val > 0);
        this.setState({ currentTags: value, value: numberValue });
        this.props.onChange(numberValue);
    }

    onLabelAdded(newLabel: Label) {
        this.onUpdate(this.state.currentTags, newLabel);
    }

    tagRender(props: any) {
        const { value, closable, onClose } = props;

        return (
            <LabelTag onLabelAdded={this.onLabelAdded.bind(this)} labelName={value} closable={closable} onClose={onClose} style={{ marginRight: 3 }}></LabelTag>
        );
    }

    render() {
        return <Select
            mode="multiple"
            defaultValue={this.state.defaultTags}
            placeholder="Select labels"
            notFoundContent={this.state.fetchingData ? <Spin size="small" /> : null}
            filterOption={false}
            tagRender={this.tagRender.bind(this)}
            onSearch={this.startSearch.bind(this)}
            onChange={this.onSelectUpdate.bind(this)}
            style={{ width: '100%' }}
        >
            {this.state.searchedLabels.map((label) => (
                <Select.Option value={label.name} key={label.id}><LabelTag label={label}></LabelTag></Select.Option>
            ))}
        </Select>
    }
}



const mapStateToProps = (state: ApplicationState): InjectableProps => {
    return { mapByName: state.labels.mapByName, mapById: state.labels.mapById };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        addLabel: (label: Label) => dispatch(addLabelFromState(label))
    }
}


const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(AhoraLabelsField as any)