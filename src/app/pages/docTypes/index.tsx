import * as React from 'react';
import { DocType, add, deleteDocType, editDocType } from 'app/services/docTypes';
import { ApplicationState } from 'app/store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { addDocTypeFromState, deleteDocTypeFromState, updateDocTypeToState } from 'app/store/docTypes/actions';
import { Menu, Space, Table, Button, Input } from 'antd';

interface DocTypeRow {
    docType: DocType;
    editable: boolean;
    name?: string;
    description?: string;
    code?: string;
    organizationId: number | null;
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
                organizationId: null,
                name: "",
                docType: {
                    organizationId: null,
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
        let docTypes: DocTypeRow[] | undefined = this.props.docTypes;

        if (docTypes && this.state.newDocType) {
            docTypes = [this.state.newDocType, ...docTypes]
        }
        return (
            <div>
                <h2>Doc Types</h2>
                <Menu className="navbar-menu" mode="horizontal">
                    <Space>
                        <Button type="primary" onClick={this.addnewDocType.bind(this)}>Add new doc type</Button>
                    </Space>
                </Menu>


                <Table className="content-toside" dataSource={docTypes} rowKey="id">
                    <Table.Column title="Name" dataIndex="name" key="name" render={(text, docTypeRow: DocTypeRow) => (
                        <>
                            {docTypeRow.editable ? (
                                <Input value={docTypeRow.name} name="name" onChange={(e: any) => { this.saveData(e, docTypeRow) }} type="text" />
                            ) : (<>{docTypeRow.docType.name}</>)}
                        </>
                    )} />
                    <Table.Column title="Code" dataIndex="code" key="code" render={(text, docTypeRow: DocTypeRow) => (
                        <>
                            {docTypeRow.editable ? (
                                <Input name="code" value={docTypeRow.code} onChange={(e: any) => { this.saveData(e, docTypeRow) }} type="text" />
                            ) : (<>{docTypeRow.docType.code}</>)}
                        </>
                    )} />
                    <Table.Column title="Description" dataIndex="description" key="description" render={(text, docTypeRow: DocTypeRow) => (
                        <>
                            {docTypeRow.editable ? (
                                <Input name="description" value={docTypeRow.description} onChange={(e: any) => { this.saveData(e, docTypeRow) }} type="text" />
                            ) : (<>{docTypeRow.docType.description}</>)}
                        </>
                    )} />
                    <Table.Column title="Actions" render={(text, docTypeRow: DocTypeRow) => {

                        const canSave: boolean = !!docTypeRow.code && docTypeRow.code.trim().length > 0
                            && !!docTypeRow.name && docTypeRow.name.trim().length > 0;
                        return <>
                            {docTypeRow.editable ? (
                                <>
                                    <Button danger onClick={() => { this.cancelEditable(docTypeRow); }}>Cancel</Button>
                                    <Button disabled={!canSave} onClick={() => { this.saveDocType(docTypeRow) }}>Save</Button>
                                </>)
                                :
                                (<>
                                    {(docTypeRow.docType.organizationId !== null) &&
                                        <>
                                            <Button onClick={() => { this.markAsEditable(docTypeRow); }}>Edit</Button>
                                            <Button danger onClick={() => { this.onDeleteDocType(docTypeRow); }}>Delete</Button>
                                        </>
                                    }
                                </>
                                )
                            }
                        </>;
                    }} />
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
        addDocTypeToState: (docType: DocType) => { dispatch(addDocTypeFromState(docType)) },
        removeDocTypeFromState: (id: number) => { dispatch(deleteDocTypeFromState(id)) },
        updateDocTypeToState: (docType: DocType) => { dispatch(updateDocTypeToState(docType)) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DocTypesPage as any); 