import * as React from 'react';
import MarkDownEditor from '../MarkDownEditor';
import './style.scss';
import AhoraSpinner from '../Forms/Basics/Spinner';
import { Button } from 'antd';

interface EditableMarkDownParams {
    value: string;
    canEdit: boolean;
    onChanged(value: string): Promise<void>;
}

interface EditableMarkDownState {
    value: string;
    editMode: boolean;
    updating: boolean;
}

export default class EditableMarkDown extends React.Component<EditableMarkDownParams, EditableMarkDownState> {

    constructor(props: EditableMarkDownParams) {
        super(props);
        this.state = {
            value: props.value,
            editMode: false,
            updating: false
        };
    }

    startEdit(event: any) {
        if (event.target.tagName !== "VIDEO") {
            this.setState({
                editMode: true
            });
        }
    }

    cancel() {
        this.setState({
            editMode: false,
            value: this.props.value
        });
    }

    async close() {
        this.setState({
            editMode: false,
            updating: true
        });
        await this.props.onChanged(this.state.value);
        this.setState({
            updating: false
        });
    }

    valueChanged(value: string) {
        this.setState({ value });
    }

    render() {
        return (
            <>
                {this.state.editMode ?
                    <>
                        <MarkDownEditor height="400px" value={this.state.value} onChange={this.valueChanged.bind(this)} />
                        <Button type="primary" onClick={this.close.bind(this)}>Save</Button>
                        <Button danger onClick={this.cancel.bind(this)}>Cancel</Button>
                    </>
                    :
                    <>
                        {this.state.updating ?
                            <AhoraSpinner /> :
                            <div className="editablemarkdown">
                                <div>
                                    {this.props.children}
                                    {this.props.canEdit &&
                                        <Button className="editbutton" onClick={this.startEdit.bind(this)}>
                                            <span className="fa fa-edit"></span>
                                        </Button>
                                    }
                                </div>
                            </div>
                        }
                    </>
                }
            </>
        )
    }
}