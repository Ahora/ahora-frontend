import * as React from 'react';
import AhoraSDK from 'app/sdk';
import { AhoraFormStateField, AhoraFormField } from './data';
import { Form, Button, Space } from 'antd';
import AhoraSpinner from '../Basics/Spinner';

interface AhoraFormState {
    form: any;
    isSubmitting: boolean;
    fields: AhoraFormStateField[];
}

interface AhoraFormProps {
    data?: any;
    submitButtonText?: string;
    fields: AhoraFormField[],
    onSumbit: (data: any) => Promise<void>;
    onCancel?: () => void;
}


class AhoraForm extends React.Component<AhoraFormProps, AhoraFormState> {
    constructor(props: AhoraFormProps) {
        super(props);

        this.state = {
            form: this.props.data,
            isSubmitting: false,
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

    async onSubmit(data: any) {
        this.setState({ isSubmitting: true });
        await this.props.onSumbit(this.state.form);
        this.setState({ isSubmitting: false });
    }

    componentDidUpdate(prevProps: AhoraFormProps) {
        if (this.props.data !== prevProps.data) {
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
            <Form layout="vertical" onFinish={this.onSubmit.bind(this)}>
                {this.state.fields.map((field) => {
                    return <Form.Item key={field.fieldName} name={field.fieldName} required={field.required} label={field.displayName}>
                        {
                            field.instance && React.createElement(field.instance, {
                                key: field.fieldName,
                                fieldData: field,
                                formData: this.state.form,
                                onUpdate: (value: any) => { this.handleChange(field.fieldName, value); },
                                value: this.state.form[field.fieldName]
                            })
                        }
                    </Form.Item>
                })}
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

export default AhoraForm;