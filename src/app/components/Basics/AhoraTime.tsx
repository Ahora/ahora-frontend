import React from "react";
import Moment from "react-moment";

export default function AhoraDate(props: any) {
    return <Moment local={true} ago={true} fromNow withTitle date={props.date}></Moment>
}