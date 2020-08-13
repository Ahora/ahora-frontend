import * as React from 'react';
import { AhoraFormField } from '../../AhoraForm/data';
import { RestCollectorClient } from 'rest-collector';
import { Select } from 'antd';
import AhoraSpinner from '../../Basics/Spinner';
import { debounce } from 'lodash';

export interface OrgValue {
    login: string;
    isOrg: boolean;
}

interface GroupBySelectState {
    value: string;
    organizations: any[],
    isLoading: boolean
}

interface GroupBySelectStateProps {
    value?: string;
    fieldData: AhoraFormField;
    formData: any;
    onChange: (value: OrgValue) => void;
}

const githubRepoClient: RestCollectorClient = new RestCollectorClient("https://api.github.com/search/users");

export default class AhoraOrganizationAutoCompleteField extends React.Component<GroupBySelectStateProps, GroupBySelectState> {

    private resultMap: Map<string, any>;
    constructor(props: GroupBySelectStateProps) {
        super(props);

        this.resultMap = new Map();
        this.state = {
            organizations: [],
            isLoading: false,
            value: this.props.value || ""
        };

        this._handleSearch = debounce(this._handleSearch, 800);

    }

    onChange(orName: any) {
        const org = this.resultMap.get(orName.value);
        console.log(orName);
        this.props.onChange({
            login: org.login,
            isOrg: (org.type === "Organization")
        });
    }

    _handleSearch = async (query: string) => {
        this.setState({
            isLoading: true,
        });

        const repositoriesResult = await githubRepoClient.get({
            query: { q: `${query} in:login` }
        });

        this.resultMap.clear();
        repositoriesResult.data.items.map((item: any) => {
            this.resultMap.set(item.login, item);
        })

        this.setState({
            organizations: repositoriesResult.data.items,
            isLoading: false,
        });
    }

    render() {
        return (
            <Select
                showSearch={true}
                labelInValue
                notFoundContent={this.state.isLoading ? <AhoraSpinner /> : null}
                filterOption={false}
                onSearch={this._handleSearch}
                onSelect={this.onChange.bind(this)}>
                {this.state.organizations.map(org => (
                    <Select.Option key={org.login} value={org.login}>{org.login}</Select.Option>
                ))}
            </Select>
        );
    }
}