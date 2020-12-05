import React from 'react';
import { Redirect } from 'react-router-dom';
import apiClient from '../../../coreServices/api';

const Register = (props) => {
    const [email, setEmail] = React.useState('');
    const [name, setName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [passwordConfirmation, setPasswordConfirmation] = React.useState('');
    const [toLogin, setToLogin] = React.useState(false);
    const [authError, setAuthError] = React.useState(false);
    const [unknownError, setUnknownError] = React.useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        setAuthError(false);
        setUnknownError(false);
        apiClient.get('/sanctum/csrf-cookie')
        .then(response => {
            apiClient.post('/register', {
                email: email,
                name : name,
                password: password,
                password_confirmation:passwordConfirmation
            }).then(response => {
                if (response.status === 201) {
                    // props.login();
                    setToLogin(true);
                }
            }).catch(error => {
                if (error.response && error.response.status === 422) {
                    setAuthError(true);
                } else {
                    setUnknownError(true);
                    console.error(error);
                }
            });
        });
    }
    if (toLogin === true) {
        return <Redirect to='/login' />
    }
    return (
        <div>
            <h3>Register</h3>
            <form onSubmit={handleSubmit}>
            <div className="form-group">
                    <input
                        type="text"
                        name="name"
                        className={"form-control" + (authError || unknownError ? ' is-invalid' : '')}
                        placeholder="name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                </div>
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
                <div className="form-group">
                    <input
                        type="password"
                        name="password_confirmation"
                        className={"form-control" + (authError || unknownError ? ' is-invalid' : '')}
                        placeholder="Confirm Password"
                        value={passwordConfirmation}
                        onChange={e => setPasswordConfirmation(e.target.value)}
                        required
                    />
                </div>
                {authError ? <div className="alert alert-danger">The given data was invalid. Please try again.</div> : null}
                {unknownError ? <div className="alert alert-danger">There was an error submitting your details.</div> : null}
                <button type="submit" className="btn btn-primary">Register</button>  
            </form>
        </div>
    );
};

export default Register;