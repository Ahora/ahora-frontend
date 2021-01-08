import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { User } from 'app/services/users';
import { Comment } from 'app/services/comments';
import { canPinComment } from 'app/services/authentication';
import { Doc } from 'app/services/docs';

interface Props {
    comment: Comment;
    docId: number;
}

interface CanCommentProps {
    currentUser: User | undefined | null;
    doc?: Doc;
}

interface AllProps extends CanCommentProps, Props {

}

class CanPingComment extends React.Component<AllProps> {
    constructor(props: AllProps) {
        super(props);
    }

    render() {
        if (this.props.doc) {
            return (
                <>
                    {canPinComment(this.props.doc, this.props.currentUser) && <>{this.props.children}</>}
                </>
            );
        }
        else {
            return <></>
        }

    };
}


const mapStateToProps = (state: ApplicationState, ownProps: AllProps): CanCommentProps => {
    return {
        currentUser: state.currentUser.user,
        doc: state.docs.docs.get(ownProps.docId)
    };
};

export default connect(mapStateToProps)(CanPingComment as any); 