import { connect } from 'react-redux';
import { ApplicationState } from 'app/store';
import { MilestoneAllProps, MilestoneProps, InjecteableProps } from './type';
import MilestoneTagComponent from './component';

const mapStateToProps = (state: ApplicationState, ownProps: MilestoneAllProps): InjecteableProps => {
    return {
        milestone: ownProps.milestoneId ? state.milestones.map.get(ownProps.milestoneId) : undefined
    };
};

const connector = connect(mapStateToProps);
export default connector(MilestoneTagComponent as any) as React.FC<MilestoneProps>