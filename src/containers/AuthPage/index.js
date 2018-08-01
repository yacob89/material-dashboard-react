/**
 *
 * AuthPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { findIndex, get, map, replace, set } from 'lodash';
import { Link } from 'react-router-dom';
import axios, { post } from "axios"

import Button from 'components/strapi/components/Button';
import Input from 'components/InputsIndex';
import Logo from 'assets/img/mapidlogo.png';
import SocialLink from 'components/strapi/components/SocialLink';

// Utils
import auth from 'utils/auth';
import request from 'utils/request';

import form from './forms.json';
import './styles.css';

//const SERVER_URL = 'http://54.245.202.137:1337';
const SERVER_URL = 'http://192.168.1.12:1337';

var requestType = 'login';
// This to determine what kind of request

class AuthPage extends React.Component {
  state = { value: {}, errors: [], didCheckErrors: false };

  componentDidMount() {
    this.generateForm(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.authType !== this.props.match.params.authType) {
      this.generateForm(nextProps);
    }
  }

  getRequestURL = () => {
    let requestURL;

    switch (this.props.match.params.authType) {
      case 'login':
        requestURL = SERVER_URL+'/auth/local';
        requestType = 'login';
        break;
      case 'register':
        requestURL = SERVER_URL+'/auth/local/register';
        requestType = 'register';
        break;
      case 'reset-password':
        requestURL = SERVER_URL+'/auth/reset-password';
        break;
      case 'forgot-password':
        requestURL = SERVER_URL+'/auth/forgot-password';
        break;
      default:
    }

    return requestURL;
  };

  generateForm = props => {
    const params = props.location.search
      ? replace(props.location.search, '?code=', '')
      : props.match.params.id;
    this.setForm(props.match.params.authType, params);
  };

  handleChange = ({ target }) =>
    this.setState({
      value: { ...this.state.value, [target.name]: target.value },
    });

  handleSubmit = e => {
    e.preventDefault();
    const body = this.state.value;
    const requestURL = this.getRequestURL();

    // This line is required for the callback url to redirect your user to app
    if (this.props.match.params.authType === 'forgot-password') {
      set(body, 'url', 'http://54.245.202.137:3000/auth/reset-password');
    }

    request(requestURL, { method: 'POST', body: this.state.value })
      .then(response => {
        auth.setToken(response.jwt, body.rememberMe);
        auth.setUserInfo(response.user, body.rememberMe);

        /*if(requestType === 'register'){
          axios.post(SERVER_URL+':7555/api/deleteobject', {
            bucket: auth.getUserInfo().username,
            key: fileKey
          })
          .then(function (response) {
            console.log(response.data);
            if(response.data === 'success'){
              alert(fileKey+ ' Deleted!');
            }
          })
          .catch(function (error) {
            console.log(error);
            alert(error);
          });
        }*/

        this.redirectUser();
      })
      .catch(err => {
        // TODO handle errors for other views
        // This is just an example
        const errors = [
          { name: 'identifier', errors: [err.response.payload.message] },
        ];
        this.setState({ didCheckErrors: !this.state.didCheckErrors, errors });
        console.log("Pesan Error: ", err.response.payload.message);
      });
  };

  redirectUser = () => {
    this.props.history.push('/');
    /*axios.post('http://localhost:7555/createfolder', {
      username: auth.getUserInfo().username
    })
    .then(function (response) {
      console.log(response.data);
      if(response.data == 'success'){
        alert("Folder Created");
      }
    })
    .catch(function (error) {
      console.log(error);
      alert(error);
    });*/
  };

  /**
   * Function that allows to set the value to be modified
   * @param {String} formType the auth view type ex: login
   * @param {String} email    Optionnal
   */
  setForm = (formType, email) => {
    const value = get(form, ['data', formType], {});

    if (formType === 'reset-password') {
      set(value, 'code', email);
    }
    this.setState({ value });
  };

  /**
   * Check the URL's params to render the appropriate links
   * @return {Element} Returns navigation links
   */
  renderLink = () => {
    if (this.props.match.params.authType === 'login') {
      return (
        <div>
          <Link to="/auth/forgot-password">Forgot Password</Link>
          &nbsp;or&nbsp;
          <Link to="/auth/register">register</Link>
        </div>
      );
    }

    return (
      <div>
        <Link to="/auth/login">Ready to signin</Link>
      </div>
    );
  };

  render() {
    const divStyle =
      this.props.match.params.authType === 'register'
        ? { marginTop: '3.2rem' }
        : { marginTop: '.9rem' };
    const inputs = get(form, ['views', this.props.match.params.authType], []);
    const providers = []; // To remove a provider from the list just delete it from this array...

    /* Style */
    const mapBackgroundImage = { 
      backgroundImage: 'url("https://s3-us-west-2.amazonaws.com/geomapid-assets/img/login_bg.svg")', 
      backgroundSize: 'cover',
      overflow: 'hidden'
    };
    const mapidLogo = {
      width: '111px',
      height: '113px'
    };
    const mapidText = {
      width: '172px',
      height: '20px'
    };

    const mapidTextURL = 'https://s3-us-west-2.amazonaws.com/geomapid-assets/img/mapid_text.png';
    const mapidLogoURL = 'https://s3-us-west-2.amazonaws.com/geomapid-assets/img/mapid_logo.png';

    return (

      <div className="authPage" style ={ mapBackgroundImage }>
        <div className="wrapper">
          
          <div className="formContainer" style={divStyle}>
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12">
                <div><img src={mapidLogoURL} alt="logo" style={mapidLogo} /></div>
          <div><img src={mapidTextURL} alt="logo" style={mapidText} /></div>
                  {providers.map(provider => (
                    <SocialLink provider={provider} key={provider} />
                  ))}
                </div>
              </div>
              <form onSubmit={this.handleSubmit}>
                <div className="row" style={{ textAlign: 'start' }}>
                  {map(inputs, (input, key) => (
                    <Input
                      autoFocus={key === 0}
                      customBootstrapClass={get(input, 'customBootstrapClass')}
                      didCheckErrors={this.state.didCheckErrors}
                      errors={get(
                        this.state.errors,
                        [
                          findIndex(this.state.errors, ['name', input.name]),
                          'errors',
                        ],
                        []
                      )}
                      key={get(input, 'name')}
                      label={get(input, 'label')}
                      name={get(input, 'name')}
                      onChange={this.handleChange}
                      placeholder={get(input, 'placeholder')}
                      type={get(input, 'type')}
                      validations={{ required: true }}
                      value={get(this.state.value, get(input, 'name'), '')}
                    />
                  ))}
                  <div className="col-md-12 buttonContainer">
                    <Button
                      label="Submit"
                      style={{ width: '100%', textAlign:'center' }}
                      primary
                      type="submit"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="linkContainer">{this.renderLink()}</div>
          <span><p></p></span>
          <span><p>WE DEVELOP TECHNOLOGIES</p></span>
        </div>
      </div>
    );
  }
}

AuthPage.defaultProps = {};
AuthPage.propTypes = {
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default AuthPage;
