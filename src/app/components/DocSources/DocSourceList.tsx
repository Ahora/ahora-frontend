import * as React from 'react';
import AhoraSpinner from 'app/components/Forms/Basics/Spinner';
import { ApplicationState } from 'app/store';
import { connect } from 'react-redux';
import { DocSource, deleteDocSource } from 'app/services/docSources';
import CanManageOrganization from 'app/components/Authentication/CanManageOrganization';
import { Link } from 'react-router-dom';
import { Button, Table } from 'antd';

interface MilestonesPageParams {
    organizationId: string;
}

interface MilestonesPageProps extends MilestonesPageParams {
    docSources?: DocSource[];
    onDocSourceDeleted: (docSourceId: number) => void;

}

class DocSourceList extends React.Component<MilestonesPageProps> {
    constructor(props: MilestonesPageProps) {
        super(props);
    }

    async deleteSource(docSource: DocSource) {
        await deleteDocSource(docSource.id!);
        this.props.onDocSourceDeleted(docSource.id!);
    }

    render() {
        return (
            <div>
                {this.props.docSources ?
                    <Table rowKey="id" dataSource={this.props.docSources}>
                        <Table.Column title="Repo" dataIndex="repo" key="repo" />

                        <Table.Column title="Organization or User" dataIndex="organization" key="organization" render={(text, docSource: DocSource) => (
                            <Link to={`/organizations/${this.props.organizationId}/docs?repo=${docSource.repo}`}>{docSource.repo}</Link>
                        )} />
                        <Table.Column title="Actions" render={(value, docSource: DocSource) =>
                            <CanManageOrganization>
                                <Button danger onClick={() => { this.deleteSource(docSource) }}>Delete</Button>
                            </CanManageOrganization>
                        } />
                    </Table>
                    :
                    <AhoraSpinner />
                }
            </div>
        );
    };
}


const mapStateToProps = (state: ApplicationState): MilestonesPageParams => {
    return {
        organizationId: state.organizations.currentOrganization!.login,
    };
};


export default connect(mapStateToProps, null)(DocSourceList as any); 
