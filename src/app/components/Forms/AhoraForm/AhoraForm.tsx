import * as React from 'react';
import AhoraSDK from 'app/sdk';
import { AhoraFormStateField, AhoraFormField } from './data';
import { Form, Button, Space } from 'antd';
import AhoraSpinner from '../Basics/Spinner';
import { FormattedMessage } from 'react-intl';

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

    private formRef: React.RefObject<any>;


    constructor(props: AhoraFormProps) {
        super(props);

        let fieldsFromChildren: any[] | null | undefined;
        if (React.Children.count(this.props.children) > 0) {
            fieldsFromChildren = React.Children.map(this.props.children, (fieldComponent: any) => {
                return this.convertField(fieldComponent.props);
            });
        }

        this.formRef = React.createRef();


        this.state = {
            form: { ...this.props.data },
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
            this.setState({ isSubmitting: false, form: this.props.data ? { ...this.props.data } : {} });

        } catch (error) {
            this.setState({ isSubmitting: false, error });

        }
    }

    componentDidUpdate(prevProps: AhoraFormProps) {
        if (this.props.data !== prevProps.data) {
            this.formRef.current.initialValue = this.props.data;
            this.formRef.current.resetFields();
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
            <Form ref={this.formRef} onValuesChange={this.onValuesChange.bind(this)} layout={this.props.layout || "vertical"} initialValues={this.props.data} onFinish={this.onSubmit.bind(this)}>
                {this.state.fields.map((field) => {
                    return <Form.Item style={{ minWidth: "150px" }} key={field.fieldName} name={field.fieldName} rules={[{ required: field.required, message: `required` }]} label={field.displayName}>
                        <field.instance fieldData={field} formData={this.state.form}></field.instance>
                    </Form.Item>
                }
                )}
                {this.state.error && <div>{this.props.showError ? this.props.showError(this.state.error) : <>Unexpected Error</>}</div>}
                {
                    this.props.hideButtons !== true &&
                    <Space>
                        <Button disabled={this.state.isSubmitting} htmlType="submit" type="primary">
                            {
                                this.state.isSubmitting ?
                                    <AhoraSpinner /> : <>{this.props.submitButtonText || <FormattedMessage id="ahoraFormSubmitText" />}</>
                            }
                        </Button>
                        {this.props.onCancel && <Button danger onClick={this.cancel.bind(this)}><FormattedMessage id="cancelButtonText" /></Button>}
                    </Space>
                }

            </Form>
        );
    }
}