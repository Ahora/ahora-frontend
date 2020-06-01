import * as React from 'react';
import { RouteComponentProps } from 'react-router';

interface Props {
    viewComponent: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
    editComponent?: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
}

interface State {
    editMode: boolean;
}

class ViewEdit extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            editMode: true
        }
    }

    render() {
        if (this.state.editMode) {
            return this.props.editComponent;
        }
        else {
            return this.props.viewComponent;
        }

    }
}

export default ViewEdit;

