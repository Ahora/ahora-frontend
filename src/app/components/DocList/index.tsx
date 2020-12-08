import * as React from 'react';
import { SearchCriterias } from 'app/components/SearchDocsInput';
import AhoraSpinner from '../Forms/Basics/Spinner';
import DocListItem from './DocListItem';
import { Pagination } from 'antd';
import FlipMove from 'react-flip-move';


interface DocListProps {
    searchCriteria?: SearchCriterias;
    pageSize?: number;
    activeDocId?: number;
    docs?: Set<number>,
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
            <div className="doc-list">
                <>
                    {this.props.docs ?
                        <div>
                            {this.props.docs.size > 0 ?
                                <FlipMove>
                                    {[...this.props.docs].reverse().map((docId: number) =>
                                        <div key={docId}>
                                            <DocListItem section={this.props.section} isActive={docId === this.props.activeDocId} docId={docId}></DocListItem>
                                        </div>)
                                    }
                                </FlipMove>
                                :
                                <> {this.props.children}</>}
                        </div> :
                        (
                            <AhoraSpinner />
                        )
                    }
                </>
                {this.props.totalPages > 1 &&
                    <Pagination onChange={this.onChange.bind(this)} defaultCurrent={this.props.page} total={this.props.totalPages} />
                }
            </div>
        );
    };
}

export default DocList; 