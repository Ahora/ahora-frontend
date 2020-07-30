import * as React from 'react';
import { AhoraFormField } from '../../AhoraForm/data';
import { RestCollectorClient } from 'rest-collector';
import { Select } from 'antd';
import AhoraSpinner from '../../Basics/Spinner';

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


    constructor(props: GroupBySelectStateProps) {
        super(props);

        this.state = {
            repositories: [],
            isLoading: false,
            value: this.props.value || ""
        };
    }

    onChange(repo: any) {
        this.props.onUpdate(repo.value);
    }

    componentDidUpdate(prevProps: GroupBySelectStateProps, prevState: GroupBySelectState) {
        if (prevProps.value && this.props.value !== prevProps.value) {
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
                <Select
                    showSearch={true}
                    labelInValue
                    placeholder="Select repo"
                    notFoundContent={this.state.isLoading ? <AhoraSpinner /> : null}
                    filterOption={false}
                    onSearch={this._handleSearch}
                    onSelect={this.onChange.bind(this)}>
                    {this.state.repositories.map(repo => (
                        <Select.Option key={repo.name} value={repo.name}>{repo.name}</Select.Option>
                    ))}
                </Select>
            </div>
        );
    }
}