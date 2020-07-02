import * as React from 'react';
import Form from 'react-bootstrap/Form';
import { AhoraFormField } from '../../AhoraForm/data';
import InputGroup from 'react-bootstrap/InputGroup';
import { checkOrgAvailability } from 'app/services/organizations';

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
        return (
            <InputGroup>
                <InputGroup.Prepend>
                    <InputGroup.Text id="inputGroupPrepend">https://ahora.dev/organizations/</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control required={this.props.fieldData.required} type="text" onChange={this.handleChange.bind(this)} />
                <InputGroup.Append>
                    <InputGroup.Text>
                        {this.state.loading ?
                            <i className="fas fa-spinner"></i>
                            :
                            <>
                                {this.state.isValid ?
                                    <i className="far fa-check-circle"></i> :
                                    <i className="far fa-times-circle"></i>
                                }
                            </>}
                    </InputGroup.Text>
                </InputGroup.Append>
            </InputGroup>

        );
    }
}

export default AhoraOrganizationUrlField;