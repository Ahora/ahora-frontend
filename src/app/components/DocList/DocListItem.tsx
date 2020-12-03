import * as React from 'react';
import { Doc } from 'app/services/docs';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { Status } from 'app/services/statuses';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import { DocType } from 'app/services/docTypes';
import LabelsList from 'app/components/Labels/LabelList';
import { Organization } from 'app/services/organizations';
import { List, Typography, Tag, Badge } from 'antd';

import './style.scss';
import UsersAvatarList from '../users/UsersAvatarList';

interface injectedParams {
    statuses: Map<number, Status>;
    docTypes: Map<number, DocType>;
    unReadComments?: number;
    currentOrganization: Organization | undefined,
}

interface DocsPageProps extends injectedParams {
    doc: Doc;
    section?: string;
    isActive: boolean;
}

interface AllProps extends DocsPageProps {

}
class DocListItem extends React.Component<AllProps> {
    constructor(props: AllProps) {
        super(props);
    }

    render() {
        const doc = this.props.doc;
        const currentStatus: Status | undefined = this.props.statuses.get(doc.statusId);
        const currentDocType: DocType | undefined = this.props.docTypes.get(doc.docTypeId);
        const isViewed: boolean = this.props.unReadComments || (doc.lastView && new Date(doc.lastView.updatedAt) > new Date(doc.updatedAt)) ? true : false;
        return (
            <List.Item className={`${this.props.isActive ? "active" : ""} doc-list-item`}>
                <div className="item-wrapper">
                    <div className="extra">
                        <Moment titleFormat="YYYY-MM-DD HH:mm" format="YYYY-MM-DD HH:mm" withTitle date={doc.updatedAt || doc.createdAt}></Moment>
                        <div className="tags">
                            <Tag>{(currentDocType) ? currentDocType.name : ""}</Tag>
                            <Tag>{(currentStatus) ? currentStatus.name : ""}</Tag>
                        </div>
                        <div>
                            <Badge count={this.props.unReadComments} ></Badge>
                        </div>
                    </div>
                    <div>
                        <div className="title">
                            <Typography.Text strong={!isViewed}>
                                <Link to={`/organizations/${this.props.currentOrganization!.login}/${this.props.section || "docs"}/${doc.id}`}>{doc.subject}</Link>
                            </Typography.Text>
                        </div>
                        <div><LabelsList defaultSelected={doc.labels}></LabelsList></div>
                        <div><UsersAvatarList maxCount={5} userIds={doc.watchers}></UsersAvatarList></div>
                    </div>
                </div>
            </List.Item >
        );
    };
}

const mapStateToProps = (state: ApplicationState, ownProps: DocsPageProps): injectedParams => {

    const docFromStore = state.comments.docs.get(ownProps.doc.id);
    return {
        currentOrganization: state.organizations.currentOrganization,
        statuses: state.statuses.map,
        docTypes: state.docTypes.mapById,
        unReadComments: docFromStore?.moreComments?.length
    };
};


export default connect(mapStateToProps, null)(DocListItem as any); 