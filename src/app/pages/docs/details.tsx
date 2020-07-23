import * as React from 'react';
import { Doc, updateDoc, assignDoc, updateDocSubject, updateDocDescription, updateDocLabels, deleteDoc, updateDocStatus, getDoc } from 'app/services/docs';
import { RouteComponentProps } from 'react-router';
import { CommentListComponent } from 'app/components/Comments/List';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { Status } from 'app/services/statuses';
import SelectUser from 'app/components/users/selectusers';
import { UserItem, User } from 'app/services/users';
import { DocType } from 'app/services/docTypes';
import Table from 'react-bootstrap/Table';
import Moment from 'react-moment';
import EditableHeader from 'app/components/EditableHeader';
import EditableMarkDown from 'app/components/EditableMarkDown';
import { canEditDoc } from 'app/services/authentication';
import DocStatusViewEdit from 'app/components/Doc/DocStatusViewEdit';
import LabelsList from 'app/components/LabelsSelector/details';
import Button from 'react-bootstrap/Button';
import { OrganizationMilestone } from 'app/services/OrganizationMilestones';
import DocMilestoneViewEdit from 'app/components/Doc/DocMilestoneViewEdit';
import AhoraSpinner from 'app/components/Forms/Basics/Spinner';

interface DocsDetailsPageState {
    doc: Doc | null;
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

}

interface DocDetailsPageProps extends RouteComponentProps<DocsDetailsPageParams>, injectedParams {
    doc?: Doc;
}

interface AllProps extends DocDetailsPageProps {

}



class DocsDetailsPage extends React.Component<AllProps, DocsDetailsPageState> {
    constructor(props: AllProps) {
        super(props);
        this.state = {
            doc: this.props.doc ? this.props.doc : null
        }
    }

    async changeStatus(statusId: number) {
        if (statusId !== this.state.doc!.statusId) {
            await updateDocStatus(this.props.match.params.login, this.state.doc!.id, statusId);
            this.setState({
                doc: {
                    ...this.state.doc!,
                    statusId
                }
            });
        }
    }

    async changeMilestone(milestoneId?: number) {
        if (milestoneId !== this.state.doc!.milestoneId) {
            const doc = { ...this.state.doc!, milestoneId };
            const updatedDoc = await updateDoc(this.props.match.params.login, doc.id, doc);
            this.setState({
                doc: {
                    ...this.state.doc,
                    ...updatedDoc
                }
            });
        }
    }

    async componentDidMount() {
        if (!this.state.doc) {
            const doc: Doc = await getDoc(this.props.match.params.login, parseInt(this.props.match.params.docId));
            this.setState({ doc });
        }
    }

    async onLabelsUpdate(labels: number[]): Promise<void> {
        await updateDocLabels(this.props.match.params.login, parseInt(this.props.match.params.docId), labels);
        this.setState({
            doc: { ...this.state.doc!, labels }
        });
    }

    async onAssigneeSelect(user: UserItem) {
        const addedUserItem: UserItem = await assignDoc(this.props.match.params.login, parseInt(this.props.match.params.docId), user.username);
        this.setState({
            doc: { ...this.state.doc!, assignee: addedUserItem },
        });
    }

    async onSubjectChanged(value: string) {
        await updateDocSubject(this.props.match.params.login, this.state.doc!.id, value);
        this.setState({
            doc: { ...this.state.doc!, subject: value },
        });
    }

    async delete() {
        if (this.state.doc) {
            await deleteDoc(this.props.match.params.login, this.state.doc.id!);
            this.props.history.replace(`/organizations/${this.props.match.params.login}/docs`);
        }
    }

    async componentDidUpdate(PrevProps: AllProps) {
        const prevDocId: number | undefined = PrevProps.doc ? PrevProps.doc.id : undefined;
        if (this.props.doc && this.props.doc.id !== prevDocId) {

            this.setState({
                doc: this.props.doc
            });

        }
    }
    async onDescriptionChanged(value: string) {
        const newDoc = await updateDocDescription(this.props.match.params.login, this.state.doc!.id, value);
        this.setState({
            doc: newDoc,
        });
    }

    render() {
        const doc: Doc | null = this.state.doc;
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
                    <>
                        <div className="doc-header">
                            <div className="extra">
                                <DocStatusViewEdit canEdit={canEdit} status={currentStatus} onUpdate={this.changeStatus.bind(this)}></DocStatusViewEdit>
                                <DocMilestoneViewEdit canEdit={canEdit} milestone={currentMilestone} onUpdate={this.changeMilestone.bind(this)}></DocMilestoneViewEdit>
                            </div>
                            <EditableHeader canEdit={canEdit} onChanged={this.onSubjectChanged.bind(this)} value={doc.subject}><h1>{doc.subject}</h1></EditableHeader>
                            <LabelsList onChange={this.onLabelsUpdate.bind(this)} canEdit={canEdit} defaultSelected={doc.labels}></LabelsList>
                        </div>
                        <Row className="doc-details">
                            <Col xs={12} md={8}>
                                <EditableMarkDown canEdit={canEdit} onChanged={this.onDescriptionChanged.bind(this)} value={doc.description}>
                                    <p className="markdown-body" dangerouslySetInnerHTML={{ __html: doc.htmlDescription }}></p>
                                </EditableMarkDown>
                                <CommentListComponent doc={doc} login={this.props.match.params.login}></CommentListComponent>
                            </Col>
                            <Col xs={12} md={4}>
                                <h2>People</h2>
                                <Table>
                                    <tbody>
                                        <tr>
                                            <td>Assignee:</td>
                                            <td><SelectUser editMode={false} defaultSelected={doc.assignee && [doc.assignee]} onSelect={this.onAssigneeSelect.bind(this)}></SelectUser></td>
                                        </tr>
                                        {doc.reporter &&

                                            <tr>
                                                <td>Reporter:</td>
                                                <td>{doc.reporter.displayName} ({doc.reporter.username})</td>
                                            </tr>
                                        }
                                    </tbody>
                                </Table>
                                <h2>More</h2>
                                <Table>
                                    <tbody>
                                        {docType &&
                                            (<tr>
                                                <td>Type: </td>
                                                <td>{docType.name}</td>
                                            </tr>)}
                                        {doc.milestone &&
                                            (<tr>
                                                <td>Milestone </td>
                                                <td>{doc.milestone.title}</td>
                                            </tr>)}
                                        <tr>
                                            <td>Views: </td>
                                            <td>{doc.views}</td>
                                        </tr>
                                        {doc.closedAt &&
                                            (<tr>
                                                <td>Closed At: </td>
                                                <td><Moment titleFormat="D MMM YYYY hh:mm" withTitle format="D MMM YYYY hh:mm" date={doc.closedAt}></Moment></td>
                                            </tr>)}
                                        {doc.lastView &&
                                            (<tr>
                                                <td>Last viewd by me: </td>
                                                <td><Moment titleFormat="D MMM YYYY hh:mm" withTitle format="D MMM YYYY hh:mm" date={doc.lastView.updatedAt}></Moment></td>
                                            </tr>)}
                                        {doc.source &&
                                            (<>

                                                <tr>
                                                    <td>Github Issue Id: </td>
                                                    <td><a target="_blank" href={doc.source.url}>{doc.sourceId}</a></td>
                                                </tr>
                                                <tr>
                                                    <td>Repo</td>
                                                    <td>{doc.source.repo}</td>
                                                </tr>
                                                <tr>
                                                    <td>Organization</td>
                                                    <td>{doc.source.organization}</td>
                                                </tr>
                                            </>)}
                                    </tbody>
                                </Table>
                                <h2 className="mt-3">Times</h2>
                                <Table>
                                    <tbody>
                                        <tr>
                                            <td>Created At:</td>
                                            <td><Moment titleFormat="D MMM YYYY hh:mm" withTitle format="D MMM YYYY hh:mm" date={doc.createdAt}></Moment></td>
                                        </tr>
                                        {doc.updatedAt &&
                                            (<tr>
                                                <td>updated At: </td>
                                                <td><Moment titleFormat="D MMM YYYY hh:mm" withTitle format="D MMM YYYY hh:mm" date={doc.updatedAt}></Moment></td>
                                            </tr>)}
                                    </tbody>
                                </Table>
                                {canEdit && <Button variant="danger" onClick={this.delete.bind(this)}>Delete Doc</Button>}
                            </Col>
                        </Row>
                    </>
                    : <AhoraSpinner />
                }
            </>
        );
    };
}

const mapStateToProps = (state: ApplicationState): injectedParams => {
    return {
        docTypes: state.docTypes.mapById,
        statuses: state.statuses.statuses,
        milestonesMap: state.milestones.map,
        statusesMap: state.statuses.map,
        loading: state.statuses.loading,
        currentUser: state.currentUser.user
    };
};

export default connect(mapStateToProps, null)(DocsDetailsPage as any); 