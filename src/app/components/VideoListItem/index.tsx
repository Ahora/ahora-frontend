import * as React from 'react';
import { VideoDoc } from 'app/services/videos';
import ListGroup from 'react-bootstrap/ListGroup';
import Media from 'react-bootstrap/Media';
import Badge from 'react-bootstrap/Badge';

interface VideoListItemProps {
    video: VideoDoc;
}


export default class VideoListItem extends React.Component<VideoListItemProps> {

    constructor(props: VideoListItemProps) {
        super(props);
        this.state = {
            video: null
        };
    }

    render = () => {
        const video = this.props.video;
        return (
            <ListGroup.Item key={video.id}>
                <Media>
                    <a href={`videos/${video.id}`}>
                        <img width={120}
                            height={90}
                            className="mr-3"
                            src={`https://img.youtube.com/vi/${video.metadata.youtubeId}/3.jpg`}
                            alt={`${video.subject}`}
                        /></a>
                    <Media.Body>
                        <h5><a href={`videos/${video.id}`}>{video.subject}</a></h5>
                        <p><a href={`videos/${video.id}`}>{video.description}</a></p>
                        <Badge variant="primary">sdsa</Badge>
                    </Media.Body>
                </Media>
            </ListGroup.Item>
        );
    };
}
