import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { User } from 'app/services/users';
import { Doc } from 'app/services/docs';
import { canEditDoc } from 'app/services/authentication';

interface CanEditProps {
    currentUser: User | undefined | null;
}


interface AllProps extends CanEditProps {
    doc: Doc
}

class CanEdit extends React.Component<AllProps> {
    constructor(props: AllProps) {
        super(props);
        this.state = {
            addNewLabel: false
        };
    }

    render() {
        return (
            <>
                {canEditDoc(this.props.currentUser, this.props.doc) && <>{this.props.children}</>}
            </>
        );
    };
}


const mapStateToProps = (state: ApplicationState): CanEditProps => {
    return {
        currentUser: state.currentUser.user
    };
};

export default connect(mapStateToProps)(CanEdit as any);