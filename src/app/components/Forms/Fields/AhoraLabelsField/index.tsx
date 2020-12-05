import { Select, Spin } from 'antd';
import * as React from 'react';
import { AhoraFormField } from '../../AhoraForm/data';
import debounce from 'lodash/debounce';
import { addLabel, Label, searchLabels } from 'app/services/labels';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { addLabelToState } from 'app/store/labels/actions';
import LabelTag from 'app/components/Labels/LabelTag';

class LabelSelect extends Select<number[]> {

}

interface GroupBySelectState {
    value: number[];
    searchedLabels: Label[];
    fetchingData: boolean;
}

interface DispatchProps {
    addLabel(label: Label): void;
}

interface Props extends DispatchProps {
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
            this.setState({ value, searchedLabels: [], fetchingData: true });
            const addedLabel = await addLabel({ name: this.newLabelText });
            this.props.addLabel(addedLabel);
            value[newLabelIndex] = addedLabel.id;
        }

        this.setState({ value, fetchingData: false });
        this.props.onChange(value);
    }

    tagRender(props: any) {
        const { value, closable, onClose } = props;

        return (
            <LabelTag labelId={value} closable={closable} onClose={onClose} />
        );
    }

    render() {
        return <LabelSelect
            mode="multiple"
            value={this.props.value}
            loading={this.state.fetchingData}
            placeholder="Select labels"
            notFoundContent={this.state.fetchingData ? <Spin size="small" /> : null}
            filterOption={false}
            tagRender={this.tagRender.bind(this)}
            onSearch={this.startSearch.bind(this)}
            onChange={this.onSelectUpdate.bind(this)}
            style={{ width: '100%' }}
        >
            {this.state.searchedLabels.map((label) => (
                <Select.Option value={label.id!} key={label.id}>
                    {label.id === -1 ?
                        <>{label.name}</> :
                        <LabelTag label={label} />
                    }</Select.Option>
            ))}
        </LabelSelect>
    }
}


const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        addLabel: (label: Label) => dispatch(addLabelToState(label))
    }
}


const connector = connect(null, mapDispatchToProps);
export default connector(AhoraLabelsField as any)