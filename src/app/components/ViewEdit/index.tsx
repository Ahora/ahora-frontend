import * as React from 'react';
import AhoraSpinner from '../Forms/Basics/Spinner';

interface Props {
    onUpdate(value: any): Promise<void>;
    viewComponent: React.ComponentType<any>;
    editComponent: any & { onUpdate: (value?: any) => void };
    canEdit?: boolean;
}

interface State {
    editMode: boolean;
    loading: boolean;
}

class ViewEdit extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            editMode: false,
            loading: false,
        }
    }

    onClick() {
        this.setState({
            editMode: true
        })
    }

    async onUpdate(value?: any) {
        this.setState({
            loading: true
        });
        await this.props.onUpdate(value);
        this.setState({
            loading: false,
            editMode: false,
        });
    }

    render() {
        const ViewComponent = this.props.viewComponent;
        const EditComponent = this.props.editComponent;
        if (this.state.loading) {

            return <AhoraSpinner inline={true} />

        } else if (this.state.editMode) {
            return <EditComponent onUpdate={this.onUpdate.bind(this)}></EditComponent>;
        }
        else {
            if (this.props.canEdit) {
                return <div onClick={this.onClick.bind(this)}>
                    <ViewComponent></ViewComponent>
                </div>;
            }
            else {
                return <ViewComponent></ViewComponent>;
            }

        }

    }
}

export default ViewEdit;

