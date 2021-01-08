import * as React from 'react';
import { Doc, updateDoc, assignDoc, updateDocSubject, updateDocDescription, updateDocLabels, deleteDoc, updateDocStatus, updateDocIsPrivate, addWatcherToDoc, deleteWatcherFromDoc } from 'app/services/docs';
import { RouteComponentProps } from 'react-router';
import CommentListComponent from 'app/components/Comments/List';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { Status } from 'app/services/statuses';
import SelectUser from 'app/components/users/selectusers';
import { UserItem, User } from 'app/services/users';
import { DocType } from 'app/services/docTypes';
import { Comment } from 'app/services/comments';
import EditableHeader from 'app/components/EditableHeader';
import EditableMarkDown from 'app/components/EditableMarkDown';
import { canEditDoc } from 'app/services/authentication';
import DocStatusViewEdit from 'app/components/Doc/DocStatusViewEdit';
import LabelsList from 'app/components/Labels/LabelList';
import { OrganizationMilestone } from 'app/services/OrganizationMilestones';
import DocMilestoneViewEdit from 'app/components/Doc/DocMilestoneViewEdit';
import AhoraSpinner from 'app/components/Forms/Basics/Spinner';
import { Comment as CommentAnt, Descriptions, Space, Popconfirm, Tag } from 'antd';
import { Dispatch } from 'redux';
import UserDetails from 'app/components/users/UserDetails';
import UserAvatar from 'app/components/users/UserAvatar';
import UserAvatarList from 'app/components/users/UsersAvatarList';
import { reportDocRead } from 'app/store/shortcuts/actions';
import AddCommentComponent from 'app/components/Comments/AddComment';
import { addComment } from 'app/services/comments';
import { AddCommentInState } from 'app/store/comments/actions';
import AhoraDate from 'app/components/Basics/AhoraTime';
import AhoraFlexPanel from 'app/components/Basics/AhoraFlexPanel';
import { addWatcheToDocInState, DeleteWatcheFromDocInState, requestDocToState } from 'app/store/docs/actions';


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
    reportAsRead(docId: number): void;
    requestDoc: () => void;
    addComment: (comment: Comment, tempCommentId?: number) => void;
    addWatcher: (userId: number) => void;
    deleteWatcher: (userId: number) => void;
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
        this.props.reportAsRead(doc.id);
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
        this.props.addComment(newComment, comment.id);
        this.props.reportAsRead(newComment.docId);
    }

    async componentDidUpdate(PrevProps: AllProps) {

        /*const prevDocId: number | undefined = PrevProps.doc ? PrevProps.doc.id : undefined;
        if (this.props.doc && this.props.doc.id !== prevDocId) {
            if (prevDocId) {
                this.props.reportAsRead(prevDocId)
            }
        }
        */
    }

    async componentDidMount() {
        if (!this.props.doc) {
            this.props.requestDoc();
        }
    }

    async onLabelsUpdate(labels: number[]): Promise<void> {
        const updatedDoc = { ...this.props.doc!, labels };
        this.updateDoc(updatedDoc);
        await updateDocLabels(this.props.match.params.login, parseInt(this.props.match.params.docId), labels);
    }

    async onAssigneeSelect(user: UserItem) {
        const addedUserItem: UserItem = await assignDoc(this.props.match.params.login, parseInt(this.props.match.params.docId), user.id);
        const updatedDoc = { ...this.props.doc!, assigneeUserId: addedUserItem.id };
        this.updateDoc(updatedDoc);
    }

    async onSubjectChanged(value: string) {
        const updatedDoc = { ...this.props.doc!, subject: value };
        await updateDocSubject(this.props.match.params.login, this.props.doc!.id, value);
        this.updateDoc(updatedDoc);
    }

    async updateIsPrivate(isPrivate: boolean) {
        const updatedDoc: Doc = { ...this.props.doc!, isPrivate };
        await updateDocIsPrivate(this.props.match.params.login, this.props.doc!.id, isPrivate);
        this.updateDoc(updatedDoc);
    }

    async onUserAddedToWatchers(user: UserItem) {
        try {
            this.props.addWatcher(user.id);
            await addWatcherToDoc(this.props.doc!.id, user.id);
        }
        catch {
            this.props.deleteWatcher(user.id);
        }
    }

    async onUserDeletedFromWatchers(userId: number) {
        try {
            this.props.deleteWatcher(userId);
            await deleteWatcherFromDoc(this.props.doc!.id, userId);
        }
        catch {
            this.props.addWatcher(userId);
        }
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
        let canAddComment: boolean = !!this.props.currentUser;
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

                    <AhoraFlexPanel scrollId={`scrollableComments${doc.id}`} bottom={canAddComment && <AddCommentComponent commentAdded={this.commentAdded.bind(this)} login={this.props.match.params.login} docId={doc.id}></AddCommentComponent>}>
                        <div className="doc-details">
                            <div>
                                <Space className="extra">
                                    <DocStatusViewEdit canEdit={canEdit} status={currentStatus} onUpdate={this.changeStatus.bind(this)}></DocStatusViewEdit>
                                    <DocMilestoneViewEdit canEdit={canEdit} milestone={currentMilestone} onUpdate={this.changeMilestone.bind(this)}></DocMilestoneViewEdit>
                                    <Popconfirm onConfirm={canEdit ? this.updateIsPrivate.bind(this, !doc.isPrivate) : undefined} title="Are you sure?">
                                        <Tag color="#108ee9">{doc.isPrivate ? "Private" : "Public"}</Tag>
                                    </Popconfirm>
                                </Space>
                                <EditableHeader canEdit={canEdit} onChanged={this.onSubjectChanged.bind(this)} value={doc.subject}>
                                    <h1>{doc.subject}</h1>
                                </EditableHeader>
                                <Space direction="vertical" style={{ width: "100%" }}>
                                    <LabelsList onChange={this.onLabelsUpdate.bind(this)} canEdit={canEdit} defaultSelected={doc.labels}></LabelsList>
                                    <UserAvatarList canEdit={canEdit} userIds={doc.watchers} />
                                </Space>
                                <Descriptions>
                                    <Descriptions.Item label="Assignee">
                                        <SelectUser editMode={false} currentUserId={doc.assigneeUserId} onSelect={this.onAssigneeSelect.bind(this)}></SelectUser>
                                    </Descriptions.Item>
                                    {docType && <Descriptions.Item label="Type"><>{docType.name}</></Descriptions.Item>}
                                    {doc.closedAt && <Descriptions.Item label="Closed At"><AhoraDate date={doc.closedAt}></AhoraDate></Descriptions.Item>}
                                    {doc.lastView && <Descriptions.Item label="Last viewd by me">
                                        <AhoraDate date={doc.lastView.updatedAt}></AhoraDate>
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
                                            <AhoraDate date={doc.createdAt}></AhoraDate>
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
                            </div>
                            <CommentListComponent focusId={this.state.focusCommentId} doc={doc} login={this.props.match.params.login}></CommentListComponent>
                        </div>
                    </AhoraFlexPanel>

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
        addWatcher: (userId) => dispatch(addWatcheToDocInState(parseInt(ownProps.match.params.docId), userId)),
        deleteWatcher: (userId) => dispatch(DeleteWatcheFromDocInState(parseInt(ownProps.match.params.docId), userId)),
        requestDoc: () => dispatch(requestDocToState(parseInt(ownProps.match.params.docId))),
        reportAsRead: (docId: number) => dispatch(reportDocRead(docId)),
        addComment: (comment: Comment, tempCommentId?: number) => dispatch(AddCommentInState(comment, tempCommentId)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocsDetailsPage as any); 