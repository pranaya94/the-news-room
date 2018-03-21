/*global FB*/

import React from 'react'
import { withRouter } from 'react-router'
import ListPage from './ListPage'
import { gql, graphql, compose } from 'react-apollo'
import { Link } from 'react-router-dom'

const FACEBOOK_APP_ID = '1873906809309902'
const FACEBOOK_API_VERSION = 'v2.10' // e.g. v2.10

class App extends React.Component {

  componentDidMount() {
    this._initializeFacebookSDK()
  }

  _initializeFacebookSDK() {
    window.fbAsyncInit = function() {
      FB.init({
        appId      : FACEBOOK_APP_ID,
        cookie     : true,  // enable cookies to allow the server to access the session
        version    : FACEBOOK_API_VERSION // use Facebook API version 2.10
      });
    };

    // Load the SDK asynchronously
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  _handleFBLogin = () => {
    FB.login(response => {
      this._facebookCallback(response)
    }, {scope: 'public_profile,email'})
  }

  _facebookCallback = async facebookResponse => {
    if (facebookResponse.status === 'connected') {
      const facebookToken = facebookResponse.authResponse.accessToken
      const graphcoolResponse = await this.props.authenticateUserMutation({variables: { facebookToken }})
      const graphcoolToken = graphcoolResponse.data.authenticateUser.token
      localStorage.setItem('graphcoolToken', graphcoolToken)
      window.location.reload()
    } else {
      console.warn(`User did not authorize the Facebook application.`)
    } 
  }

  _isLoggedIn = () => {
    return this.props.data.loggedInUser && 
      this.props.data.loggedInUser.id && 
      this.props.data.loggedInUser.id !== ''
  }

  _logout = () => {
    localStorage.removeItem('graphcoolToken')
    window.location.reload()
  }


  render () {
    if (this._isLoggedIn()) {
      return this.renderLoggedIn()
    } else {
      return this.renderLoggedOut()
    }

  }

  renderLoggedIn() {
    return (
      <div>       
        <nav className="navbar navbar-inverse">
        <div className="container-fluid">
          <div className="navbar-header">
            <Link to ="/"><span className="navbar-brand">The News Room</span></Link>
          </div>           
          <button className='btn btn-primary navbar-btn' onClick={this._logout}>Logout</button>
          <Link to='/create'>
          <button className = "btn btn-success navbar-btn" style={{"float" : "right"}}>+ New Post</button>
          </Link>
        </div>
        </nav>
        <ListPage loggedInUser = {this.props.data.loggedInUser}/>        
      </div>
    )
  }

  

  renderLoggedOut() {
    return (
      <div>
          <nav className="navbar navbar-inverse">
                <div className="container-fluid">
                  <div className="navbar-header">
                    <Link to ="/"><span className="navbar-brand">The News Room</span></Link>
                  </div>                  
                  <button onClick={this._handleFBLogin} className='btn btn-primary navbar-btn'>Log in with Facebook</button>
                </div>
          </nav>              
            <ListPage loggedInUser = {this.props.data.loggedInUser}/>
      </div>
    )
  }
}

const LOGGED_IN_USER = gql`
  query LoggedInUser {
    loggedInUser {
      id
    }
  }
`

const AUTHENTICATE_FACEBOOK_USER = gql`
  mutation AuthenticateUserMutation($facebookToken: String!) {
    authenticateUser(facebookToken: $facebookToken) {
      token
    }
  }
`

export default compose(
  graphql(AUTHENTICATE_FACEBOOK_USER, { name: 'authenticateUserMutation' }),
  graphql(LOGGED_IN_USER, { options: { fetchPolicy: 'network-only'}})
) (withRouter(App))
