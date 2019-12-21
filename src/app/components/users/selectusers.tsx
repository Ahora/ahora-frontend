import { AsyncTypeahead } from "react-bootstrap-typeahead";
import * as React from "react";
import GithubMenuItem from "./GithubMenuItem";
import { makeAndHandleRequest } from "app/services/users";

export interface UserItem {
    login: string;
}

interface SelectUserProps {
    onSelect(user: UserItem): void;
}
interface State {
    isLoading: boolean,
    options: UserItem[],
    query: string;
}

export default class SelectUser extends React.Component<SelectUserProps, State> {

    private _cache: any;
    constructor(props: SelectUserProps) {
        super(props);
        this._cache = {};
        this.state = {
            isLoading: false,
            options: [],
            query: '',
        };
    }

    onChange(users: UserItem[]) {
        this.props.onSelect(users[0]);
    }

    render() {
        return (
            <AsyncTypeahead
                labelKey="login"
                {...this.state}
                maxResults={50 - 1}
                minLength={2}
                onChange={(users) => { this.onChange(users) }}
                onInputChange={this._handleInputChange}
                onPaginate={this._handlePagination}
                onSearch={this._handleSearch}
                paginate
                placeholder="Search for a Github user..."
                renderMenuItemChildren={(option: any, props) => {
                    return <GithubMenuItem key={option.id} user={option} />;
                }
                }
                useCache={false}
            />
        );
    }

    _handleInputChange = (query: string) => {
        this.setState({ query });
    }

    _handlePagination = (e: any, shownResults: any) => {
        const { query } = this.state;
        const cachedQuery = this._cache[query];

        // Don't make another request if:
        // - the cached results exceed the shown results
        // - we've already fetched all possible results
        if (
            cachedQuery.options.length > shownResults ||
            cachedQuery.options.length === cachedQuery.total_count
        ) {
            return;
        }

        this.setState({ isLoading: true });

        const page = cachedQuery.page + 1;

        makeAndHandleRequest(query, page)
            .then((resp: any) => {
                const options = cachedQuery.options.concat(resp.options);
                this._cache[query] = { ...cachedQuery, options, page };
                this.setState({
                    isLoading: false,
                    options,
                });
            });
    }

    _handleSearch = (query: string) => {
        if (this._cache[query]) {
            this.setState({ options: this._cache[query].options });
            return;
        }

        this.setState({ isLoading: true });
        makeAndHandleRequest(query)
            .then((resp: any) => {
                this._cache[query] = { ...resp, page: 1 };
                this.setState({
                    isLoading: false,
                    options: resp.options,
                });
            });
    }
}