import * as React from 'react';
import AhoraSDK from 'app/sdk';
import { AhoraFormStateField, AhoraFormField } from './data';
import { Form, Button, Space } from 'antd';
import AhoraSpinner from '../Basics/Spinner';

interface AhoraFormState {
    form: any;
    error?: any;
    isSubmitting: boolean;
    fields: AhoraFormStateField[];
}

interface AhoraFormProps {
    data?: any;
    submitButtonText?: string;
    fields?: AhoraFormField[];
    showError?: (error: any) => React.ReactNode;
    onUpdate?: (data: any) => void;
    onSumbit: (data: any) => Promise<void>;
    onCancel?: () => void;
}


export default class AhoraForm extends React.Component<AhoraFormProps, AhoraFormState> {
    constructor(props: AhoraFormProps) {
        super(props);

        let fieldsFromChildren: any[] | null | undefined;
        if (React.Children.count(this.props.children) > 0) {
            fieldsFromChildren = React.Children.map(this.props.children, (fieldComponent: any) => {
                return this.convertField(fieldComponent.props);
            });
        }

        this.state = {
            form: { ...this.props.data } || {},
            isSubmitting: false,
            fields: fieldsFromChildren || (this.props.fields ? this.props.fields.map((field) => this.convertField(field)) : [])
        };


    }

    convertField(field: AhoraFormField): AhoraFormStateField {
        const instance = AhoraSDK.getInstance().formComponents.get(field.fieldType);
        return {
            ...field,
            instance
        };
    }

    async onSubmit(data: any) {
        this.setState({ isSubmitting: true, error: undefined });
        try {
            await this.props.onSumbit(this.state.form);
            this.setState({ isSubmitting: false });

        } catch (error) {
            this.setState({ isSubmitting: false, error });

        }
    }

    componentDidUpdate(prevProps: AhoraFormProps) {
        if (this.props.data !== prevProps.data) {
            this.setState({
                form: { ...this.props.data }
            });
        }
    }


    handleChange(fieldName: string, value: any) {
        const form = {
            ...this.state.form,
            [fieldName]: value
        };

        if (this.props.onUpdate) {
            this.props.onUpdate(form);
        }

        this.setState({ form });
    }

    cancel() {
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    }

    render() {
        return (
            <Form layout="vertical" initialValues={this.props.data} onFinish={this.onSubmit.bind(this)}>
                {this.state.fields.map((field) => {
                    return <Form.Item key={field.fieldName} name={field.fieldName} required={field.required} label={field.displayName}>
                        {
                            field.instance && React.createElement(field.instance, {
                                fieldData: field,
                                formData: this.state.form,
                                onUpdate: (value: any) => { this.handleChange(field.fieldName, value); },
                                value: this.state.form && this.state.form[field.fieldName]
                            })
                        }
                    </Form.Item>
                })}
                {this.state.error && <div>{this.props.showError ? this.props.showError(this.state.error) : <>Unexpected Error</>}</div>}
                <Space>
                    <Button disabled={this.state.isSubmitting} htmlType="submit" type="primary">
                        {
                            this.state.isSubmitting ?
                                <AhoraSpinner /> : <>{this.props.submitButtonText || "Send"}</>
                        }
                    </Button>
                    {this.props.onCancel && <Button danger onClick={this.cancel.bind(this)}>Cancel</Button>}
                </Space>

            </Form>
        );
    }
}