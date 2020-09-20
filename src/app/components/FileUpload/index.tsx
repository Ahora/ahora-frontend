import * as React from 'react';
import './style.scss';
import { AttachmentUpload, AddAttachment, markUploaded } from 'app/services/attachments';
import { RestCollectorClient, RestCollectorRequest } from 'rest-collector';
import AhoraSpinner from '../Forms/Basics/Spinner';


const bucketUploader: RestCollectorClient = new RestCollectorClient(undefined, {
    decorateRequest: (req: RestCollectorRequest, bag?: File): void => {
        if (bag) {
            req.headers["Content-Type"] = bag.type
        }
    }
});


interface DragAndDropState {
    drag: boolean;
    showSpinner: boolean;
}

interface DragAndDropProps {
    multiple?: boolean;
    accept?: string;
    onFileUploaded(url: string): void;
}

class FileUpload extends React.Component<DragAndDropProps, DragAndDropState> {

    private dragCounter: number;
    private dropRef: React.RefObject<HTMLDivElement>;
    constructor(props: DragAndDropProps) {
        super(props);

        this.dragCounter = 0;
        this.state = {
            showSpinner: false,
            drag: false
        };

        this.dropRef = React.createRef()

    }

    async uploadFiles(files: FileList) {
        this.setState({ showSpinner: true });
        for (let index = 0; index < files.length; index++) {
            const file: File = files[index];

            const uploadInfo: AttachmentUpload = await AddAttachment({
                contentType: file.type,
                filename: file.name
            });
            await bucketUploader.put({
                url: uploadInfo.urlToUpload,
                data: file,
                bag: file
            });
            await markUploaded(uploadInfo.id)
            this.props.onFileUploaded(uploadInfo.viewUrl);
        }
        this.setState({ showSpinner: false });
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
            this.setState({ drag: true });
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
            this.uploadFiles(e.dataTransfer.files);
            e.dataTransfer.clearData()
            this.dragCounter = 0;

        }
    }

    onChange(event: any) {
        this.uploadFiles(event.target.files);
    }
    componentDidMount() {
        let div = this.dropRef.current!;
        div.addEventListener('dragenter', this.handleDragIn)
        div.addEventListener('dragleave', this.handleDragOut)
        div.addEventListener('dragover', this.handleDrag)
        div.addEventListener('drop', this.handleDrop)
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
            <div ref={this.dropRef}>
                <div className={this.state.drag ? "drop-area drag" : "drop-area"}>
                    {this.state.showSpinner ?
                        <AhoraSpinner /> :
                        <label htmlFor="fileElem">Upload multiple files by dragging and dropping images to here</label>}
                </div>
                <input type="file" id="fileElem" onChange={this.onChange.bind(this)} multiple={this.props.multiple} accept={this.props.accept} />
            </div>

        )
    }
}
export default FileUpload;