import * as React from 'react';
import { Doc, updateDoc, assignDoc, updateDocSubject, updateDocDescription, updateDocLabels, deleteDoc, updateDocStatus, updateDocIsPrivate, addWatcherToDoc, deleteWatcherFromDoc } from 'app/services/docs';
import CommentListComponent from 'app/components/Comments/List';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import SelectUser from 'app/components/users/selectusers';
import { UserItem, User, UserType } from 'app/services/users';
import { Comment } from 'app/services/comments';
import EditableHeader from 'app/components/EditableHeader';
import EditableMarkDown from 'app/components/EditableMarkDown';
import { canEditDoc } from 'app/services/authentication';
import DocStatusViewEdit from 'app/components/Doc/DocStatusViewEdit';
import LabelsList from 'app/components/Labels/LabelList';
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
import { AddCommentInState, requestCommentsToState } from 'app/store/comments/actions';
import AhoraDate from 'app/components/Basics/AhoraTime';
import AhoraFlexPanel from 'app/components/Basics/AhoraFlexPanel';
import { addWatcheToDocInState, deleteDocInState, DeleteWatcheFromDocInState, requestDocToState, setDocInState } from 'app/store/docs/actions';
import DocTypeText from 'app/components/localization/DocTypeText';
import { FormattedMessage } from 'react-intl';
import IsPrivateTag from 'app/components/localization/IsPrivateTag';
import DocStar from 'app/components/Doc/DocStar';
import AhoraHotKey from 'app/components/Basics/AhoraHotKey';

interface DocsDetailsPageState {
    focusCommentId?: number;
}

interface injectedParams {
    loading: boolean;
    currentUser: User | undefined | null;
    doc?: Doc;
    hasCommentsLoaded: boolean;
}

interface DispatchProps {
    reportAsRead(): void;
    requestDoc: () => void;
    updateDoc(doc: Doc): void;
    deleteDoc(docId: number): void;
    addComment: (comment: Comment, tempCommentId?: number) => void;
    addWatcher: (userId: number) => void;
    deleteWatcher: (userId: number) => void;
    loadComments: () => void;

}

interface AllProps extends injectedParams, DispatchProps {
    onDocDeleted?: (doc: Doc) => void;
    docId: number;
}

class DocsDetailsPage extends React.Component<AllProps, DocsDetailsPageState> {
    constructor(props: AllProps) {
        super(props);
        this.state = {}
    }

    async changeStatus(statusId: number) {
        if (this.props.doc && statusId !== this.props.doc.statusId) {
            const updatedDoc = { ...this.props.doc, statusId };
            await updateDocStatus(this.props.doc.id, statusId);
            this.updateDoc(updatedDoc);

        }
    }

    updateDoc(doc: Doc) {
        this.props.updateDoc(doc);
        this.props.reportAsRead();
    }

    async changeMilestone(milestoneId?: number) {
        if (this.props.doc && milestoneId !== this.props.doc!.milestoneId) {
            const doc = { ...this.props.doc, milestoneId };
            const updatedDoc = await updateDoc(doc.id, doc);
            this.updateDoc(updatedDoc);

        }
    }

    async commentAdded(comment: Comment) {
        this.props.addComment(comment);
        this.setState({ focusCommentId: comment.id })

        const newComment: Comment = await addComment(comment.docId, comment.comment, comment.parentId);
        this.setState({ focusCommentId: newComment.id });
        this.props.addComment(newComment, comment.id);
        this.props.reportAsRead();
    }

    async componentDidMount() {
        if (!this.props.doc) {
            this.props.requestDoc();
        }
    }

    async onLabelsUpdate(labels: number[]): Promise<void> {
        const updatedDoc = { ...this.props.doc!, labels };
        this.updateDoc(updatedDoc);
        await updateDocLabels(this.props.docId, labels);
    }

    async onAssigneeSelect(userId?: number) {
        const addedUserItem: UserItem = await assignDoc(this.props.docId, userId !== undefined ? userId : null);
        const updatedDoc = { ...this.props.doc!, assigneeUserId: addedUserItem.id };
        this.updateDoc(updatedDoc);
    }

    async onSubjectChanged(value: string) {
        const updatedDoc = { ...this.props.doc!, subject: value };
        await updateDocSubject(this.props.doc!.id, value);
        this.updateDoc(updatedDoc);
    }

    async updateIsPrivate(isPrivate: boolean) {
        const updatedDoc: Doc = { ...this.props.doc!, isPrivate };
        await updateDocIsPrivate(this.props.doc!.id, isPrivate);
        this.updateDoc(updatedDoc);
    }

    async onUserAddedToWatchers(userId: number) {
        try {
            this.props.addWatcher(userId);
            await addWatcherToDoc(this.props.doc!.id, userId);
        }
        catch {
            this.props.deleteWatcher(userId);
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

            this.props.deleteDoc(this.props.docId);
            await deleteDoc(this.props.docId);
        }
    }

    onScrollToBottom() {
        if (this.props.hasCommentsLoaded) {
            this.props.reportAsRead()
        }
    }

    onScrollToTop() {
        this.props.loadComments();
    }

    async onDescriptionChanged(value: string) {
        const newDoc = await updateDocDescription(this.props.doc!.id, value);
        this.updateDoc({ ...this.props.doc, ...newDoc });
    }

    render() {
        const doc: Doc | undefined = this.props.doc;
        let canEdit: boolean = false;
        let canAddComment: boolean = !!this.props.currentUser;
        if (doc) {
            canEdit = canEditDoc(this.props.currentUser, doc);
        }
        return (
            <>
                {doc ?
                    <AhoraFlexPanel onScrollToTop={this.onScrollToTop.bind(this)} onScrollToBottom={this.onScrollToBottom.bind(this)} top={
                        <div className="doc-title">
                            <Space className="extra">
                                <DocStatusViewEdit canEdit={canEdit} statusId={doc.statusId} onUpdate={this.changeStatus.bind(this)}></DocStatusViewEdit>
                                <DocMilestoneViewEdit canEdit={canEdit} milestoneId={doc.milestoneId} onUpdate={this.changeMilestone.bind(this)}></DocMilestoneViewEdit>
                                <Popconfirm onConfirm={canEdit ? this.updateIsPrivate.bind(this, !doc.isPrivate) : undefined} title="Are you sure?">
                                    <IsPrivateTag isPrivate={doc.isPrivate} />
                                </Popconfirm>
                                <DocStar docId={doc.id} />
                            </Space>
                            <EditableHeader canEdit={canEdit} onChanged={this.onSubjectChanged.bind(this)} value={doc.subject}>
                                <h1>{doc.subject}</h1>
                            </EditableHeader>
                        </div>
                    } scrollId={`scrollableComments${doc.id}`} bottom={canAddComment && <AddCommentComponent commentAdded={this.commentAdded.bind(this)} docId={doc.id}></AddCommentComponent>}>
                        <div className="doc-details">
                            <div>
                                <Space direction="vertical" style={{ width: "100%" }}>
                                    <LabelsList onChange={this.onLabelsUpdate.bind(this)} canEdit={canEdit} defaultSelected={doc.labels}></LabelsList>
                                    <UserAvatarList onUserDeleted={this.onUserDeletedFromWatchers.bind(this)} onUserSelected={this.onUserAddedToWatchers.bind(this)} canEdit={canEdit} userIds={doc.watchers} />
                                </Space>
                                <Descriptions>
                                    <Descriptions.Item label={<FormattedMessage id="assigneeMeDescriptor" />}>
                                        <SelectUser showUnassigned={true} userType={UserType.User} autoFocus={true} editMode={false} currentUserId={doc.assigneeUserId} onSelect={this.onAssigneeSelect.bind(this)}></SelectUser>
                                    </Descriptions.Item>
                                    <Descriptions.Item label={<FormattedMessage id="docTypeDescriptor" />}><DocTypeText docTypeId={doc.docTypeId}></DocTypeText></Descriptions.Item>
                                    {doc.closedAt && <Descriptions.Item label={<FormattedMessage id="closedAtDescriptor" />}><AhoraDate date={doc.closedAt}></AhoraDate></Descriptions.Item>}
                                    {doc.lastView && <Descriptions.Item label={<FormattedMessage id="lastViewedByMeDescriptor" />}><AhoraDate date={doc.lastView.updatedAt}></AhoraDate></Descriptions.Item>}
                                    {doc.source &&
                                        <>
                                            <Descriptions.Item label="Github Issue Id">
                                                <a target="_blank" href={doc.source.url}>{doc.sourceId}</a>
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Repo">{doc.source.repo}</Descriptions.Item>
                                            <Descriptions.Item label="Organization">{doc.source.organization}</Descriptions.Item>
                                        </>
                                    }
                                </Descriptions>
                                <EditableMarkDown canEdit={canEdit} onChanged={this.onDescriptionChanged.bind(this)} value={doc.description}>
                                    <CommentAnt className="description"
                                        datetime={
                                            <AhoraDate date={doc.createdAt}></AhoraDate>
                                        }
                                        actions={
                                            canEdit ? [
                                                <AhoraHotKey action={this.delete.bind(this)} shortcut="alt+d">
                                                    <Popconfirm onConfirm={this.delete.bind(this)} title="Are you sure?">
                                                        <span><FormattedMessage id="deleteDocType" /></span>
                                                    </Popconfirm>
                                                </AhoraHotKey>
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
                            <CommentListComponent focusId={this.state.focusCommentId} doc={doc}></CommentListComponent>
                        </div>
                    </AhoraFlexPanel>

                    : <AhoraSpinner />
                }
            </>
        );
    };
}

const mapStateToProps = (state: ApplicationState, ownProps: AllProps): injectedParams => {
    const docId = ownProps.docId;
    const comments = state.comments.docs.get(docId);
    return {
        loading: state.statuses.loading,
        currentUser: state.currentUser.user,
        doc: state.docs.docs.get(docId),
        hasCommentsLoaded: comments?.moreComments !== undefined && comments?.comments !== undefined,
    };
};

const mapDispatchToProps = (dispatch: Dispatch, ownProps: AllProps): DispatchProps => {
    return {
        addWatcher: (userId) => dispatch(addWatcheToDocInState(ownProps.docId, userId)),
        deleteWatcher: (userId) => dispatch(DeleteWatcheFromDocInState(ownProps.docId, userId)),
        deleteDoc: (docId: number) => dispatch(deleteDocInState(docId)),
        requestDoc: () => dispatch(requestDocToState(ownProps.docId)),
        updateDoc: (doc: Doc) => dispatch(setDocInState(doc)),
        reportAsRead: () => dispatch(reportDocRead(ownProps.docId)),
        loadComments: () => dispatch(requestCommentsToState((ownProps.docId))),
        addComment: (comment: Comment, tempCommentId?: number) => dispatch(AddCommentInState(comment, tempCommentId)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocsDetailsPage as any); 