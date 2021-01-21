import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { Status } from 'app/services/statuses';
import { FormattedMessage } from 'react-intl';

interface DocStatusProps {
    statusId: number;
}

interface InjecteableProps {
    status?: Status;
}

interface AllProps extends DocStatusProps, InjecteableProps {

}

function DocStatusText(props: AllProps) {
    return <>
        {(props.status) &&
            <FormattedMessage id={`status${props.status.id}`} defaultMessage={props.status.name} />
        }
    </>

}

const mapStateToProps = (state: ApplicationState, ownProps: AllProps): InjecteableProps => {
    return {
        status: state.statuses.map.get(ownProps.statusId)
    };
};


export default connect(mapStateToProps)(DocStatusText as any); 