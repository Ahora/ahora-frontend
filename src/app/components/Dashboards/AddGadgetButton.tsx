import * as React from 'react';
import { DashboardGadgetConfiguration } from 'app/sdk/DashboardGadgets';
import AhoraSDK from 'app/sdk';
import { Menu, Dropdown, Button } from 'antd';

interface GroupBySelectState {
    gadgets?: Map<string, DashboardGadgetConfiguration>;
}

interface Props {
    onSelect: (gadgetType: string) => void;
}

export default class AddGadgetButton extends React.Component<Props, GroupBySelectState> {
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
        const menu = (

            this.state.gadgets ?
                <Menu>
                    {[...this.state.gadgets.keys()].map((key) => {
                        const currentGadget: DashboardGadgetConfiguration = this.state.gadgets!.get(key)!;
                        return <Menu.Item key={key} onClick={this.onClick.bind(this, key)}>
                            <Button type="text">{currentGadget.title}</Button></Menu.Item>
                    })}
                </Menu>
                : <></>
        );

        return (
            <Dropdown overlay={menu}><Button type="primary">Add gadget</Button></Dropdown>
        );
    }
}