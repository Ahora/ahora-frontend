import * as React from 'react';
import { Doc, updateDoc, assignDoc, updateDocSubject, updateDocDescription, updateDocLabels, deleteDoc, updateDocStatus } from 'app/services/docs';
import { RouteComponentProps } from 'react-router';
import CommentListComponent from 'app/components/Comments/List';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { Status } from 'app/services/statuses';
import SelectUser from 'app/components/users/selectusers';
import { UserItem, User } from 'app/services/users';
import { DocType } from 'app/services/docTypes';
import { Comment } from 'app/services/comments';
import Moment from 'react-moment';
import EditableHeader from 'app/components/EditableHeader';
import EditableMarkDown from 'app/components/EditableMarkDown';
import { canEditDoc } from 'app/services/authentication';
import DocStatusViewEdit from 'app/components/Doc/DocStatusViewEdit';
import LabelsList from 'app/components/Labels/LabelList';
import { OrganizationMilestone } from 'app/services/OrganizationMilestones';
import DocMilestoneViewEdit from 'app/components/Doc/DocMilestoneViewEdit';
import AhoraSpinner from 'app/components/Forms/Basics/Spinner';
import { Comment as CommentAnt, Descriptions, Space, Popconfirm } from 'antd';
import { Dispatch } from 'redux';
import UserDetails from 'app/components/users/UserDetails';
import UserAvatar from 'app/components/users/UserAvatar';
import UserAvatarList from 'app/components/users/UsersAvatarList';
import { reportDocRead } from 'app/store/shortcuts/actions';
import AddCommentComponent from 'app/components/Comments/AddComment';
import { addComment } from 'app/services/comments';
import { AddCommentInState, deleteCommentInState } from 'app/store/comments/actions';

interface DocsDetailsPageState {
    focusCommentId?: number;
}

interface DocsDetailsPageParams {
    login: string;
    docId: string;
}

interface injectedParams {
    statuses: Status[],
    docTypes: Map<number, DocType>,
    statusesMap: Map<number, Status>,
    milestonesMap: Map<number, OrganizationMilestone>,
    loading: boolean;
    currentUser: User | undefined | null;
    doc?: Doc;
}

interface DispatchProps {
    reduceUnreadCount(docId: number): void;
    deleteComment: (commentId: number) => void;
    addComment: (comment: Comment) => void;
}

interface AllProps extends RouteComponentProps<DocsDetailsPageParams>, injectedParams, DispatchProps {
    onDocUpdated: (doc: Doc) => void;
    onDocDeleted: (doc: Doc) => void;
}

class DocsDetailsPage extends React.Component<AllProps, DocsDetailsPageState> {
    constructor(props: AllProps) {
        super(props);
        this.state = {}
    }

    async changeStatus(statusId: number) {
        if (this.props.doc && statusId !== this.props.doc.statusId) {
            const updatedDoc = { ...this.props.doc, statusId };
            await updateDocStatus(this.props.match.params.login, this.props.doc.id, statusId);
            this.updateDoc(updatedDoc);

        }
    }

    updateDoc(doc: Doc) {
        this.props.onDocUpdated(doc);
        this.props.reduceUnreadCount(doc.id);
    }

    async changeMilestone(milestoneId?: number) {
        if (this.props.doc && milestoneId !== this.props.doc!.milestoneId) {
            const doc = { ...this.props.doc, milestoneId };
            const updatedDoc = await updateDoc(this.props.match.params.login, doc.id, doc);
            this.updateDoc(updatedDoc);

        }
    }

    async commentAdded(comment: Comment) {
        this.props.addComment(comment);
        this.setState({ focusCommentId: comment.id })

        const newComment: Comment = await addComment(this.props.match.params.login, comment.docId, comment.comment, comment.parentId);
        this.setState({ focusCommentId: newComment.id });
        this.props.deleteComment(comment.id);
        this.props.addComment(newComment);
    }

    async componentDidUpdate(PrevProps: AllProps) {
        const prevDocId: number | undefined = PrevProps.doc ? PrevProps.doc.id : undefined;
        if (this.props.doc && this.props.doc.id !== prevDocId) {

            this.updateDoc({
                ...this.props.doc,
                lastView: { updatedAt: new Date() }
            })
        }
    }

    async componentDidMount() {
        //TODO: Ask for doc from saga if it's not available. 
    }

    async onLabelsUpdate(labels: number[]): Promise<void> {
        const updatedDoc = { ...this.props.doc!, labels };
        this.updateDoc(updatedDoc);
        await updateDocLabels(this.props.match.params.login, parseInt(this.props.match.params.docId), labels);
    }

    async onAssigneeSelect(user: UserItem) {
        const addedUserItem: UserItem = await assignDoc(this.props.match.params.login, parseInt(this.props.match.params.docId), user.username);
        const updatedDoc = { ...this.props.doc!, assignee: addedUserItem };
        this.updateDoc(updatedDoc);
    }

    async onSubjectChanged(value: string) {
        const updatedDoc = { ...this.props.doc!, subject: value };
        await updateDocSubject(this.props.match.params.login, this.props.doc!.id, value);
        this.updateDoc(updatedDoc);
    }

    async delete() {
        if (this.props.doc) {
            if (this.props.onDocDeleted) {
                this.props.onDocDeleted(this.props.doc);
            }
            await deleteDoc(this.props.match.params.login, this.props.doc.id!);
        }
    }

    async onDescriptionChanged(value: string) {
        const newDoc = await updateDocDescription(this.props.match.params.login, this.props.doc!.id, value);
        this.updateDoc({ ...this.props.doc, ...newDoc });
    }

    render() {
        const doc: Doc | undefined = this.props.doc;
        let canEdit: boolean = false;
        let docType: DocType | undefined;
        let currentStatus: Status | undefined;
        let currentMilestone: OrganizationMilestone | undefined;
        if (doc) {
            canEdit = canEditDoc(this.props.currentUser, doc);
            docType = this.props.docTypes.get(doc.docTypeId);

            if (doc.statusId) {
                currentStatus = this.props.statusesMap.get(doc.statusId);
            }

            if (doc.milestoneId) {
                currentMilestone = this.props.milestonesMap.get(doc.milestoneId);
            }

        }
        return (
            <>
                {doc ?
                    <div className="content-wrapper">
                        <div className="content">
                            <div className="main-content">
                                <div className="scrollable">
                                    <div className="doc-details">
                                        <Space className="extra">
                                            <DocStatusViewEdit canEdit={canEdit} status={currentStatus} onUpdate={this.changeStatus.bind(this)}></DocStatusViewEdit>
                                            <DocMilestoneViewEdit canEdit={canEdit} milestone={currentMilestone} onUpdate={this.changeMilestone.bind(this)}></DocMilestoneViewEdit>
                                        </Space>
                                        <EditableHeader canEdit={canEdit} onChanged={this.onSubjectChanged.bind(this)} value={doc.subject}>
                                            <h1>{doc.subject}</h1>
                                        </EditableHeader>
                                        <LabelsList onChange={this.onLabelsUpdate.bind(this)} canEdit={canEdit} defaultSelected={doc.labels}></LabelsList>
                                        <UserAvatarList userIds={doc.watchers} />
                                        <Descriptions>
                                            <Descriptions.Item label="Assignee">
                                                <SelectUser editMode={false} defaultSelected={doc.assigneeUserId} onSelect={this.onAssigneeSelect.bind(this)}></SelectUser>
                                            </Descriptions.Item>
                                            {docType && <Descriptions.Item label="Type"><>{docType.name}</></Descriptions.Item>}
                                            {doc.closedAt && <Descriptions.Item label="Closed At"><Moment titleFormat="YYYY-MM-DD HH:mm" withTitle format="YYYY-MM-DD HH:mm" date={doc.closedAt}></Moment></Descriptions.Item>}
                                            {doc.lastView && <Descriptions.Item label="Last viewd by me">
                                                <Moment titleFormat="YYYY-MM-DD HH:mm" withTitle format="YYYY-MM-DD HH:mm" date={doc.lastView.updatedAt}></Moment>
                                            </Descriptions.Item>
                                            }
                                            {doc.source &&
                                                <>
                                                    <Descriptions.Item label="Github Issue Id">
                                                        <a target="_blank" href={doc.source.url}>{doc.sourceId}</a>
                                                    </Descriptions.Item>
                                                    <Descriptions.Item label="Repo">{doc.source.repo}</Descriptions.Item>
                                                    <Descriptions.Item label="Organization">{doc.source.organization}</Descriptions.Item>
                                                </>
                                            }
                                            <Descriptions.Item label="Views">{doc.views}</Descriptions.Item>
                                        </Descriptions>
                                        <EditableMarkDown canEdit={canEdit} onChanged={this.onDescriptionChanged.bind(this)} value={doc.description}>
                                            <CommentAnt className="description"
                                                datetime={
                                                    <Moment titleFormat="YYYY-MM-DD HH:mm" withTitle format="YYYY-MM-DD HH:mm" date={doc.createdAt}></Moment>
                                                }
                                                actions={
                                                    canEdit ? [
                                                        <Popconfirm onConfirm={this.delete.bind(this)} title="Are you sure?">
                                                            <span>Delete discussion</span>
                                                        </Popconfirm>
                                                    ] : undefined
                                                }
                                                avatar={
                                                    <UserAvatar userId={doc.reporterUserId}></UserAvatar>
                                                }
                                                author={
                                                    <UserDetails userId={doc.reporterUserId}></UserDetails>
                                                }
                                                content={
                                                    <p className="markdown-body" dangerouslySetInnerHTML={{ __html: doc.htmlDescription }}></p>
                                                }>

                                            </CommentAnt>
                                        </EditableMarkDown>
                                        <CommentListComponent focusId={this.state.focusCommentId} doc={doc} login={this.props.match.params.login}></CommentListComponent>
                                    </div>
                                </div>
                                <AddCommentComponent commentAdded={this.commentAdded.bind(this)} login={this.props.match.params.login} docId={doc.id}></AddCommentComponent>
                            </div>
                        </div>

                    </div>
                    : <AhoraSpinner />
                }
            </>
        );
    };
}

const mapStateToProps = (state: ApplicationState, ownProps: AllProps): injectedParams => {
    return {
        docTypes: state.docTypes.mapById,
        statuses: state.statuses.statuses,
        milestonesMap: state.milestones.map,
        statusesMap: state.statuses.map,
        loading: state.statuses.loading,
        currentUser: state.currentUser.user,
        doc: state.docs.docs.get(parseInt(ownProps.match.params.docId))
    };
};

const mapDispatchToProps = (dispatch: Dispatch, ownProps: AllProps): DispatchProps => {
    return {
        reduceUnreadCount: (docId: number) => dispatch(reportDocRead(docId)),
        deleteComment: (commentId: number) => dispatch(deleteCommentInState(ownProps.doc!.id, commentId)),
        addComment: (comment: Comment) => dispatch(AddCommentInState(comment)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocsDetailsPage as any); 