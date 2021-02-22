import React from "react";
import { PropsWithChildren } from "react";
import { useHotkeys } from "react-hotkeys-hook";



interface Props {
    shortcut: string;
}


interface ComponentProps extends PropsWithChildren<Props> {
    shortcut: string;
}

export default function AhoraHotKey(props: ComponentProps) {
    const divRef = React.useRef<HTMLSpanElement>(null);

    function handleClick(keyboardEvent: KeyboardEvent) {
        keyboardEvent.stopPropagation();
        keyboardEvent.preventDefault();
        (divRef.current?.childNodes[0] as any).click();
    }

    useHotkeys(props.shortcut, handleClick);
    return <span ref={divRef}>{props.children} </span>
}