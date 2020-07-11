
import * as React from 'react';
import Button from 'react-bootstrap/Button';
import { getPaymentToken, PaymentFormDetails, PaymentData } from 'app/services/payments';

interface PaymentFormProps {
    submitted: (data: PaymentData) => void;
}

interface PaymentFormState {
    cardUrl: string;
    token?: string;
    cardHolderName?: string;
}

var cardUrl: any = {
    "AMEX": "https://files.readme.io/97e7acc-Amex.png",
    "CarteBleau": "https://files.readme.io/5da1081-cb.png",
    "DinersClub": "https://files.readme.io/8c73810-Diners_Club.png",
    "Discover": "https://files.readme.io/caea86d-Discover.png",
    "JCB": "https://files.readme.io/e076aed-JCB.png",
    "MaestroUK": "https://files.readme.io/daeabbd-Maestro.png",
    "MasterCard": "https://files.readme.io/5b7b3de-Mastercard.png",
    "Solo": "https://sandbox.bluesnap.com/services/hosted-payment-fields/cc-types/solo.png",
    "Visa": "https://files.readme.io/9018c4f-Visa.png"
};

const bluesnap: any = (window as any).bluesnap;
export default class PaymentForm extends React.Component<PaymentFormProps, PaymentFormState> {
    constructor(props: PaymentFormProps) {
        super(props);

        this.state = {
            cardUrl: "https://files.readme.io/d1a25b4-generic-card.png"
        }
    }

    async componentDidMount() {
        const self = this;

        const paymentFormDetails: PaymentFormDetails = await getPaymentToken();
        this.setState({ token: paymentFormDetails.token });
        var bsObj = {
            token: paymentFormDetails.token,
            onFieldEventHandler: {
                // tagId returns: "ccn", "cvv", "exp" 
                onFocus: (tagId: any) => { }, // Handle focus
                onBlur: (tagId: any) => { }, // Handle blur 
                onError: (tagId: any, errorCode: any /*, errorDescription*/) => {
                    console.log(tagId, errorCode);
                },
                /*errorCode returns:
                    "10" --> invalidCcNumber, invalidExpDate, invalidCvv Dependent on the tagId;
                    "22013" --> "CC type is not supported by the merchant"; 
                    "14040" --> " Token is expired";
                    "14041" --> " Could not find token";
                    "14042" --> " Token is not associated with a payment method, please verify your client integration or contact BlueSnap support";
                    "400" --> "Session expired please refresh page to continue";
                    "403", "404", "500" --> "Internal server error please try again later"; 
                */

                /* errorDescription is optional. Returns BlueSnap's standard error description */

                onType: function (tagId: any, cardType: any  /*, cardData*/) {
                    self.setState({
                        cardUrl: cardUrl[cardType]
                    })
                },

                onValid: function (tagId: any,) {

                }, // Handle a change in validation
            },
            /* example:
                style: {
                "Selector": {
                "Property": "Value",
                "Property2": "Value2"
                },                                                                                                                                                             
                "Selector2": {
                "Property": "Value"
                } 
            }, */
            style: {
                // Styling all inputs
                "input": {
                    "font-size": "14px",
                    "font-family":
                        "RobotoDraft,Roboto,Helvetica Neue,Helvetica,Arial,sans-serif",
                    "line-height": "1.42857143",
                    "color": "#555"
                },
                // Styling input state
                ":focus": {
                    "color": "#555"
                }
            },
            ccnPlaceHolder: "1234 5678 9012 3456", //for example
            cvvPlaceHolder: "123", //for example
            expPlaceHolder: "MM/YY" //for example
        };

        //Run the following command after Document Object Model (DOM) is fully loaded 
        bluesnap.hostedPaymentFieldsCreate(bsObj);
    }


    async onSubmit(event: any) {
        event!.preventDefault();
        bluesnap.hostedPaymentFieldsSubmitData((callback: any) => {
            if (null != callback.cardData) {
                this.props.submitted({
                    ...callback.cardData,
                    token: this.state.token,
                    cardHolderName: this.state.cardHolderName
                });
            } else {
                var errorArray = callback.error;
                for (const i in errorArray) {
                    console.log("Received error: tagId= " +
                        errorArray[i].tagId + ", errorCode= " +
                        errorArray[i].errorCode + ", errorDescription= " +
                        errorArray[i].errorDescription);
                }
            }
        });
    }

    onCardHolderNameChanged(event: any) {
        this.setState({ cardHolderName: event.target.value });
    }

    render() {
        return (<form className="panel-body" id="checkout-form" onSubmit={this.onSubmit.bind(this)}>
            <div className="row">
                <div className="form-group col-md-12">
                    <label>Cardholder Name</label>
                    <input type="text" required={true} onChange={this.onCardHolderNameChanged.bind(this)} className="form-control" />
                    <span className="helper-text"></span>
                </div>
                <div className="form-group col-md-9">
                    <label>Card Number</label>
                    <div className="input-group">
                        <div className="form-control" id="card-number" data-bluesnap="ccn"></div>
                        <div className="input-group-append">
                            <span className="input-group-text">
                                <img src={this.state.cardUrl} height="20px" />
                            </span>

                        </div>
                    </div>
                    <span className="helper-text" id="ccn-help"></span>
                </div>
                <div className="form-group col-md-3">
                    <label>CVV</label>
                    <div className="form-control" id="cvv" data-bluesnap="cvv"></div>
                    <span className="helper-text" id="cvv-help"></span>
                </div>

                <div className="form-group col-md-6">
                    <label>Exp. (MM/YY)</label>
                    <div className="form-control" id="exp-date" data-bluesnap="exp"></div>
                    <span className="helper-text" id="exp-help"></span>
                </div>
            </div>
            <Button type="submit">Save payment details</Button>

        </form>);


    };
}