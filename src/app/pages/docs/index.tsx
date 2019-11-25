import * as React from 'react';
import { Doc, getDocs } from 'app/services/docs';
import { RouteComponentProps } from 'react-router';
import Button from 'react-bootstrap/Button';

interface DocsPageState {
    docs: Doc[];
}

interface DocsPageParams {
    docType: string;
    login: string;
}

interface Props extends RouteComponentProps<DocsPageParams> {

}


class DocsPage extends React.Component<Props, DocsPageState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            docs: []
        }
    }

    async componentDidMount() {
        console.log(this.props.match.params);
        const docs: Doc[] = await getDocs(this.props.match.params.login, this.props.match.params.docType);
        this.setState({
            docs
        });
    }

    render() {
        return (
            <div>
                <h2>{this.props.match.params.docType}</h2>
                <Button variant="primary" type="button" href={`/organizations/${this.props.match.params.login}/${this.props.match.params.docType}/add`}>
                    Add
                </Button>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Status</th>
                            <th>Updated At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.docs.map((doc) => {
                            return (
                                <tr className="pt-3" key={doc.id!}>
                                    <td><a href={`/organizations/${this.props.match.params.login}/${this.props.match.params.docType}/${doc.id}`}>{doc.subject}</a></td>
                                    <td>Opened</td>
                                    <td>{doc.updatedAt}</td>
                                </tr>);
                        })}
                    </tbody>
                </table>
            </div>
        );
    };
}

export default DocsPage;