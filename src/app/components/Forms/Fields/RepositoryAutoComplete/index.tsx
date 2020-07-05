import * as React from 'react';
import { AhoraFormField } from '../../AhoraForm/data';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { RestCollectorClient } from 'rest-collector';

interface GroupBySelectState {
    value: string;
    repositories: any[],
    isLoading: boolean
}

interface GroupBySelectStateProps {
    value?: string;
    fieldData: AhoraFormField;
    formData: any;
    onUpdate: (value: string) => void;
}

const githubRepoClient: RestCollectorClient = new RestCollectorClient("https://api.github.com/search/repositories");

export default class AhoraRepistoryAutoCompleteField extends React.Component<GroupBySelectStateProps, GroupBySelectState> {

    private typeahead: any;

    constructor(props: GroupBySelectStateProps) {
        super(props);

        this.state = {
            repositories: [],
            isLoading: false,
            value: this.props.value || ""
        };
    }

    onChange(repositories: any[]) {
        if (repositories.length > 0) {
            this.props.onUpdate(repositories[0].name);
        }
    }

    componentDidUpdate(prevProps: GroupBySelectStateProps, prevState: GroupBySelectState) {
        if (prevProps.value && this.props.value !== prevProps.value) {
            this.typeahead.getInstance().clear();
            this.setState({
                value: this.props.value || ""
            })
        }
    }

    _handleSearch = async (query: string) => {
        this.setState({
            isLoading: true,
        });
        let repositoriesResult: any;

        if (this.props.formData.organization.isOrg) {
            repositoriesResult = await githubRepoClient.get({
                query: { q: `org:${this.props.formData.organization.login} ${query} in:name fork:true` }
            });

            this.setState({
                repositories: repositoriesResult.data.items,
                isLoading: false
            });
        }
        else {
            repositoriesResult = await githubRepoClient.get({
                url: `https://api.github.com/users/${this.props.formData.organization.login}/repos`
            });

            this.setState({
                repositories: repositoriesResult.data,
                isLoading: false,
            });
        }


    }

    render() {
        return (
            <div style={{ width: "100%" }}>
                <AsyncTypeahead
                    defaultInputValue={this.props.value}
                    ref={typeahead => this.typeahead = typeahead}
                    labelKey="name"
                    options={this.state.repositories}
                    isLoading={this.state.isLoading}
                    onChange={(users) => { this.onChange(users) }}
                    onSearch={this._handleSearch.bind(this)}
                ></AsyncTypeahead>
            </div>
        );
    }
}