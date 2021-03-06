import * as React from 'react';
import { Doc } from 'app/services/docs';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { Status } from 'app/services/statuses';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { DocType } from 'app/services/docTypes';
import LabelsList from 'app/components/Labels/LabelList';
import { Organization } from 'app/services/organizations';
import { List, Typography, Tag, Space } from 'antd';

import './style.scss';
import UsersAvatarList from '../users/UsersAvatarList';
import AhoraSpinner from '../Forms/Basics/Spinner';
import AhoraDate from '../Basics/AhoraTime';
import DocStatusTag from '../Doc/DocStatusTag';
import DocTypeTag from '../Doc/DocTypeTag';
import IsPrivateTag from '../localization/IsPrivateTag';
import DocStar from '../Doc/DocStar';

interface injectedParams {
    statuses: Map<number, Status>;
    docTypes: Map<number, DocType>;
    unReadComments?: number;
    currentOrganization: Organization | undefined,
    doc?: Doc;

}

interface DocListItemProps extends injectedParams {
    docId: number;
    section?: string;
    isActive: boolean;
}

interface AllProps extends RouteComponentProps, DocListItemProps {

}
class DocListItem extends React.Component<AllProps> {
    constructor(props: AllProps) {
        super(props);
    }

    onClick() {
        if (this.props.doc) {
            this.props.history.push(`/organizations/${this.props.currentOrganization!.login}/${this.props.section || "docs"}/${this.props.doc.id}`);
        }
    }

    render() {
        const doc = this.props.doc;
        if (doc) {
            const isViewed: boolean = this.props.unReadComments || (doc.lastView && new Date(doc.lastView.updatedAt) > new Date(doc.updatedAt)) ? true : false;
            return (
                <List.Item onClick={this.onClick.bind(this)} className={`${this.props.isActive ? "active" : ""} doc-list-item`}>
                    <div className="item-wrapper">
                        <div className="extra">
                            <div>
                                <Space>
                                    <AhoraDate date={doc.updatedAt || doc.createdAt}></AhoraDate>
                                    <DocStar docId={doc.id} />
                                </Space>
                            </div>
                            <Space className="tags" direction="vertical">
                                <div>
                                    <DocTypeTag docTypeId={doc.docTypeId}></DocTypeTag>
                                    <DocStatusTag statusId={doc.statusId}></DocStatusTag>
                                </div>
                                <div>
                                    {this.props.unReadComments! > 0 && <Tag color="#f50">{this.props.unReadComments}</Tag>}
                                    <IsPrivateTag isPrivate={doc.isPrivate} />
                                </div>
                            </Space>
                        </div>
                        <div>
                            <div className="title">
                                <Typography.Text strong={!isViewed}>
                                    <Link to={`/ organizations / ${this.props.currentOrganization!.login} / ${this.props.section || "docs"} / ${doc.id}`}>{doc.subject}</Link>
                                </Typography.Text>
                            </div>
                            <Space direction="vertical">
                                <div><LabelsList defaultSelected={doc.labels}></LabelsList></div>
                                <div><UsersAvatarList maxCount={5} userIds={doc.watchers}></UsersAvatarList></div>
                            </Space>
                        </div>
                    </div>
                </List.Item >
            );
        }
        else {
            return <AhoraSpinner />
        }
    }
}

const mapStateToProps = (state: ApplicationState, ownProps: DocListItemProps): injectedParams => {

    const docCommentFromStore = state.comments.docs.get(ownProps.docId);
    const docFromSource = state.docs.docs.get(ownProps.docId);
    return {
        doc: docFromSource,
        currentOrganization: state.organizations.currentOrganization,
        statuses: state.statuses.map,
        docTypes: state.docTypes.mapById,
        unReadComments: docCommentFromStore?.unReadCommentsCount
    };
};


export default withRouter(connect(mapStateToProps, null)(DocListItem as any)) as any; 