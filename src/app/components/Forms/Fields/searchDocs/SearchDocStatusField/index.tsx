import { Select } from "antd";
import DocStatusText from "app/components/localization/DocStatusText";
import { Status } from "app/services/statuses";
import { ApplicationState } from "app/store";
import React from "react";
import { connect } from "react-redux";
import MultipleValuesField from "../../MultipleValuesField/Index";

interface Injectable {
    statuses: Status[];

}

interface Props extends Injectable {
    value?: string[];
    onChange: (value: string[]) => void;
}

function SearchDocStatusField(props: Props) {

    const getValues = () => {
        return <>
            {props.statuses.filter((status) => !status.hideFromSelection).map((status) => <Select.Option key={status.id} value={status.name}>
                <DocStatusText statusId={status.id!}></DocStatusText>
            </Select.Option>)}
        </>
    }

    return <MultipleValuesField getValues={getValues} value={props.value} onChange={props.onChange} />
}

const mapStateToProps = (state: ApplicationState): Injectable => {
    return {
        statuses: state.statuses.statuses
    }
}

export default connect(mapStateToProps)(SearchDocStatusField as any);