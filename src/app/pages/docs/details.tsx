import * as React from 'react';
import { Doc, getDoc, updateDoc, assignDoc, updateDocSubject, updateDocDescription, updateDocLabels, deleteDoc } from 'app/services/docs';
import { RouteComponentProps } from 'react-router';
import { CommentListComponent } from 'app/components/Comments/List';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { Status } from 'app/services/statuses';
import SelectUser from 'app/components/users/selectusers';
import { UserItem, User } from 'app/services/users';
import { DocType } from 'app/services/docTypes';
import Table from 'react-bootstrap/Table';
import Moment from 'react-moment';
import DocWatchersComponent from 'app/components/DocWatchers';
import EditableHeader from 'app/components/EditableHeader';
import EditableMarkDown from 'app/components/EditableMarkDown';
import { canEditDoc } from 'app/services/authentication';
import DocStatusViewEdit from 'app/components/Doc/DocStatusViewEdit';
import DocLabelViewEdit from 'app/components/Doc/DocLabelsViewEdit';
import Button from 'react-bootstrap/Button';

interface DocsDetailsPageState {
    doc: Doc | null;
}

interface DocsDetailsPageParams {
    login: string;
    id: string;
}

interface injectedParams {
    statuses: Status[],
    docTypes: Map<number, DocType>,
    statusesMap: Map<number, Status>,
    loading: boolean;
    currentUser: User | undefined | null;

}

interface DocDetailsPageProps extends RouteComponentProps<DocsDetailsPageParams>, injectedParams {

}

interface AllProps extends DocDetailsPageProps {

}



class DocsDetailsPage extends React.Component<AllProps, DocsDetailsPageState> {
    constructor(props: AllProps) {
        super(props);
        this.state = {
            doc: null
        }
    }

    async changeStatus(statusId: number) {
        if (statusId !== this.state.doc!.statusId) {
            const doc = { ...this.state.doc!, statusId: statusId };
            const updatedDoc = await updateDoc(this.props.match.params.login, doc.id, doc);
            this.setState({
                doc: updatedDoc
            });
        }
    }

    async componentDidMount() {
        const doc: Doc = await getDoc(this.props.match.params.login, parseInt(this.props.match.params.id));
        this.setState({ doc });
    }

    async onLabelsUpdate(labels: number[]): Promise<void> {
        await updateDocLabels(this.props.match.params.login, parseInt(this.props.match.params.id), labels);
        this.setState({
            doc: { ...this.state.doc!, labels }
        });
    }

    async onAssigneeSelect(user: UserItem) {
        const addedUserItem: UserItem = await assignDoc(this.props.match.params.login, parseInt(this.props.match.params.id), user.username);
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
        if (doc) {
            canEdit = canEditDoc(this.props.currentUser, doc);
            docType = this.props.docTypes.get(doc.docTypeId);

            if (doc.statusId) {
                currentStatus = this.props.statusesMap.get(doc.statusId);
            }

        }
        return (
            <Container fluid={true}>
                {doc &&
                    <>
                        <Row className="details">
                            <Col xs={12} md={8}>
                                <EditableHeader canEdit={canEdit} onChanged={this.onSubjectChanged.bind(this)} value={doc.subject}><h1>{doc.subject}</h1></EditableHeader>
                                {canEdit ?
                                    <DocStatusViewEdit status={currentStatus} onUpdate={this.changeStatus.bind(this)}></DocStatusViewEdit>
                                    : <div>
                                        {
                                            currentStatus && <div>{currentStatus.name}</div>
                                        }
                                    </div>
                                }

                                <DocLabelViewEdit canEdit={canEdit} onUpdate={this.onLabelsUpdate.bind(this)} labels={doc.labels}></DocLabelViewEdit>

                                <EditableMarkDown canEdit={canEdit} onChanged={this.onDescriptionChanged.bind(this)} value={doc.description}>
                                    <p className="mt-4 markdown-body" dangerouslySetInnerHTML={{ __html: doc.htmlDescription }}></p>
                                </EditableMarkDown>
                                <h2>Comments</h2>
                                <CommentListComponent docId={doc.id} login={this.props.match.params.login}></CommentListComponent>

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
                                <h2>Watchers</h2>
                                <DocWatchersComponent docId={doc.id} login={this.props.match.params.login}></DocWatchersComponent>
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
                }
            </Container>
        );
    };
}

const mapStateToProps = (state: ApplicationState): injectedParams => {
    return {
        docTypes: state.docTypes.mapById,
        statuses: state.statuses.statuses,
        statusesMap: state.statuses.map,
        loading: state.statuses.loading,
        currentUser: state.currentUser.user
    };
};

export default connect(mapStateToProps, null)(DocsDetailsPage as any); 