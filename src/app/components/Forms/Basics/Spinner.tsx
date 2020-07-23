import * as React from "react";
import { Spin } from 'antd';

interface Props {
    inline?: boolean;
}

const AhoraSpinner = (props: Props) => (
    <div className={`${props.inline && 'd-inline'} text-center`}>
        <Spin />
    </div>
);


export default AhoraSpinner;