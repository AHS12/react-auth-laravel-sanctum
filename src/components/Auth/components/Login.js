import React from 'react';
import { Redirect } from 'react-router-dom';
import apiClient from '../../../coreServices/api';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';

const Login = (props) => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [toHome, setToHome] = React.useState(false);
    const [googleEmail, setGoogleEmail] = React.useState('');
    const [googleprovider, setGoogleProvider] = React.useState('');
    const [googleProviderId, setGoogleProviderId] = React.useState('');
    const [googleName, setGoogleName] = React.useState('');
    const [fbEmail, setFbEmail] = React.useState('');
    const [fbprovider, setFbProvider] = React.useState('');
    const [fbProviderId, setFbProviderId] = React.useState('');
    const [fbName, setFbName] = React.useState('');
    // const [loggingIn, setLoggingIn] = React.useState(false);
    const [authError, setAuthError] = React.useState(false);
    const [unknownError, setUnknownError] = React.useState(false);

    
    const handleSubmit = (e) => {
        e.preventDefault();
        setAuthError(false);
        //setLoggingIn(true);
        setUnknownError(false);
        apiClient.get('/sanctum/csrf-cookie')
            .then(response => {
                //console.log(response);
                apiClient.post('/login', {
                    email: email,
                    password: password
                }).then(response => {
                    if (response.status === 200) {
                        props.login();
                        setToHome(true);
                        //setLoggingIn(false);
                        console.log(response);
                    }
                }).catch(error => {

                    if (error.response && error.response.status === 422) {
                        setAuthError(true);
                        //setLoggingIn(false);
                    } else {
                        setUnknownError(true);
                        //setLoggingIn(false);
                        console.error(error);
                    }
                });
            });
    }

    const handleSocialLogin = (response) => {
        console.log(response)
        setGoogleEmail(response.profileObj.email);
        setGoogleName(response.profileObj.name);
        setGoogleProvider("google");
        setGoogleProviderId(response.profileObj.googleId);

        setAuthError(false);
        //setLoggingIn(true);
        setUnknownError(false);
        apiClient.get('/sanctum/csrf-cookie')
            .then(response => {
                //console.log(response);
                apiClient.post('/login/social', {
                    email: googleEmail,
                    name: googleName,
                    provider: googleprovider,
                    provider_id: googleProviderId
                }).then(response => {
                    if (response.status === 200) {
                        props.login();
                        setToHome(true);
                        //setLoggingIn(false);
                        console.log(response);
                    }
                }).catch(error => {

                    if (error.response && error.response.status === 422) {
                        setAuthError(true);
                        //setLoggingIn(false);
                    } else {
                        setUnknownError(true);
                        //setLoggingIn(false);
                        console.error(error);
                    }
                });
            });




    }

    const handleSocialLoginFailure = (err) => {
        console.error(err)
    }

    const responseFacebook = (response) => {
        console.log(response);
        setFbEmail(response.email);
        setFbName(response.name);
        setFbProvider("facebook");
        setFbProviderId(response.userID);

        setAuthError(false);
        //setLoggingIn(true);
        setUnknownError(false);
        apiClient.get('/sanctum/csrf-cookie')
            .then(response => {
                //console.log(response);
                apiClient.post('/login/social', {
                    email: fbEmail,
                    name: fbName,
                    provider: fbprovider,
                    provider_id: fbProviderId
                }).then(response => {
                    if (response.status === 200) {
                        console.log(response);
                        props.login();
                        setToHome(true);
                        //setLoggingIn(false);
                       
                    }
                }).catch(error => {

                    if (error.response && error.response.status === 422) {
                        setAuthError(true);
                        //setLoggingIn(false);
                    } else {
                        setUnknownError(true);
                        //setLoggingIn(false);
                        console.error(error);
                    }
                });
            });
    }
    if (toHome === true) {
        return <Redirect to='/' />
    }
    return (
        <div>
            <h3>Login</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="email"
                        name="email"
                        className={"form-control" + (authError || unknownError ? ' is-invalid' : '')}
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        name="password"
                        className={"form-control" + (authError || unknownError ? ' is-invalid' : '')}
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                {authError ? <div className="alert alert-danger">Credentials not recognised. Please try again.</div> : null}
                {unknownError ? <div className="alert alert-danger">There was an error submitting your details.</div> : null}
                <button type="submit" className="btn btn-primary" >Login</button>
            </form>
            <br></br>
            <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                buttonText="Login With Google"
                onSuccess={handleSocialLogin}
                onFailure={handleSocialLoginFailure}
                cookiePolicy={'single_host_origin'}
            />
            <br></br>
            <FacebookLogin
                appId={process.env.REACT_APP_FACEBOOK_CLIENT_ID}
                autoLoad={false}
                fields="name,email,picture"
                callback={responseFacebook} />
        </div>
    );
};

export default Login;