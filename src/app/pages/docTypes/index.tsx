import * as React from 'react'; import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import NavItem from 'react-bootstrap/NavItem';
import { DocType, add, deleteDocType, editDocType } from 'app/services/docTypes';
import { ApplicationState } from 'app/store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import { requestDocTypesData, addDocTypeFromState, deleteDocTypeFromState, updateDocTypeToState } from 'app/store/docTypes/actions';

interface DocTypeRow {
    docType: DocType;
    editable: boolean;
    name?: string;
    description?: string;
    code?: string;
}

interface DocTypeesPageState {
    newDocType?: DocTypeRow
}

interface DocTypePageProps {
    docTypes?: DocTypeRow[];
    loading: boolean;
    organizationId: string;
}

interface DispatchProps {
    requestDocTypes(): void;
    addDocTypeToState(docType: DocType): void,
    updateDocTypeToState(docType: DocType): void,
    removeDocTypeFromState(id: number): void
}

interface AllProps extends DocTypePageProps, DispatchProps {

}

class DocTypesPage extends React.Component<AllProps, DocTypeesPageState> {
    constructor(props: AllProps) {
        super(props);
        this.state = {};
    }

    async componentDidMount() {
        this.props.requestDocTypes();
    }

    public markAsEditable(docTypeRow: DocTypeRow) {
        docTypeRow.editable = true;
        docTypeRow.name = docTypeRow.docType.name;
        docTypeRow.description = docTypeRow.docType.description || "";
        docTypeRow.code = docTypeRow.docType.code || "";
        this.setState({});
    }

    public addnewDocType() {
        this.setState({
            newDocType: {
                editable: true,
                description: "",
                name: "",
                docType: {
                    name: "",
                    code: "",
                    description: "",
                }
            }
        });
    }

    public cancelEditable(docTypeRow: DocTypeRow) {
        if (docTypeRow.docType.id) {
            docTypeRow.editable = false;
            docTypeRow.name = docTypeRow.docType.name;
            docTypeRow.description = docTypeRow.docType.description || "";
            docTypeRow.code = docTypeRow.docType.code;
            this.setState({});
        }
        else {
            this.setState({
                newDocType: undefined
            });
        }

    }

    public saveData(event: any, docType: DocTypeRow) {
        (docType as any)[event.target.name] = event.target.value;
        this.setState({});
    }

    public async saveDocType(docType: DocTypeRow) {
        docType.docType.name = docType.name!;
        docType.docType.description = docType.description!;
        docType.docType.code = docType.code!;

        if (docType.docType.id) {
            await editDocType(this.props.organizationId, docType.docType);
            this.props.updateDocTypeToState(docType.docType);

        }
        else {
            const addeddocType = await add(this.props.organizationId, docType.docType);
            this.props.addDocTypeToState(addeddocType);
        }

        this.setState({
            newDocType: undefined
        });
    }

    public async onDeleteDocType(docType: DocTypeRow) {
        await deleteDocType(this.props.organizationId, docType.docType.id!);
        this.props.removeDocTypeFromState(docType.docType.id!);
    }



    render() {
        let docTypes: DocTypeRow[] | undefined = [...this.props.docTypes];
        if (docTypes && this.state.newDocType) {
            docTypes.push(this.state.newDocType);
        }
        return (
            <div>
                <h2>Doc Types</h2>
                <Nav>
                    <NavItem>
                        <Button onClick={this.addnewDocType.bind(this)}>Add new doc type</Button>
                    </NavItem>
                </Nav>
                <Table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Code</th>
                            <th>description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {docTypes && (docTypes.map((docTypeRow) => {
                            return (
                                <tr className="pt-3" key={docTypeRow.docType.id}>
                                    <td>
                                        {docTypeRow.editable ? (
                                            <Form.Control value={docTypeRow.name} name="name" onChange={(e: any) => { this.saveData(e, docTypeRow) }} type="text" />
                                        ) : (<>{docTypeRow.docType.name}</>)}
                                    </td>
                                    <td>
                                        {docTypeRow.editable ? (
                                            <Form.Control name="code" value={docTypeRow.code} onChange={(e: any) => { this.saveData(e, docTypeRow) }} type="text" />
                                        ) : (<>{docTypeRow.docType.code}</>)}
                                    </td>
                                    <td>
                                        {docTypeRow.editable ? (
                                            <Form.Control name="description" value={docTypeRow.description} onChange={(e: any) => { this.saveData(e, docTypeRow) }} type="text" />
                                        ) : (<>{docTypeRow.docType.description}</>)}
                                    </td>
                                    <td>
                                        {docTypeRow.editable ? (
                                            <>
                                                <Button variant="danger" onClick={() => { this.cancelEditable(docTypeRow); }}>Cancel</Button>
                                                <Button variant="success" onClick={() => { this.saveDocType(docTypeRow) }}>Save</Button>
                                            </>)
                                            :
                                            (<>
                                                <Button onClick={() => { this.markAsEditable(docTypeRow); }}>Edit</Button>
                                                <Button variant="danger" onClick={() => { this.onDeleteDocType(docTypeRow); }}>Delete</Button></>)}
                                    </td>
                                </tr>);
                        }))}
                    </tbody>
                </Table>
            </div>
        );
    };
}

const mapStateToProps = (state: ApplicationState) => {
    return {
        organizationId: state.organizations.currentOrganization!.login,
        docTypes: state.docTypes.docTypes.map(docType => { return { editable: false, docType } }),
        loading: state.docTypes.loading
    };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
    return {
        requestDocTypes: () => dispatch(requestDocTypesData()),
        addDocTypeToState: (docType: DocType) => { dispatch(addDocTypeFromState(docType)) },
        removeDocTypeFromState: (id: number) => { dispatch(deleteDocTypeFromState(id)) },
        updateDocTypeToState: (docType: DocType) => { dispatch(updateDocTypeToState(docType)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocTypesPage as any); 