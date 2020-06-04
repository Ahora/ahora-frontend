import * as React from 'react';
import Container from "react-bootstrap/Container";
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { User } from 'app/services/users';
import Jumbotron from 'react-bootstrap/Jumbotron';
import { requestCurrentUserData } from 'app/store/currentuser/actions';
import { ApplicationState } from 'app/store';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
require('./styles.scss')

interface RootPageProps {
  currentUser: User | undefined;
}

interface DispatchProps {
  requestCurrentUser(): void;
}

interface AllProps extends RootPageProps, DispatchProps {

}

class RootPageComponent extends React.Component<AllProps> {
  render = () => {
    return (
      <>
        <Jumbotron>
          <Container>
            <h1>Ahora! Extend your community</h1>
            <p className="lead text-muted">
              Ahora! is a free open source to track multiple Github repositories.<br />
              Through multiple repositories, better manage your communities by putting your teams and collaboration at the center.
              </p>
            <p>
              {this.props.currentUser ?
                <Link to="/organizations"><Button variant="success">Continue to Organizations</Button></Link> :
                <Button variant="success" href="/auth/github">Login with GitHub</Button>
              }
            </p>
          </Container>
        </Jumbotron>

        <Container className="main">
          <Row>
            <div className="col-md-4">
              <Card>
                <Card.Header>Visualize your GitHub content</Card.Header>
                <Card.Body className="text-center">
                  <div className="icon">
                    <i className="fab fa-github"></i>
                  </div>
                  Utilize smart graphs to display <br />issues and pull requests                </Card.Body>
              </Card>
            </div>
            <div className="col-md-4">
              <Card>
                <Card.Header>Aggregate multiple repositories</Card.Header>
                <Card.Body className="text-center">
                  <div className="icon">
                    <i className="fas fa-code-branch"></i>
                  </div>
                  Manage your cross organization's repositories in a single place</Card.Body>
              </Card>
            </div>
            <div className="col-md-4">
              <Card>
                <Card.Header>Notifications</Card.Header>
                <Card.Body className="text-center">
                  <div className="icon">
                    <i className="fas fa-bell"></i>
                  </div>
                  Custome and improved notifications <br />for Issues and Pull Requests
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-4">
              <Card>
                <Card.Header>Discussions</Card.Header>
                <Card.Body className="text-center">
                  <div className="icon">
                    <i className="far fa-comments"></i>
                  </div>
                  Share ideas and feedback<br /> easily with others
                </Card.Body>
              </Card>
            </div>
            <div className="col-md-4">
              <Card>
                <Card.Header>Free public repositories</Card.Header>
                <Card.Body className="text-center">
                  <div className="icon">
                    <i className="fas fa-dollar-sign"></i>
                  </div>
                  Use Ahora! free of cost <br /> for public repositories
                  </Card.Body>
              </Card>
            </div>
            <div className="col-md-4">
              <Card>
                <Card.Header>Open source</Card.Header>
                <Card.Body className="text-center">
                  <div className="icon">
                    <i className="fab fa-git-square"></i>
                  </div>
                  Ahora! will always be open source</Card.Body>
              </Card>
            </div>
            {
              false && <div className="col-md-4">
                <Card>
                  <Card.Header>Advanced team support</Card.Header>
                  <Card.Body className="text-center">
                    <div className="icon">
                      <i className="fas fa-user-friends"></i>
                    </div>
                    Search issues by specific team<br />
                    Visualize dependencies between teams<br />
                  </Card.Body>
                </Card>
              </div>
            }

          </Row>
        </Container>
        <Jumbotron>
          <Container className="main">
            <h4>Explore Organizations</h4>
            <Row className="mt-4">
              <div className="col-md-6 text-center">
                <Link to="/organizations/kubernetes/dashboards/11"><img style={{ width: "80%" }} src="https://kubernetes.io/images/kubernetes-horizontal-color.png" /></Link>
              </div>
              <div className="col-md-6 text-center">
                <Link to="/organizations/openshiftdashboards/12"><img style={{ width: "80%" }} src="https://cdn.clipart.email/7720df34fc7a33defec737254b4b62e8_openshift-development-and-production-in-clouds-techboardio_1197-231.png" /></Link>
              </div>
            </Row>

          </Container>
        </Jumbotron>
      </>
    );
  };
}



const mapStateToProps = (state: ApplicationState): RootPageProps => {
  return {
    currentUser: state.currentUser.user
  };
};

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => {
  return {
    requestCurrentUser: () => dispatch(requestCurrentUserData())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RootPageComponent as any); 