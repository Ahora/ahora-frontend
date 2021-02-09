import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { DocType } from 'app/services/docTypes';
import { Tag } from 'antd';
import { FormattedMessage } from 'react-intl';

interface DocTypeProps {
    docTypeId: number;
}

interface InjecteableProps {
    docType?: DocType;
}

interface AllProps extends DocTypeProps, InjecteableProps {

}

class DocTypeTag extends React.Component<AllProps> {
    constructor(props: AllProps) {
        super(props);
        this.state = {
            addNewLabel: false
        };
    }

    render() {
        return <Tag>

            {(this.props.docType) &&
                <FormattedMessage id={`docType${this.props.docType.id}`} defaultMessage={this.props.docType.name} />
            }
        </Tag>
    };
}


const mapStateToProps = (state: ApplicationState, ownProps: AllProps): InjecteableProps => {
    return {
        docType: state.docTypes.mapById.get(ownProps.docTypeId)
    };
};


export default connect(mapStateToProps)(DocTypeTag as any); 