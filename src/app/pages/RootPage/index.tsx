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
import { Organization, getOrganizations } from 'app/services/organizations';
require('./styles.scss')

interface RootPageProps {
  currentUser: User | undefined;
}

interface State {
  organizations?: Organization[];
}

interface DispatchProps {
  requestCurrentUser(): void;
}

interface AllProps extends RootPageProps, DispatchProps {

}

class RootPageComponent extends React.Component<AllProps, State> {

  constructor(props: any) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    const organizations: Organization[] = await getOrganizations();
    this.setState({ organizations });
  }

  render = () => {
    return (
      <>

        <Jumbotron>
          <Container>
            <h1>Ahora! Enhance your community.</h1>
            <p className="lead text-muted">
              Ahora! is a free, open source public repository solution. <br />Provides you tools to better manage repositories, putting communication and collaboration at the center of your organization.
                </p>
            <p>
              {
                this.state.organizations &&
                <>
                  {this.props.currentUser ?
                    <>
                      {(this.state.organizations.length > 0) ?
                        <Link to="/organizations"><Button variant="success">Continue to Organizations</Button></Link> :
                        <Link to="/organizations/add"><Button variant="primary">Create Organization</Button></Link>
                      }
                    </> :
                    <Button variant="success" href="/auth/github">Login with GitHub</Button>
                  }
                </>
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
                    Utilize smart graphs to display <br />Issues and Pull Requests
                  </Card.Body>
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