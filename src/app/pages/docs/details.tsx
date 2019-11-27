import * as React from 'react';
import { Doc, getDoc } from 'app/services/docs';
import { RouteComponentProps } from 'react-router';
import { CommentListComponent } from 'app/components/Comments/List';
import Button from 'react-bootstrap/Button';

interface DocsDetailsPageState {
    doc: Doc | null;
}

interface DocsDetailsPageParams {
    docType: string;
    login: string;
    id: string;
}

interface Props extends RouteComponentProps<DocsDetailsPageParams> {

}


class DocsDetailsPage extends React.Component<Props, DocsDetailsPageState> {
    constructor(props: Props) {
        super(props);
        this.state = {
            doc: null
        }
    }

    async componentDidMount() {
        const doc: Doc = await getDoc(this.props.match.params.login, parseInt(this.props.match.params.id));
        this.setState({ doc });
    }

    render() {
        return (
            <div>
                {this.state.doc &&
                    <>
                        <div className="details">
                            <h2>{this.state.doc.subject}</h2>
                            <Button href={`/organizations/${this.props.match.params.login}/${this.props.match.params.docType}/${this.state.doc.id}/edit`}>Edit</Button>
                            <p className="markdown-body" dangerouslySetInnerHTML={{ __html: this.state.doc.htmlDescription }}></p>
                        </div>
                        <div>
                            <h4>Comments</h4>
                            <CommentListComponent docId={this.state.doc.id} login={this.props.match.params.login}></CommentListComponent>
                        </div>

                    </>
                }
            </div>
        );
    };
}

export default DocsDetailsPage;