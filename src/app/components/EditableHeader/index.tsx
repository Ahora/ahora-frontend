import * as React from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

interface EditableHeaderParams {
    value: string;
    onChanged(value: string): void;
}

interface EditableHeaderState {
    value: string;
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

    onSubmit(event: any) {
        this.props.onChanged(this.state.value);
        event.preventDefault();

        this.setState({
            editMode: false
        });
    }

    valueChanged(event: any) {
        this.setState({ value: event.target.value });
    }

    render() {
        return (
            <>
                {this.state.editMode ?
                    <Form onSubmit={this.onSubmit.bind(this)}>
                        <InputGroup>
                            <Form.Control onBlur={this.onSubmit.bind(this)} value={this.state.value} onChange={this.valueChanged.bind(this)} placeholder="Enter team name" />
                            <InputGroup.Append>
                                <Button type="submit" variant="primary"><span className="fa fa-check"></span></Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form>
                    :
                    (<div onClick={this.startEdit.bind(this)}>{this.props.children}</div>)
                }
            </>
        )
    }
}