import { Col, Form, Input, Row, Switch } from 'antd';
import AhoraLabelsField from 'app/components/Forms/Fields/AhoraLabelsField';
import AhoraMarkdownField from 'app/components/Forms/Fields/AhoraMarkdownField';
import AhoraUsersField from 'app/components/Forms/Fields/AhoraUsersField';
import * as React from 'react';


interface State {
    isPrivate: boolean;
}
interface Props {

}

export default class AddDocForm extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isPrivate: false
        }
    }
    render() {
        return (
            <Form layout="horizontal">

                <Row>
                    <Col flex="auto">
                        <Form.Item name="subject" required>
                            <Input placeholder="Subject" />
                        </Form.Item>
                    </Col>
                    <Col style={{ margin: "0px 10px" }}>
                        <Form.Item name="isPrivate" label="Private">
                            <Switch onChange={(checked) => { this.setState({ isPrivate: checked }) }}></Switch>
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item name="description">
                    <AhoraMarkdownField value="" fieldData={{ displayName: "Description", fieldName: "dewcription", fieldType: "markdown" }}></AhoraMarkdownField>
                </Form.Item>
                <div>
                    <Form.Item>
                        <AhoraLabelsField></AhoraLabelsField>
                    </Form.Item>
                </div>
                {this.state.isPrivate &&
                    <div>
                        <label>Users:</label>
                        <Form.Item>
                            <AhoraUsersField></AhoraUsersField>
                        </Form.Item>
                    </div>
                }

            </Form>
        );
    }
}