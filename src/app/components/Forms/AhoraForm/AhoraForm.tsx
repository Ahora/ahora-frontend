import * as React from 'react';
import Form from 'react-bootstrap/Form';
import AhoraSDK from 'app/sdk';
import { AhoraFormStateField, AhoraFormField } from './data';
import Button from 'react-bootstrap/Button';

interface GroupBySelectState {
    form: any;
    fields: AhoraFormStateField[];
}

interface GroupBySelectStateProps {
    data?: any;
    submitButtonText?: string;
    fields: AhoraFormField[],
    onSumbit: (data: any) => void;
    onCancel?: () => void;
}


class AhoraForm extends React.Component<GroupBySelectStateProps, GroupBySelectState> {
    constructor(props: GroupBySelectStateProps) {
        super(props);

        this.state = {
            form: this.props.data,
            fields: this.props.fields.map((field) => this.convertField(field))
        };
    }

    convertField(field: AhoraFormField): AhoraFormStateField {
        const instance = AhoraSDK.getInstance().formComponents.get(field.fieldType);
        return {
            ...field,
            instance
        };
    }

    async onSubmit(event: any) {
        event!.preventDefault();
        this.props.onSumbit(this.state.form);
    }

    componentDidUpdate(prevProps: GroupBySelectStateProps) {
        if (this.props.data !== prevProps.data) {
            console.log("updated for with new state! someone changed it from outside!");
            this.setState({
                form: { ...this.props.data }
            });
        }
    }


    handleChange(fieldName: string, value: any) {
        this.setState({
            form: {
                ...this.state.form,
                [fieldName]: value
            }
        });
    }

    cancel() {
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    }

    render() {
        return (
            <Form onSubmit={this.onSubmit.bind(this)}>
                {this.state.fields.map((field) => {
                    return <Form.Group key={field.fieldName} controlId={field.fieldName}>
                        <Form.Label>{field.displayName}</Form.Label>
                        {
                            field.instance && React.createElement(field.instance, {
                                key: field.fieldName,
                                fieldData: field,
                                formData: this.state.form,
                                onUpdate: (value: any) => { this.handleChange(field.fieldName, value); },
                                value: this.state.form[field.fieldName]
                            })
                        }
                    </Form.Group>
                })}
                <Button type="submit">{this.props.submitButtonText || "Send"}</Button>
                {this.props.onCancel && <Button variant="danger" type="button" onClick={this.cancel.bind(this)}>Cancel</Button>}
            </Form>
        );
    }
}

export default AhoraForm;