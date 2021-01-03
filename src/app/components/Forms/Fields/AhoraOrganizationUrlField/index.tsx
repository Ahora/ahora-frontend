import * as React from 'react';
import { AhoraFormField } from '../../AhoraForm/data';
import { checkOrgAvailability } from 'app/services/organizations';
import { Input } from 'antd';

import './style.scss';

interface GroupBySelectState {
    value: string;
    isValid: boolean;
    loading: boolean;
    rawValue: string;
}

interface LoginFieldProps {
    value?: string;
    fieldData: AhoraFormField;
    onChange: (value: string) => void;
}


class AhoraOrganizationUrlField extends React.Component<LoginFieldProps, GroupBySelectState> {
    private setTimeoutInterval: any;
    constructor(props: LoginFieldProps) {
        super(props);

        this.state = {
            loading: false,
            value: this.props.value || "",
            rawValue: this.props.value || "",
            isValid: false
        };
    }

    componentDidUpdate(prevProps: LoginFieldProps) {
        console.log(this.props.value);
        if (prevProps.value !== this.props.value && this.props.value != this.state.rawValue) {
            this.setState({ rawValue: this.props.value || "" });
        }
    }

    async checkOrgAvalability(value: string) {

        if (value && value.length > 0) {
            const isValid: boolean = await checkOrgAvailability(value);
            this.setState({ value: value, isValid, loading: false });

            if (isValid) {
                this.props.onChange(value);
            }
        }
        else {
            this.setState({ value: value, isValid: false, loading: false });
        }
    }

    async onBlur(event: any) {
        if (this.setTimeoutInterval) {
            clearInterval(this.setTimeoutInterval);
        }
        this.checkOrgAvalability(event.target.value);
    }


    async handleChange(event: any) {
        this.setState({ rawValue: event.target.value });

        if (this.setTimeoutInterval) {
            clearInterval(this.setTimeoutInterval);
        }

        if (event.target.value.length > 0) {
            this.setState({ loading: true });
            this.setTimeoutInterval = setTimeout(async (value: string) => {
                if (value !== this.props.value) {
                    this.checkOrgAvalability(value);
                }
                else {
                    this.setState({ value, isValid: true });

                }
            }, 500, event.target.value);
        }
        else {
            this.setState({ isValid: false, loading: false });
        }
    }

    render() {
        return <Input
            className="urlfield"
            defaultValue={this.props.value}
            value={this.state.rawValue}
            onChange={this.handleChange.bind(this)}
            onBlur={this.onBlur.bind(this)}
            required={this.props.fieldData.required}
            prefix={"https://ahora.dev/organizations/"}
            suffix={
                <>
                    {this.state.loading ?
                        <i className="fas fa-spinner"></i>
                        :
                        <>
                            {this.state.isValid ?
                                <i className="far fa-check-circle"></i> :
                                <i className="far fa-times-circle"></i>
                            }
                        </>}
                </>
            } />
    }
}

export default AhoraOrganizationUrlField;