import * as React from 'react';
import Table from 'react-bootstrap/Table';
import AhoraSpinner from 'app/components/Forms/Basics/Spinner';
import Button from 'react-bootstrap/Button';
import { ApplicationState } from 'app/store';

import { connect } from 'react-redux';
import { DocSource, deleteDocSource } from 'app/services/docSources';
import CanManageOrganization from 'app/components/Authentication/CanManageOrganization';
import { Link } from 'react-router-dom';

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
                    <Table>
                        <thead>
                            <tr>
                                <th>Repo</th>
                                <th>Organization</th>
                                <CanManageOrganization>
                                    <th></th>
                                </CanManageOrganization>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.docSources.map((docSource: DocSource, ) => {
                                return (
                                    <tr className="pt-3" key={docSource.id}>
                                        <td>
                                            <Link to={`/organizations/${this.props.organizationId}/docs?repo=${docSource.repo}`}>{docSource.repo}</Link>
                                        </td>
                                        <td>{docSource.organization}</td>
                                        <CanManageOrganization>
                                            <td>
                                                <Button variant="danger" onClick={() => { this.deleteSource(docSource) }}>Delete</Button>
                                            </td>
                                        </CanManageOrganization>
                                    </tr>);
                            })}
                        </tbody>
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
