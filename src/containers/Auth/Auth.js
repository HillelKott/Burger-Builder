import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import classes from "./Auth.module.css";

import Spinner from '../../components/UI/Spinner/Spinner';
import Input from "../../components/UI/Input/input";
import Button from "../../components/UI/Button/Button";
import * as actions from "../../store/actions/index";
import { updatedObject, checkValidity } from "../../shared/utilitiy";

const Auth = props => {
    const [authForm, setAuthForm] = useState({
        email: {
            elementType: 'input',
            elementConfig: {
                type: 'email',
                placeholder: 'Mail Addres'
            },
            value: '',
            validation: {
                requierd: true,
                isEmail: true
            },
            valid: false,
            touched: false
        },
        password: {
            elementType: 'input',
            elementConfig: {
                type: 'password',
                placeholder: 'Password'
            },
            value: '',
            validation: {
                requierd: true,
                minLength: 6
            },
            valid: false,
            touched: false
        }
    })
    const [isSignup, setIsSignup] = useState(true);
    const { buildingBurger, authRedirectPath, onSetAuthRedirectPath } = props;

    useEffect(() => {
        if (!buildingBurger && authRedirectPath !== '/') {
            onSetAuthRedirectPath();
        };
    }, [buildingBurger, authRedirectPath, onSetAuthRedirectPath]);



    const inputChangedHandler = (event, controlName) => {
        const updatedControls = updatedObject(authForm, {
            [controlName]: updatedObject(authForm[controlName], {
                value: event.target.value,
                valid: checkValidity(event.target.value, authForm[controlName].validation),
                touched: true
            })
        });
        setAuthForm(updatedControls);
    }

    const submitHeandler = (event) => {
        event.preventDefault();
        props.onAuth(authForm.email.value, authForm.password.value, isSignup);
    };

    const switchAuthModeHandler = () => {
        setIsSignup(!isSignup);
    };

    const formElementArray = [];
    for (const key in authForm) {
        formElementArray.push({
            id: key,
            config: authForm[key]
        });
    };
    let form = formElementArray.map(formElement => (
        <Input
            key={formElement.id}
            elementtype={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.placeholder}
            invalid={!formElement.config.valid}
            shuldvalidte={formElement.config.validation}
            touched={formElement.config.touched}
            changed={(event) => { inputChangedHandler(event, formElement.id) }}
        />
    ));

    if (props.loading) {
        form = <Spinner />;
    };
    let errorMessage = null;
    if (props.error) {
        errorMessage = (
            <p>{props.error.message}</p>
        );
    }
    let authRedirect = null;
    if (props.isAuhtenticated) {
        authRedirect = <Redirect to={props.authRedirectPath} />;
    }

    return (
        <div className={classes.Auth}>
            {authRedirect}
            {errorMessage}
            <form onSubmit={submitHeandler}>
                {form}
                <Button btnType="Success">SUBMIT</Button>
            </form>
            <Button
                clicked={switchAuthModeHandler}
                btnType="Danger">SWITCH TO {isSignup ? 'SIGNIN' : 'SIGNUP'}</Button>
        </div>
    )
};

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuhtenticated: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirect: state.auth.authRedirectPath
    }
};

const mapDispathToProps = dispatch => {
    return {
        onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    }
};

export default connect(mapStateToProps, mapDispathToProps)(Auth);