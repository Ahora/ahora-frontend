import * as React from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

interface EditableHeaderParams {
    value?: string;
    canEdit: boolean;
    onChanged(value?: string): void;
}

interface EditableHeaderState {
    value?: string;
    editMode: boolean;
}

export default class EditableHeader extends React.Component<EditableHeaderParams, EditableHeaderState> {
    constructor(props: EditableHeaderParams) {
        super(props);
        this.state = {
            value: props.value,
            editMode: false
        };
    }

    startEdit() {
        this.setState({
            editMode: true
        });
    }

    onSubmit() {
        if (this.state.editMode) {
            this.props.onChanged(this.state.value);

            this.setState({
                editMode: false
            });
        }
    }

    cancel() {
        this.setState({
            editMode: false,
            value: this.props.value
        });
    }

    valueChanged(event: any) {
        this.setState({ value: event.target.value });
    }

    render() {
        return (
            <>
                {this.state.editMode ?
                    <InputGroup>
                        <Form.Control value={this.state.value} onChange={this.valueChanged.bind(this)} placeholder="Enter team name" />
                        <InputGroup.Append>
                            <Button type="submit" onClick={this.onSubmit.bind(this)} variant="primary"><span className="fa fa-check"></span></Button>
                            <Button onClick={this.cancel.bind(this)} type="button" variant="danger"><span className="fa fa-times-circle"></span></Button>
                        </InputGroup.Append>
                    </InputGroup>
                    :
                    (<>{this.props.canEdit ?
                        <div onClick={this.startEdit.bind(this)}>{this.props.children}</div> :
                        <div>{this.props.children}</div>}
                    </>)
                }
            </>
        )
    }
}