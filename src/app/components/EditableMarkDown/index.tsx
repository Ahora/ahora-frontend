import * as React from 'react';
import './style.scss';
import AhoraSpinner from '../Forms/Basics/Spinner';
import { Button } from 'antd';
import AhoraForm from '../Forms/AhoraForm/AhoraForm';
import AhoraField from '../Forms/AhoraForm/AhoraField';

interface EditableMarkDownParams {
    value: string;
    canEdit: boolean;
    onChanged(value: string): Promise<void>;
}

interface EditableMarkDownState {
    value: string;
    editMode: boolean;
    updating: boolean;
}

export default class EditableMarkDown extends React.Component<EditableMarkDownParams, EditableMarkDownState> {

    constructor(props: EditableMarkDownParams) {
        super(props);
        this.state = {
            value: props.value,
            editMode: false,
            updating: false
        };
    }

    startEdit(event: any) {
        this.setState({
            editMode: true
        });
    }

    cancel() {
        this.setState({
            editMode: false,
            value: this.props.value
        });
    }

    async close(data: any) {
        this.setState({
            editMode: false,
            updating: true
        });
        await this.props.onChanged(data.description);
        this.setState({
            updating: false
        });
    }

    valueChanged(value: string) {
        this.setState({ value });
    }

    render() {
        return (
            <>
                {this.state.editMode ?
                    <>
                        <AhoraForm submitButtonText="Update" data={{ description: this.props.value }} onCancel={this.cancel.bind(this)} onSumbit={this.close.bind(this)}>
                            <AhoraField fieldType="markdown" fieldName="description" displayName=""></AhoraField>
                        </AhoraForm>
                    </>
                    :
                    <>
                        {this.state.updating ?
                            <AhoraSpinner /> :
                            <div className="editablemarkdown">
                                <div>
                                    {this.props.children}
                                    {this.props.canEdit &&
                                        <Button className="editbutton" onClick={this.startEdit.bind(this)}>
                                            <span className="fa fa-edit"></span>
                                        </Button>
                                    }
                                </div>
                            </div>
                        }
                    </>
                }
            </>
        )
    }
}