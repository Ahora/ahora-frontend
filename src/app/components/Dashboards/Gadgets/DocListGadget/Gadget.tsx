import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import DocListGadgetData from './data';
import DocList from 'app/components/DocList';

interface AllProps extends RouteComponentProps {
    data: DocListGadgetData;
}

class DocListGadget extends React.Component<AllProps> {
    constructor(props: AllProps) {
        super(props);
    }

    render() {
        return (<DocList pageSize={this.props.data.numberofdocs} searchCriteria={this.props.data.searchCriterias}></DocList>);
    }
}


export default DocListGadget;