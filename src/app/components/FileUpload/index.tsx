import * as React from 'react';
import './style.scss';

interface DragAndDropState {
    drag: boolean;
    dragging: boolean;
}

interface DragAndDropProps {
    multiple?: boolean;
    accept?: string;
}

class FileUpload extends React.Component<DragAndDropProps, DragAndDropState> {

    private dragCounter: number;
    private dropRef: React.RefObject<HTMLDivElement>;
    constructor(props: DragAndDropProps) {
        super(props);

        this.dragCounter = 0;
        this.state = {
            dragging: true,
            drag: false
        };

        this.dropRef = React.createRef()

    }

    handleDrag = (e: any) => {
        e.preventDefault()
        e.stopPropagation()
    }
    handleDragIn = (e: any) => {
        e.preventDefault()
        e.stopPropagation()
        this.dragCounter++
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            this.setState({ drag: true })
        }
    }
    handleDragOut = (e: any) => {
        e.preventDefault()
        e.stopPropagation()
        this.dragCounter--
        if (this.dragCounter === 0) {
            this.setState({ drag: false })
        }
    }
    handleDrop = (e: any) => {
        e.preventDefault()
        e.stopPropagation()
        this.setState({ drag: false })
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            console.log(e.dataTransfer.files);
            //this.props.handleDrop(e.dataTransfer.files)
            e.dataTransfer.clearData()
            this.dragCounter = 0
        }
    }

    onChange(event: React.ChangeEvent<HTMLInputElement>) {
        console.log(event);

    }
    componentDidMount() {
        /*let div = this.dropRef.current!;
        div.addEventListener('dragenter', this.handleDragIn)
        div.addEventListener('dragleave', this.handleDragOut)
        div.addEventListener('dragover', this.handleDrag)
        div.addEventListener('drop', this.handleDrop)
        */
    }
    componentWillUnmount() {
        let div = this.dropRef.current!;
        div.removeEventListener('dragenter', this.handleDragIn)
        div.removeEventListener('dragleave', this.handleDragOut)
        div.removeEventListener('dragover', this.handleDrag)
        div.removeEventListener('drop', this.handleDrop)
    }
    render() {
        return (
            <div id="drop-area">
                <form className="my-form">
                    <p>Upload multiple files with the file dialog or by dragging and dropping images onto the dashed region</p>
                    <input type="file" id="fileElem" onChange={this.onChange.bind(this)} multiple={this.props.multiple} accept={this.props.accept} />
                    <label className="button" htmlFor="fileElem">Select some files</label>
                </form>
            </div>
        )
    }
}
export default FileUpload;