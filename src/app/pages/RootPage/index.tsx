import * as React from 'react';
import Button from 'react-bootstrap/Button';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { User } from 'app/services/users';
import { requestCurrentUserData } from 'app/store/currentuser/actions';
import { ApplicationState } from 'app/store';
import { Link } from 'react-router-dom';
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
      <div className="main">
        <div className="columns is-vcentered">
          <div className="column is-5 is-offset-1 landing-caption">
            <h1 className="title is-1 is-bold is-spaced">Open source is easy</h1>
            <p className="subtitle is-5 is-muted">
              Manage your open sources projects easily with Ahora.dev
            </p>
            <p>
              {this.props.currentUser ?
                <Link to="/organizations"><Button variant="success">Continue to Organizations</Button></Link> :
                <Button variant="success" href="/auth/github">Login with GitHub</Button>
              }
            </p>
          </div>
          <div className="column is-5 is-offset-1">
            <figure className="image is-4by3">
              <img src="/assets/images/worker.svg" alt="Description" />
            </figure>
          </div>
        </div>
      </div>);
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