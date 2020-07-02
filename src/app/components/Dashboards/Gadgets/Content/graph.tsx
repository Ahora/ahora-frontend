import * as React from 'react';
import AhoraContentData from './data';


interface AllProps {
    data: AhoraContentData;
}

export default class AhoraContentGadget extends React.Component<AllProps> {
    constructor(props: AllProps) {
        super(props);
    }

    render() {
        return (
            <div dangerouslySetInnerHTML={{ __html: this.props.data.content }}></div>
        );
    }
}
