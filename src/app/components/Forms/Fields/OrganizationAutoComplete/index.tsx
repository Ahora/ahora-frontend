import * as React from 'react';
import { AhoraFormField } from '../../AhoraForm/data';
import { Select } from 'antd';
import AhoraSpinner from '../../Basics/Spinner';
import { debounce } from 'lodash';
import { searchGithubUsers } from 'app/services/github';

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
        if (query && query.length > 1) {
            this.setState({
                isLoading: true,
                organizations: []
            });

            const items = await searchGithubUsers(query);

            this.resultMap.clear();
            items.map((item: any) => {
                this.resultMap.set(item.login, item);
            })

            this.setState({
                organizations: items,
                isLoading: false,
            });
        }

    }

    render() {
        return (
            <Select
                showSearch={true}
                labelInValue
                loading={this.state.isLoading}
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