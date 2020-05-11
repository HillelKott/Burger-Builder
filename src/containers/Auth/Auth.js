import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import classes from "./Auth.module.css";

import Spinner from '../../components/UI/Spinner/Spinner';
import Input from "../../components/UI/Input/input";
import Button from "../../components/UI/Button/Button";
import * as actions from "../../store/actions/index";
import { updatedObject, checkValidity } from "../../shared/utilitiy";

class Auth extends Component {

    state = {
        controls: {
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
            },
        },
        isSignup: true
    };

    componentDidMount() {
        if (!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
            this.props.onSetAuthRedirectPath();
        }
    }



    inputChangedHandler = (event, controlName) => {
        const updatedControls = updatedObject(this.state.controls, {
            [controlName]: updatedObject(this.state.controls[controlName], {
                value: event.target.value,
                valid: checkValidity(event.target.value, this.state.controls[controlName].validation),
                touched: true
            })
        });
        this.setState({ controls: updatedControls });
    }

    submitHeandler = (event) => {
        event.preventDefault();
        this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignup);
    };

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return { isSignup: !prevState.isSignup }
        });
    }

    render() {
        const formElementArray = [];
        for (const key in this.state.controls) {
            formElementArray.push({
                id: key,
                config: this.state.controls[key]
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
                changed={(event) => { this.inputChangedHandler(event, formElement.id) }}
            />
        ));

        if (this.props.loading) {
            form = <Spinner />;
        };
        let errorMessage = null;
        if (this.props.error) {
            errorMessage = (
                <p>{this.props.error.message}</p>
            );
        }
        let authRedirect = null;
        if (this.props.isAuhtenticated) {
            authRedirect = <Redirect to={this.props.authRedirectPath} />;
        }

        return (
            <div className={classes.Auth}>
                {authRedirect}
                {errorMessage}
                <form onSubmit={this.submitHeandler}>
                    {form}
                    <Button btnType="Success">SUBMIT</Button>
                </form>
                <Button
                    clicked={this.switchAuthModeHandler}
                    btnType="Danger">SWITCH TO {this.state.isSignup ? 'SIGNIN' : 'SIGNUP'}</Button>
            </div>
        )
    };
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