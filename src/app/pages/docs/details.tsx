import * as React from 'react';
import { Doc, getDoc } from 'app/services/docs';
import { RouteComponentProps } from 'react-router';
import { CommentListComponent } from 'app/components/Comments/List';

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
                            <h2>{this.props.match.params.docType}</h2>
                            <h3>{this.state.doc.subject}</h3>
                            <p>{this.state.doc.description}</p>

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