import * as React from 'react';
import MarkDownEditor from '../MarkDownEditor';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import './style.scss';

interface EditableMarkDownParams {
    value: string;
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
                        <Button variant="primary" onClick={this.close.bind(this)} type="button">Save</Button>
                        <Button variant="danger" onClick={this.cancel.bind(this)} type="button">Cancel</Button>
                    </>
                    :
                    <>
                        {this.state.updating ?
                            <div className="text-center"><Spinner animation="border" variant="primary" /></div> :
                            <div className="editablemarkdown">
                                <div>
                                    {this.props.children}
                                    <Button className="editbutton" variant="outline-secondary" onClick={this.startEdit.bind(this)}>
                                        <span className="fa fa-edit"></span>
                                    </Button>
                                </div>
                            </div>
                        }
                    </>
                }
            </>
        )
    }
}