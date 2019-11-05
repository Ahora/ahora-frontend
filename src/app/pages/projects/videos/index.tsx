import * as React from 'react';
import { Doc, getVideos } from 'app/services/videos';
import VideoList from 'app/components/VideoList';

interface VideosPageState {
    videos: Doc[];
}

export default class VideosPage extends React.Component<any, VideosPageState> {

    constructor(props: any) {
        super(props);
        this.state = {
            videos: []
        };
    }

    async componentDidMount() {
        const videos: Doc[] = await getVideos();
        this.setState({
            videos
        });
    }
    render = () => {
        return (
            <div>
                <h2>videos</h2>
                <VideoList videos={this.state.videos}></VideoList>
            </div>
        );
    };
}
