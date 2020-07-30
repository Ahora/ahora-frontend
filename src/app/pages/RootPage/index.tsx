import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { User } from 'app/services/users';
import { requestCurrentUserData } from 'app/store/currentuser/actions';
import { ApplicationState } from 'app/store';
import { Link } from 'react-router-dom';
import { Organization, getOrganizations } from 'app/services/organizations';
import { Card, Button, Typography } from 'antd';
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

        <div className="main">
          <Typography.Title>Ahora! Enhance your community.</Typography.Title>
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
                      <Link to="/organizations"><Button type="primary">Continue to Organizations</Button></Link> :
                      <Link to="/organizations/add"><Button type="primary">Create Organization</Button></Link>
                    }
                  </> :
                  <Button type="primary" href="/auth/github">Login with GitHub</Button>
                }
              </>
            }
          </p>
        </div>

        <div className="main">
          <div className="row">
            <div className="col-md-4">
              <Card title="Visualize your GitHub content">
                <div className="icon">
                  <i className="fab fa-github"></i>
                </div>
                    Utilize smart graphs to display <br />Issues and Pull Requests
              </Card>
            </div>
            <div className="col-md-4">
              <Card title="Aggregate multiple repositories">
                <div className="icon">
                  <i className="fas fa-code-branch"></i>
                </div>
                    Manage your cross organization's repositories in a single place
              </Card>
            </div>
            <div className="col-md-4">
              <Card title="Advanced team support">
                <div className="icon">
                  <i className="fas fa-user-friends"></i>
                </div>
                      Search issues by specific team<br />
                      Visualize content by teams<br />
              </Card>
            </div>
            <div className="col-md-4">
              <Card title="Discussions">
                <div className="icon">
                  <i className="far fa-comments"></i>
                </div>
                    Share ideas and feedback<br /> easily with others
              </Card>
            </div>
            <div className="col-md-4">
              <Card title="Free public repositories">
                <div className="icon">
                  <i className="fas fa-dollar-sign"></i>
                </div>
                    Use Ahora! free of cost <br /> for public repositories
              </Card>
            </div>
            <div className="col-md-4">
              <Card title="Open source">
                <div className="icon">
                  <i className="fab fa-git-square"></i>
                </div>
                    Ahora! will always be <a href="https://github.com/ahora">open source</a>
              </Card>
            </div>
            {
              false && <div className="col-md-4">
                <Card title="Notifications">
                  <div className="icon">
                    <i className="fas fa-bell"></i>
                  </div>
                    Custome and improved notifications <br />for Issues and Pull Requests
                </Card>
              </div>
            }
          </div>
        </div>
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