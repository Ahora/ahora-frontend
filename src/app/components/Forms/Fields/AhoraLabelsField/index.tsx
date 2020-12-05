import { Select, Spin } from 'antd';
import * as React from 'react';
import { AhoraFormField } from '../../AhoraForm/data';
import debounce from 'lodash/debounce';
import { addLabel, Label, searchLabels } from 'app/services/labels';
import { ApplicationState } from 'app/store';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { addLabelFromState } from 'app/store/labels/actions';

class LabelSelect extends Select<number[]> {

}

interface GroupBySelectState {
    value: number[];
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
    private newLabelText?: string;
    constructor(props: Props) {
        super(props);

        this.state = {
            value: this.props.value || [],
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
            labels = [{ name: q, id: -1 }];
        }
        this.newLabelText = q;
        this.setState({ searchedLabels: labels, fetchingData: false });
    }

    async onSelectUpdate(value: number[]) {
        const newLabelIndex = value.indexOf(-1);
        if (newLabelIndex > -1 && this.newLabelText) {
            const addedLabel = await addLabel({ name: this.newLabelText });
            this.props.addLabel(addedLabel);
            value[newLabelIndex] = addedLabel.id;
        }

        this.setState({ value });
        this.props.onChange(value);
    }

    tagRender(props: any) {
        const { value } = props;

        return (
            <div> { value}</div>
        );
    }

    render() {
        return <LabelSelect
            mode="multiple"
            value={this.props.value}
            placeholder="Select labels"
            notFoundContent={this.state.fetchingData ? <Spin size="small" /> : null}
            filterOption={false}
            tagRender={this.tagRender.bind(this)}
            onSearch={this.startSearch.bind(this)}
            onChange={this.onSelectUpdate.bind(this)}
            style={{ width: '100%' }}
        >
            {this.state.searchedLabels.map((label) => (
                <Select.Option value={label.id!} key={label.id}>{label.name}</Select.Option>
            ))}
        </LabelSelect>
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