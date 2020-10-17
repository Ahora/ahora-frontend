import * as React from 'react';
import { Doc, getDocs, SearchDocResult } from 'app/services/docs';
import { SearchCriterias } from 'app/components/SearchDocsInput';
import AhoraSpinner from '../Forms/Basics/Spinner';
import DocListItem from './DocListItem';
import { List, Pagination } from 'antd';

interface DocsPageState {
    docs: Doc[] | null;
    page: number;
    totalPages: number;
}

interface DocListProps {
    searchCriteria?: SearchCriterias;
    pageSize?: number;
    activeDocId?: number;
    docs?: Doc[],
    section?: string;
    onDocListUpdated?: (docs: Doc[]) => void;
}

class DocList extends React.Component<DocListProps, DocsPageState> {
    constructor(props: DocListProps) {
        super(props);
        this.state = {
            docs: null,
            page: 1,
            totalPages: 0
        }
    }

    async loadData(searchCriteria: SearchCriterias, page: number, pageSize: number) {
        this.setState({
            docs: null,
            totalPages: 0
        });

        page = page || this.state.page;
        const searchResult: SearchDocResult = await getDocs(searchCriteria, pageSize * (page - 1), pageSize);

        if (this.props.onDocListUpdated) {
            this.props.onDocListUpdated(searchResult.docs);
        }
        this.setState({
            docs: searchResult.docs,
            totalPages: Math.ceil(searchResult.totalCount / pageSize)
        });
    }

    componentDidUpdate(prevProps: DocListProps) {
        if (prevProps.searchCriteria !== this.props.searchCriteria ||
            prevProps.pageSize !== this.props.pageSize) {
            this.setState({
                docs: null,
                totalPages: 0
            });
            if (this.props.searchCriteria) {
                this.loadData(this.props.searchCriteria, 1, this.props.pageSize || 30);
            }
        }

        if (this.props.docs && this.props.docs != this.state.docs) {
            this.setState({ docs: this.props.docs });
        }
    }

    async componentDidMount() {
        if (this.props.searchCriteria) {
            this.loadData(this.props.searchCriteria, 1, this.props.pageSize || 30);
        }
        else {
            this.setState({
                docs: []
            });
        }
    }

    onChange(newPage: number) {
        this.setState({
            page: newPage
        });

        if (this.props.searchCriteria) {
            this.loadData(this.props.searchCriteria, newPage, this.props.pageSize || 30);
        }
    }

    render() {
        return (
            <div>
                {this.state.docs ?
                    <>
                        {this.state.docs.length > 0 ?
                            <List
                                className="doc-list"
                                itemLayout="horizontal"
                                dataSource={this.state.docs}
                                renderItem={doc => <DocListItem section={this.props.section} isActive={doc.id === this.props.activeDocId} doc={doc}></DocListItem>}></List>
                            :
                            <> {this.props.children}</>}
                    </> :
                    (
                        <AhoraSpinner />
                    )
                }
                {this.state.totalPages > 1 &&
                    <Pagination onChange={this.onChange.bind(this)} defaultCurrent={this.state.page} total={this.state.totalPages} />
                }
            </div>
        );
    };
}

export default DocList; 