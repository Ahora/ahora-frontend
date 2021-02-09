import * as React from 'react';
import { SearchCriterias } from 'app/components/SearchDocsInput';
import SimpleDocsInput from 'app/components/SearchDocsInput/SimpleDocsInput';

interface GroupBySelectState {
    value?: SearchCriterias;
}

interface GroupBySelectStateProps {
    value?: SearchCriterias;
    onChange: (value?: SearchCriterias) => void;
}


class AhoraSearchCriteriasField extends React.Component<GroupBySelectStateProps, GroupBySelectState> {
    constructor(props: GroupBySelectStateProps) {
        super(props);

        this.state = {
            value: this.props.value
        };
    }


    onSearchSelected(searchCriterias?: SearchCriterias) {
        this.setState({ value: searchCriterias });
        this.props.onChange(searchCriterias);
    }

    render() {
        return (
            <SimpleDocsInput searchCriterias={this.state.value} searchSelected={this.onSearchSelected.bind(this)} ></SimpleDocsInput>
        );
    }
}

export default AhoraSearchCriteriasField;