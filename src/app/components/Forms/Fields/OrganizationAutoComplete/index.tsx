import * as React from 'react';
import { AhoraFormField } from '../../AhoraForm/data';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { RestCollectorClient } from 'rest-collector';

interface GroupBySelectState {
    value: string;
    organizations: any[],
    isLoading: boolean
}

interface GroupBySelectStateProps {
    value?: string;
    fieldData: AhoraFormField;
    formData: any;
    onUpdate: (value: string) => void;
}

const githubRepoClient: RestCollectorClient = new RestCollectorClient("https://api.github.com/search/users");

export default class AhoraOrganizationAutoCompleteField extends React.Component<GroupBySelectStateProps, GroupBySelectState> {
    constructor(props: GroupBySelectStateProps) {
        super(props);

        this.state = {
            organizations: [],
            isLoading: false,
            value: this.props.value || ""
        };
    }

    onChange(orgs: any[]) {
        if (orgs.length > 0) {
            this.props.onUpdate(orgs[0].login);
        }
    }

    _handleSearch = async (query: string) => {
        this.setState({
            isLoading: true,
        });

        const repositoriesResult = await githubRepoClient.get({
            query: { q: `type:org ${query} in:login` }
        })

        this.setState({
            organizations: repositoriesResult.data.items,
            isLoading: false,
        });
    }

    render() {
        return (
            <div style={{ width: "100%" }}>
                <AsyncTypeahead
                    defaultInputValue={this.props.value}
                    labelKey="login"
                    options={this.state.organizations}
                    isLoading={this.state.isLoading}
                    onChange={(users) => { this.onChange(users) }}
                    onSearch={this._handleSearch.bind(this)}
                ></AsyncTypeahead>
            </div>
        );
    }
}