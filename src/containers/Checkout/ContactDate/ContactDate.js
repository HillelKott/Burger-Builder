import React, { useState } from "react";
import { connect } from 'react-redux';

import classes from './ContactDate.module.css';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Button from '../../../components/UI/Button/Button';
import Input from '../../../components/UI/Input/input';
import axios from '../../../axios-orders';
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import { updatedObject, checkValidity } from "../../../shared/utilitiy";
import * as actions from "../../../store/actions/index";

const ContactDate = props => {
    const [orderForm, setOrderForm] = useState({
        name: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Your Name'
            },
            value: '',
            validation: {
                required: true
            },
            valid: false,
            touched: false
        },
        street: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Street'
            },
            value: '',
            validation: {
                required: true
            },
            valid: false,
            touched: false
        },
        zipCode: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'ZIP Code'
            },
            value: '',
            validation: {
                required: true,
                minLength: 5,
                maxLength: 5,
                isNumeric: true
            },
            valid: false,
            touched: false
        },
        country: {
            elementType: 'input',
            elementConfig: {
                type: 'text',
                placeholder: 'Country'
            },
            value: '',
            validation: {
                required: true
            },
            valid: false,
            touched: false
        },
        email: {
            elementType: 'input',
            elementConfig: {
                type: 'email',
                placeholder: 'Your E-Mail'
            },
            value: '',
            validation: {
                required: true,
                isEmail: true
            },
            valid: false,
            touched: false
        },
        deliveryMethod: {
            elementType: 'select',
            elementConfig: {
                options: [
                    { value: 'fastest', displayValue: 'Fastest' },
                    { value: 'cheapest', displayValue: 'Cheapest' }
                ]
            },
            value: 'fastest',
            validation: {},
            valid: true
        }
    });
    const [formIsValid, setFormIsValid] = useState(false);

    const orderHeandler = (event) => {
        event.preventDefault();

        const formData = {};
        for (let formElementIdentifier in orderForm) {
            formData[formElementIdentifier] = orderForm[formElementIdentifier].value;
        };
        const order = {
            ingredients: props.ings,
            price: props.price,
            orderData: formData,
            userId: props.userId
        };

        props.onOrderBurger(order, props.token)

    };

    const inputChangeHeandler = (event, inputIden) => {
        const updatedFormElement = updatedObject(orderForm[inputIden], {
            value: event.target.value,
            valid: checkValidity(
                event.target.value,
                orderForm[inputIden].validation
            ),
            touched: true
        });
        const updatedOrderForm = updatedObject(orderForm, {
            [inputIden]: updatedFormElement
        });

        let formIsValid = true;
        for (let inputIden in updatedOrderForm) {
            formIsValid = updatedOrderForm[inputIden].valid && formIsValid;
        }
        setOrderForm(updatedOrderForm);
        setFormIsValid(formIsValid)
    };

    const formElementArray = [];
    for (let key in orderForm) {
        formElementArray.push({
            id: key,
            config: orderForm[key]
        });
    };
    let form = (
        <form onSubmit={orderHeandler}>
            {formElementArray.map(formElement => (
                <Input key={formElement.id}
                    elementtype={formElement.config.elementType}
                    elementConfig={formElement.config.elementConfig}
                    value={formElement.config.placeholder}
                    invalid={!formElement.config.valid}
                    shuldvalidte={formElement.config.validation}
                    touched={formElement.config.touched}
                    changed={event => { inputChangeHeandler(event, formElement.id) }}
                />
            ))}
            <Button btnType="Success" disabled={!formIsValid}>ORDER </Button>
        </form>
    );
    if (props.loading) {
        form = <Spinner />
    }
    return (
        <div className={classes.ContactDate}>
            <h4>Enter your Contact Data</h4>
            {form}
        </div>
    )
};


const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactDate, axios));