import { Select, Spin } from 'antd';
import * as React from 'react';
import { AhoraFormField } from '../../AhoraForm/data';
import debounce from 'lodash/debounce';
import { addLabel, Label, searchLabels } from 'app/services/labels';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { addLabelToState, updateLabelUsedInStore } from 'app/store/labels/actions';
import LabelTag from 'app/components/Labels/LabelTag';
import { ApplicationState } from 'app/store';

class LabelSelect extends Select<number[]> {

}

interface InjectableProps {
    recentLabels: Set<number>
}

interface GroupBySelectState {
    value: number[];
    searchedLabels: number[];
    fetchingData: boolean;
}

interface DispatchProps {
    addLabel(label: Label): void;
    labelUsed(id: number): void;
}

interface Props extends DispatchProps, InjectableProps {
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
            searchedLabels: [...this.props.recentLabels].reverse()
        };

        this.fetchLabels = debounce(this.fetchLabels, 500);
    }

    async startSearch(q: string) {
        if (q.length > 0) {
            this.setState({ fetchingData: true, searchedLabels: [] });
            await this.fetchLabels(q);
        }
        else {
            this.setState({ fetchingData: true, searchedLabels: [...this.props.recentLabels].reverse() });

        }

    }

    async fetchLabels(q: string) {
        let labels: Label[] = await searchLabels(q);

        if (labels.length === 0) {
            labels = [{ name: q, id: -1 }];
        }
        this.newLabelText = q;
        this.setState({
            searchedLabels: labels.map((label) => {
                this.props.addLabel(label);
                return label.id;
            }), fetchingData: false
        });
    }

    async onSelectUpdate(value: number[]) {
        const newLabelIndex = value.indexOf(-1);
        if (newLabelIndex > -1 && this.newLabelText) {
            this.setState({ value, searchedLabels: [...this.props.recentLabels].reverse(), fetchingData: true });
            const addedLabel = await addLabel({ name: this.newLabelText });
            this.props.addLabel(addedLabel);
            value[newLabelIndex] = addedLabel.id;
        }

        if (value.length > 0) {
            this.props.labelUsed(value[value.length - 1]);
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
            {this.state.searchedLabels.map((labelId: number) => (
                <Select.Option value={labelId} key={labelId}>
                    {labelId === -1 ?
                        <>{this.newLabelText}</> :
                        <LabelTag labelId={labelId} />
                    }</Select.Option>
            ))}
        </LabelSelect>
    }
}
const mapStateToProps = (state: ApplicationState): InjectableProps => {
    return {
        recentLabels: state.labels.recentLabels
    };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {

    return {
        addLabel: (label: Label) => dispatch(addLabelToState(label)),
        labelUsed: (id: number) => dispatch(updateLabelUsedInStore(id))
    }
}


const connector = connect(mapStateToProps, mapDispatchToProps);
export default connector(AhoraLabelsField as any)