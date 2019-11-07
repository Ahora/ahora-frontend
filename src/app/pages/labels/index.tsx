import * as React from 'react';
import { Label, getLabels } from 'app/services/labels';

interface LabelsPageState {
    labels: Label[];
}

export default class LabelsPage extends React.Component<any, LabelsPageState> {

    constructor(props: any) {
        super(props);
        this.state = {
            labels: []
        };
    }

    async componentDidMount() {
        const labels: Label[] = await getLabels(1);
        this.setState({
            labels
        });
    }
    render = () => {
        return (
            <div>
                <h2>Labels</h2>
            </div>
        );
    };
}
