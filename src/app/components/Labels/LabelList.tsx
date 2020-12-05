import * as React from 'react';
import { Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import LabelTag from './LabelTag';
import AhoraLabelsField from '../Forms/Fields/AhoraLabelsField';

interface LabelsSelectorState {
    isDropDownOpened: boolean;
}

interface AllProps {
    onChange?(labels: number[]): void;
    defaultSelected?: number[];
    canEdit?: boolean;

}

export default class LabelsList extends React.Component<AllProps, LabelsSelectorState> {
    constructor(props: AllProps) {
        super(props);
        this.state = { isDropDownOpened: false };

    }

    onClose(deletedLabelId: number) {
        if (this.props.defaultSelected) {
            const labels = this.props.defaultSelected?.filter((labelId) => labelId !== deletedLabelId);
            if (this.props.onChange)
                this.props.onChange(labels);
        }
    }

    onChange(labels: number[]) {
        if (this.props.onChange)
            this.props.onChange(labels);
    }

    openDropDown() {
        this.setState({ isDropDownOpened: true });
    }

    render() {
        return (
            <>
                {
                    this.state.isDropDownOpened ?
                        <AhoraLabelsField value={this.props.defaultSelected} onChange={this.onChange.bind(this)} />
                        :
                        <>
                            {this.props.defaultSelected && this.props.defaultSelected.map((labelId: number) => {
                                return <LabelTag onClose={this.onClose.bind(this, labelId)} closable={this.props.canEdit} labelId={labelId} key={labelId}></LabelTag>;
                            })}
                        </>
                }
                {
                    (this.props.canEdit && !this.state.isDropDownOpened) &&
                    <Tag className="site-tag-plus" onClick={this.openDropDown.bind(this)}>
                        <PlusOutlined /> New Label
                                </Tag>
                }


            </>
        );
    }
}