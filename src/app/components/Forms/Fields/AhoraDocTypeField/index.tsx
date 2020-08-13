import * as React from 'react';
import { AhoraFormField } from '../../AhoraForm/data';
import { Select } from 'antd';
import { ApplicationState } from 'app/store';
import { connect } from 'react-redux';
import { DocType } from 'app/services/docTypes';

interface GroupBySelectState {
    value: number;
}

interface InjectedProps {
    docTypes: DocType[];
}


interface GroupBySelectStateProps extends InjectedProps {
    value?: number;
    fieldData: AhoraFormField;
    onChange: (value: number) => void;
}


class AhoraDocTypeField extends React.Component<GroupBySelectStateProps, GroupBySelectState> {
    constructor(props: GroupBySelectStateProps) {
        super(props);

        this.state = {
            value: this.props.value || 0
        };
    }

    onCheckChange(value: number) {
        this.setState({ value });
        this.props.onChange(value);
    }

    render() {
        return (
            <Select value={this.props.value} onChange={this.onCheckChange.bind(this)}>
                {this.props.docTypes.map((docType) => {
                    return (<Select.Option key={docType.id} value={docType.id!}>{docType.name}</Select.Option>);
                })}
            </Select>)
    }
}

const mapStateToProps = (state: ApplicationState): InjectedProps => {
    return {
        docTypes: state.docTypes.docTypes
    };
};

export default connect(mapStateToProps, null)(AhoraDocTypeField as any);