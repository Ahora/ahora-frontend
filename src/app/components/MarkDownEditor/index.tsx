import * as React from "react";
import * as MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';


interface MarkDownEditorProps {
    value?: string;
    onChange(text: string): void;
}

export default class MarkDownEditor extends React.Component<MarkDownEditorProps> {

    private mdParser: MarkdownIt;

    constructor(props: MarkDownEditorProps) {
        super(props);
        this.mdParser = new MarkdownIt(/* Markdown-it options */)

    }

    handleEditorChange(data: any) {
        this.props.onChange(data.text);
    }

    render() {
        return (<MdEditor style={{ height: "200px" }} config={{ view: { html: false, fullScreen: false, md: true, menu: true } }
        } renderHTML={(text) => this.mdParser.render(text)} name="description" value={this.props.value || ""} onChange={this.handleEditorChange.bind(this)} />
        );
    }
}