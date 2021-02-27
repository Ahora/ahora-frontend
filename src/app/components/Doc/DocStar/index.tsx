import { StarFilled, StarOutlined } from "@ant-design/icons";
import { Space } from "antd";
import { updateDocStar } from "app/services/docs";
import { ApplicationState } from "app/store";
import { setDocStarInState } from "app/store/docs/actions";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import React from "react";

interface OwnProps {
    docId: number;
}

interface DispatchProps {
    setStar: (star: boolean) => void;
}

interface InjectableProps {
    isStar: boolean;
}

interface AllProps extends OwnProps, InjectableProps, DispatchProps {

}

function DocStar(props: AllProps) {
    async function click() {
        const newStarVal = !props.isStar;
        props.setStar(newStarVal);
        try {
            await updateDocStar(props.docId, newStarVal);

        } catch (error) {
            props.setStar(!newStarVal);
        }
    }

    return <Space direction="horizontal">
        {props.isStar ? <StarFilled onClick={click} /> : <StarOutlined onClick={click} />}
    </Space>
}

const mapStateToProps = (state: ApplicationState, ownProps: OwnProps): InjectableProps => {
    const doc = state.docs.docs.get(ownProps.docId)
    return {
        isStar: doc && doc.lastView ? doc.lastView.star : false
    };
};

const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnProps): DispatchProps => {
    return {
        setStar: (star: boolean) => dispatch(setDocStarInState(ownProps.docId, star))
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(DocStar as any); 