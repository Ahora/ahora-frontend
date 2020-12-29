import React from "react";
import Moment from "react-moment";

export default function AhoraDate(props: any) {
    return <Moment titleFormat="YYYY-MM-DD HH:mm" ago={true} fromNow withTitle date={props.date}></Moment>
}