import React, { Component } from "react";

import { connect } from 'react-redux';

import classes from './ContactDate.module.css';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Button from '../../../components/UI/Button/Button';
import Input from '../../../components/UI/Input/input';
import axios from '../../../axios-orders';
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import { updatedObject, checkValidity } from "../../../shared/utilitiy";

import * as actions from "../../../store/actions/index";

class ContactDate extends Component {
    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation: {
                    requierd: true
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
                    requierd: true
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
                    requierd: true
                },
                valid: false,
                touched: false,
                minLength: 3,
                maxLength: 7
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    requierd: true
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
                    requierd: true
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
        },
        formIsValid: false
    };

    orderHeandler = (event) => {
        event.preventDefault();
        const formData = {};
        for (const key in this.state.orderForm) {
            formData[key] = this.state.orderForm[key].value;
        };

        const order = {
            ingredients: this.props.ings,
            price: this.props.price,
            orderData: formData,
            userId: this.props.userId
        };

        // axios.post('/orders.json', order)
        //     .then(response => {
        //         this.setState({ loading: false });
        //         this.props.history.push('/');
        //     })
        //     .catch(error => {
        //         this.setState({ loading: false });
        //     })

        this.props.onOrderBurger(order, this.props.token)

    };

    inputChangeHeandler = (event, inputIden) => {

        const updatedFormElement = updatedObject(this.state.orderForm[inputIden],
            {
                value: event.target.value,
                valid: checkValidity(event.target.value, this.state.orderForm[inputIden].validation),
                touched: true
            });

        const updatedOrderForm = updatedObject(this.state.orderForm, {
            [inputIden]: updatedFormElement
        });

        let formIsValid = true;
        for (const key in updatedOrderForm) {
            formIsValid = updatedOrderForm[key].valid && formIsValid;
        }
        this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid });
    }


    render() {

        const formElementArray = [];
        for (const key in this.state.orderForm) {
            formElementArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        };
        let form = (
            <form onSubmit={this.orderHeandler}>
                {formElementArray.map(formElement => (
                    <Input key={formElement.id}
                        elementtype={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.placeholder}
                        invalid={!formElement.config.valid}
                        shuldvalidte={formElement.config.validation}
                        touched={formElement.config.touched}
                        changed={event => { this.inputChangeHeandler(event, formElement.id) }}
                    />
                ))}
                <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER </Button>
            </form>
        );
        if (this.props.loading) {
            form = <Spinner />
        }
        return (
            <div className={classes.ContactDate}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        )
    }
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