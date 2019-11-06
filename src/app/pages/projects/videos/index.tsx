import * as React from 'react';
import { Doc, getVideos } from 'app/services/videos';
import VideoList from 'app/components/VideoList';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

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
        <Form.Group controlId="validationCustomUsername">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="enter your search criteria"
              aria-describedby="inputGroupPrepend"
              required
            />
            <InputGroup.Append>
              <Button color="primary" variant="primary">Search</Button>
            </InputGroup.Append>
          </InputGroup>
        </Form.Group>
        <VideoList videos={this.state.videos}></VideoList>
      </div>
    );
  };
}
