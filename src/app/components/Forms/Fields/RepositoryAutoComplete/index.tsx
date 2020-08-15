import * as React from 'react';
import { AhoraFormField } from '../../AhoraForm/data';
import { Select } from 'antd';
import AhoraSpinner from '../../Basics/Spinner';
import { searchGithubRepositories } from 'app/services/github';
import { debounce } from 'lodash';

interface GroupBySelectState {
    value: string;
    repositories: any[],
    isLoading: boolean
}

interface GroupBySelectStateProps {
    value?: string;
    fieldData: AhoraFormField;
    formData: any;
    onChange: (value: string) => void;
}

export default class AhoraRepistoryAutoCompleteField extends React.Component<GroupBySelectStateProps, GroupBySelectState> {


    constructor(props: GroupBySelectStateProps) {
        super(props);

        this.state = {
            repositories: [],
            isLoading: false,
            value: this.props.value || ""
        };

        this._handleSearch = debounce(this._handleSearch, 800);
    }

    onChange(repo: any) {
        this.props.onChange(repo.value);
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
            repositories: []
        });

        const repositories = await searchGithubRepositories(query, this.props.formData.organization.login, this.props.formData.organization.isOrg);

        this.setState({
            repositories,
            isLoading: false,
        });
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