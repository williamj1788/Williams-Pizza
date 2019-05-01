import React from 'react';
import s from '../styles/Login.module.scss';
import Navbar from './Navbar';
import { Header, Input } from './SignUpForm';
import { 
    validateEmail,
    validatePassword,
 } from './validator';
 import { NavLink, Redirect } from 'react-router-dom';
 import { connect } from 'react-redux';
 import { setUser } from '../redux/action';

 const mapStateToProps = state => {
    return {
        user: state.user
    }
}


class Login extends React.Component{
    constructor(props){
        super(props);
        this.state ={
            emailError: null,
            passwordError: null,
            serverError: null,
        }
    }

    handleSubmit = async event => {
        event.preventDefault();

        const isEmailValid = await this.handleEmailBlur();
        const isPasswordValid = this.handlePasswordBlur();
        if(isEmailValid && isPasswordValid){
            await this.tryToLoginUser()
            .then(user => {
                this.props.dispatch(setUser(user));
            })
            .catch(message => {
                this.setState({
                    serverError: message
                })
            });
        }
    }

    handleEmailBlur = async event => {
        let email;
        if(event){
            email = event.target.value;
        }else{
            email = this.getInputValuebyName('Email');
        }
        const validationError = await validateEmail(email);
        this.handleValidationErrors(validationError, 'emailError');
        return !validationError;
    }

    handlePasswordBlur = event => {
        let password;
        if(event){
            password = event.target.value;
        }else{
            password = this.getInputValuebyName('Password');
        }
        const validationError = validatePassword(password);
        this.handleValidationErrors(validationError, 'passwordError');
        return !validationError;
    }

    handleValidationErrors = (validationError, stateErrorProperty) => {
        if(this.state[stateErrorProperty] !== validationError){
            this.setState({
                [stateErrorProperty]: validationError
            });
        }
    }

    tryToLoginUser = () => {
        return new Promise((resolve, reject) => {
            fetch('/api/user/login', {
                method: 'POST',
                body: this.getFormData(),
            })
            .then(res => res.json())
            .then(res => {
                if(res.error){
                    reject(res.error);
                }else{
                    resolve(res);
                }
            });
        })
    }

    getInputValuebyName = name => {
        return document.querySelector(`input[name = ${name}]`).value;
    }

    getFormData = () => {
        const form = document.getElementById('login-form');
        return new FormData(form);
    }
    
    render(){
        const { emailError, passwordError, serverError } = this.state;
        if(!!this.props.user){
            return <Redirect to='/' />
        }
        return(
            <div>
                <Navbar />
                <div className={s.login}>
                    <Header title='Welcome Back' />
                    <form id='login-form' onSubmit={this.handleSubmit} className={s.form}>
                        <Input type='text' name="Email" onBlur={this.handleEmailBlur} error={emailError} autocomplete="email" />
                        <Input type='text' name="Password" onBlur={this.handlePasswordBlur} error={passwordError} autocomplete='current-password' />
                        {serverError && <p style={{margin: 0, color: 'red', textAlign: 'center'}}>{serverError}</p> }
                        <button className={s.button} type='submit' >Login</button>
                    </form>
                    <Account accountText="Don't have an account?" linkText='Sign Up here' to='/signup' />
                </div>
            </div>
        )
    }
}
const Account = () => {
    return(
        <div className={s.account}>
            <p className={s.accountText}>Don't have an account?</p>
            <NavLink to='/signup'>Sign up here</NavLink>
        </div>
    )
}

export default connect(mapStateToProps)(Login);