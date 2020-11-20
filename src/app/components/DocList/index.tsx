import * as React from 'react';
import { Doc } from 'app/services/docs';
import { SearchCriterias } from 'app/components/SearchDocsInput';
import AhoraSpinner from '../Forms/Basics/Spinner';
import DocListItem from './DocListItem';
import { List, Pagination } from 'antd';

interface DocListProps {
    searchCriteria?: SearchCriterias;
    pageSize?: number;
    activeDocId?: number;
    docs?: Doc[],
    page: number;
    totalPages: number;
    section?: string;
    onPageChanged: (newPage: number) => void;
}

class DocList extends React.Component<DocListProps> {
    constructor(props: DocListProps) {
        super(props);
    }

    onChange(newPage: number) {
        this.props.onPageChanged(newPage);
    }

    render() {
        return (
            <div>
                {this.props.docs ?
                    <>
                        {this.props.docs.length > 0 ?
                            <List
                                className="doc-list"
                                itemLayout="horizontal"
                                dataSource={this.props.docs}
                                renderItem={doc => <DocListItem section={this.props.section} isActive={doc.id === this.props.activeDocId} doc={doc}></DocListItem>}></List>
                            :
                            <> {this.props.children}</>}
                    </> :
                    (
                        <AhoraSpinner />
                    )
                }
                {this.props.totalPages > 1 &&
                    <Pagination onChange={this.onChange.bind(this)} defaultCurrent={this.props.page} total={this.props.totalPages} />
                }
            </div>
        );
    };
}

export default DocList; 