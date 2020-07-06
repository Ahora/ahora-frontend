import * as React from 'react';
import { DashboardGadgetConfiguration } from 'app/sdk/DashboardGadgets';
import DropdownButton from 'react-bootstrap/DropdownButton';
import AhoraSDK from 'app/sdk';
import Dropdown from 'react-bootstrap/Dropdown';

interface GroupBySelectState {
    gadgets?: Map<string, DashboardGadgetConfiguration>;
}

interface Props {
    onSelect: (gadgetType: string) => void;
}

class AddGadgetButton extends React.Component<Props, GroupBySelectState> {
    constructor(props: Props) {
        super(props);

        this.state = {};
    }

    componentDidMount() {
        this.setState({
            gadgets: AhoraSDK.getInstance().dashboardGadgets.getAllGadgets()
        });
    }

    onClick(gadgetType: string) {
        this.props.onSelect(gadgetType);

    }


    render() {
        return (
            <DropdownButton id={`add-gadget-button`} title="Add gadget">
                {
                    this.state.gadgets &&
                    <>
                        {[...this.state.gadgets.keys()].map((key) => {
                            const currentGadget: DashboardGadgetConfiguration = this.state.gadgets!.get(key)!;
                            return <Dropdown.Item key={key} onClick={this.onClick.bind(this, key)}>{currentGadget.title}</Dropdown.Item>
                        })}
                    </>
                }
            </DropdownButton>
        );
    }
}

export default AddGadgetButton;