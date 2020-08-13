import * as React from 'react';
import { AhoraFormField } from '../../AhoraForm/data';
import LabelsList from 'app/components/LabelsSelector/details';

interface GroupBySelectState {
    value?: number[];
}

interface Props {
    value?: number[];
    fieldData: AhoraFormField;
    onChange: (value: number[]) => void;
}


export default class AhoraLabelsField extends React.Component<Props, GroupBySelectState> {
    constructor(props: Props) {
        super(props);

        this.state = {
            value: this.props.value
        };
    }

    onUpdate(value: number[]) {
        this.setState({ value });
        this.props.onChange(value);
    }

    render() {
        return (<LabelsList onChange={this.onUpdate.bind(this)} canEdit={true}></LabelsList>)
    }
}