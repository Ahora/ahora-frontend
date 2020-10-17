import * as React from 'react';
import AhoraSDK from 'app/sdk';
import { AhoraFormStateField, AhoraFormField } from './data';
import { Form, Button, Space } from 'antd';
import AhoraSpinner from '../Basics/Spinner';

export declare type FormLayout = 'horizontal' | 'inline' | 'vertical';

interface AhoraFormState {
    form: any;
    error?: any;
    isSubmitting: boolean;
    fields: AhoraFormStateField[];
}

interface AhoraFormProps {
    data?: any;
    layout?: FormLayout;
    submitButtonText?: string | React.ReactNode;
    fields?: AhoraFormField[];
    hideButtons?: boolean;
    showError?: (error: any) => React.ReactNode;
    onUpdate?: (data: any) => void | any;
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

    onValuesChange(changedValues: any, allValues: any) {

        if (this.props.onUpdate) {
            const updatedFormData = this.props.onUpdate(allValues);
            if (updatedFormData) {
                allValues = updatedFormData;
            }
        }
        this.setState({ form: allValues });
    }

    cancel() {
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    }

    render() {
        return (
            <Form onValuesChange={this.onValuesChange.bind(this)} layout={this.props.layout || "vertical"} initialValues={this.props.data} onFinish={this.onSubmit.bind(this)}>
                {this.state.fields.map((field) => {
                    const Element = field.instance;
                    return <Form.Item key={field.fieldName} name={field.fieldName} rules={[{ required: field.required, message: `${field.displayName} is required` }]} label={field.displayName}>
                        <Element value={this.state.form && this.state.form[field.fieldName]} fieldData={field} formData={this.state.form}></Element>
                    </Form.Item>
                })}
                {this.state.error && <div>{this.props.showError ? this.props.showError(this.state.error) : <>Unexpected Error</>}</div>}
                {
                    this.props.hideButtons !== true &&
                    <Space>
                        <Button disabled={this.state.isSubmitting} htmlType="submit" type="primary">
                            {
                                this.state.isSubmitting ?
                                    <AhoraSpinner /> : <>{this.props.submitButtonText || "Send"}</>
                            }
                        </Button>
                        {this.props.onCancel && <Button danger onClick={this.cancel.bind(this)}>Cancel</Button>}
                    </Space>
                }

            </Form>
        );
    }
}