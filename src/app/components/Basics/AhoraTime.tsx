import React from "react";
import { useIntl } from "react-intl";
import Moment from "react-moment";

export default function AhoraDate(props: any) {
    const intl = useIntl();
    return <Moment locale={intl.locale} local={true} ago={true} fromNow withTitle date={props.date}></Moment>
}