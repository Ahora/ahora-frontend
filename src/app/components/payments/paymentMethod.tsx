import { PaymentData } from "app/services/payments";
import * as React from 'react';
import Card from "react-bootstrap/Card";

interface PaymentMethodProps {
    data: PaymentData;
}


export default class PaymentMethod extends React.Component<PaymentMethodProps> {

    constructor(props: any) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Card className="mb-3" style={{ width: '18rem' }}>
                <Card.Header>
                    {this.props.data.ccType} - {this.props.data.last4Digits}
                </Card.Header>
                <Card.Body>
                    <div>Card Holder: {this.props.data.cardHolderName}</div>
                    <div>Expires: {this.props.data.exp}</div>
                </Card.Body>
            </Card>)
    }
}