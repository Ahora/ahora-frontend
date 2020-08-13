import * as React from 'react';
import SearchDocsInput, { SearchCriterias } from 'app/components/SearchDocsInput';

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
            <SearchDocsInput required={false} searchCriterias={this.state.value} searchSelected={this.onSearchSelected.bind(this)} ></SearchDocsInput>);
    }
}

export default AhoraSearchCriteriasField;