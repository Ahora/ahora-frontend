import * as React from 'react';
import { AhoraFormField } from '../../AhoraForm/data';
import { checkOrgAvailability } from 'app/services/organizations';
import { Input } from 'antd';

interface GroupBySelectState {
    value: string;
    isValid: boolean;
    loading: boolean;
}

interface GroupBySelectStateProps {
    value?: string;
    fieldData: AhoraFormField;
    onUpdate: (value: string) => void;
}


class AhoraOrganizationUrlField extends React.Component<GroupBySelectStateProps, GroupBySelectState> {
    private setTimeoutInterval: any;
    constructor(props: GroupBySelectStateProps) {
        super(props);

        this.state = {
            loading: false,
            value: this.props.value || "",
            isValid: false
        };
    }


    async handleChange(event: any) {
        if (this.setTimeoutInterval) {
            clearInterval(this.setTimeoutInterval);
        }

        if (event.target.value.length > 0) {
            this.setState({ loading: true });
            this.setTimeoutInterval = setTimeout(async (value: string) => {
                if (value !== this.props.value) {

                    const isValid: boolean = await checkOrgAvailability(value);
                    this.setState({ value: value, isValid, loading: false });

                    if (isValid) {
                        this.props.onUpdate(value);
                    }
                }
                else {
                    this.setState({ value: value, isValid: true });

                }
            }, 500, event.target.value);
        }
        else {
            this.setState({ isValid: false, loading: false });
        }
    }

    render() {
        return <Input
            value={this.props.value}
            onChange={this.handleChange.bind(this)}
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