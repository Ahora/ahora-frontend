import * as React from 'react';
import { VideoDoc } from 'app/services/videos';
import ListGroup from 'react-bootstrap/ListGroup';
import VideoListItem from "./../VideoListItem";

interface VideoListProps {
    videos: VideoDoc[];
}


export default class VideoList extends React.Component<VideoListProps> {
    render = () => {
        return (
            <ListGroup>
                {this.props.videos.map(function (video, index) {
                    return (<VideoListItem key={video.id} video={video} ></VideoListItem>)
                })}
            </ListGroup>
        )
    };
}
