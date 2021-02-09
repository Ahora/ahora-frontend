import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { DocTypeAllProps, DocTypeProps, InjecteableProps } from './type';
import DocTypeTextComponent from './component';

const mapStateToProps = (state: ApplicationState, ownProps: DocTypeAllProps): InjecteableProps => {
    return {
        docType: state.docTypes.mapById.get(ownProps.docTypeId)
    };
};

const connector = connect(mapStateToProps);
export default connector(DocTypeTextComponent as any) as React.FC<DocTypeProps>