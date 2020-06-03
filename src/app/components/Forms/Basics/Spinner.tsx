import * as React from "react";
import Spinner from "react-bootstrap/Spinner";

interface Props {
    inline?: boolean;
}

const AhoraSpinner = (props: Props) => (
    <div className={`${props.inline && 'd-inline'} text-center`}>
        <Spinner animation="border" variant="primary" />
    </div>
);


export default AhoraSpinner;