import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import PaymentForm from 'app/components/payments/paymentForm';
import { PaymentData, getOrgPaymentData, setOrgPaymentData } from 'app/services/payments';
import { ApplicationState } from 'app/store';
import { connect } from 'react-redux';
import { Organization, OrganizationType } from 'app/services/organizations';
import PaymentMethod from 'app/components/payments/paymentMethod';

interface DashboardsPageState {
    paymentInfoReceived: boolean;
    paymentInfo: PaymentData | undefined | null;
}

interface DashboardsPageParams {
    login: string;
}

interface ReduxProps {
    organization?: Organization;
}

interface DashboardsPageProps extends RouteComponentProps<DashboardsPageParams> {

}

interface AllProps extends DashboardsPageProps, ReduxProps {

}

class PaymentPage extends React.Component<AllProps, DashboardsPageState> {
    constructor(props: AllProps) {
        super(props);
        this.state = {
            paymentInfoReceived: false,
            paymentInfo: undefined
        }
    }

    async componentDidMount() {
        const paymentInfo = await getOrgPaymentData();
        this.setState({ paymentInfo });
    }

    componentDidUpdate(prevProps: AllProps) {
        if (this.props.organization !== prevProps.organization) {
            if (this.props.organization) {
                this.setState({ paymentInfoReceived: this.props.organization.hasPayment });
            }
            else {
                this.setState({ paymentInfoReceived: false });
            }
        }
    }

    async onPaymentDataReceived(paymentInfo: PaymentData) {
        await setOrgPaymentData(paymentInfo);
        this.setState({
            paymentInfoReceived: true,
            paymentInfo
        })
    }

    render() {
        return (
            <div>
                {
                    this.props.organization!.orgType === OrganizationType.Private ?
                        <>
                            <p>You organization is Private, you will be billed monthly with 10$ per user.</p>
                            {
                                this.state.paymentInfo &&
                                <div>
                                    <p>Current payment method.</p>
                                    <PaymentMethod data={this.state.paymentInfo} />
                                </div>
                            }

                            <div>
                                {this.state.paymentInfo ?
                                    <h3>Replace mayment method</h3>
                                    :
                                    <h3>Add payment method</h3>
                                }
                                <PaymentForm submitted={this.onPaymentDataReceived.bind(this)}></PaymentForm>
                            </div>
                        </>
                        :
                        <p>
                            Your organization is public. Ahora will be always free for public/open source organization.
                        </p>
                }
            </div>

        );
    };
}

const mapStateToProps = (state: ApplicationState): ReduxProps => {
    return {
        organization: state.organizations.currentOrganization
    };
};

export default connect(mapStateToProps)(PaymentPage as any);