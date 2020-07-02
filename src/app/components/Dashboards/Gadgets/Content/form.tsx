import * as React from 'react';
import DocsDateTimeGraphData from './data';
import Form from 'react-bootstrap/Form';
import AhoraContentGadgetData from './data';

interface DocsDateTimeGraphState {
    form: AhoraContentGadgetData;
}

interface DocsDateTimeGraphProps {
    data: AhoraContentGadgetData;
    onUpdate: (metadata: AhoraContentGadgetData) => void;
}

class AhoraContentForm extends React.Component<DocsDateTimeGraphProps, DocsDateTimeGraphState> {
    constructor(props: DocsDateTimeGraphProps) {
        super(props);

        this.state = {
            form: this.props.data
        };
    }

    handleChange(event: any) {
        const form = {
            ...this.state.form,
            content: event.target.value
        };
        this.setState({ form });
        this.update(form);
    }

    update(form: DocsDateTimeGraphData) {
        this.props.onUpdate(form);
    }

    render() {
        return (
            <>
                <Form.Group>
                    <Form.Label>content:</Form.Label>
                    <Form.Control rows="10" as="textarea" required={true} type="text" value={this.state.form.content} onChange={this.handleChange.bind(this)} />
                </Form.Group>
            </>
        );
    }
}

export default AhoraContentForm;