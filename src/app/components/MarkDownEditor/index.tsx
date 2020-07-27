import * as React from "react";
import * as MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import FileUpload from "../FileUpload";

interface MarkDownEditorState {
    value: string
}

interface MarkDownEditorProps {
    value?: string;
    onChange(text: string): void;
    height?: string;
}

export default class MarkDownEditor extends React.Component<MarkDownEditorProps, MarkDownEditorState> {

    private mdParser: MarkdownIt;

    constructor(props: MarkDownEditorProps) {
        super(props);
        this.mdParser = new MarkdownIt();
        this.state = { value: props.value || "" };
    }

    componentDidUpdate(prevPropse: MarkDownEditorProps) {
        if (this.props.value !== prevPropse.value) {
            this.setState({
                value: this.props.value || ""
            });
        }
    }

    handleEditorChange(data: any) {
        this.setState({ value: data.text })
        this.props.onChange(data.text);
    }

    onFileUploaded(url: string): void {
        this.setState({
            value: (this.state.value || "") + "\n" + url
        });
        this.props.onChange(this.state.value);

    }

    render() {
        return (
            <div>
                <MdEditor style={this.props.height ? { height: this.props.height } : undefined} config={{ view: { html: false, fullScreen: false, md: true, menu: true } }
                } renderHTML={(text) => this.mdParser.render(text)} name="description" value={this.state.value} onChange={this.handleEditorChange.bind(this)} />
                <FileUpload onFileUploaded={this.onFileUploaded.bind(this)}></FileUpload>
            </div>
        );
    }
}