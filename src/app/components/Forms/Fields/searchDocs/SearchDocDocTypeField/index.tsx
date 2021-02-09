import { Select } from "antd";
import DocTypeText from "app/components/localization/DocTypeText";
import { DocType } from "app/services/docTypes";
import { ApplicationState } from "app/store";
import React from "react";
import { connect } from "react-redux";
import MultipleValuesField from "../../MultipleValuesField/Index";

interface Injectable {
    docTypes: DocType[];

}

interface Props extends Injectable {
    value?: string[];
    onChange: (value: string[]) => void;
}

function SearchDocStatusField(props: Props) {

    const getValues = () => {
        return <>
            {props.docTypes.filter(docType => !docType.hideFromSelection).map((docType) => <Select.Option key={docType.id} value={docType.name}>
                <DocTypeText docTypeId={docType.id!}></DocTypeText>
            </Select.Option>)}
        </>
    }

    return <MultipleValuesField getValues={getValues} value={props.value} onChange={props.onChange} />
}

const mapStateToProps = (state: ApplicationState): Injectable => {
    return {
        docTypes: state.docTypes.docTypes
    }
}

export default connect(mapStateToProps)(SearchDocStatusField as any);