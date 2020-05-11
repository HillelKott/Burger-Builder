import React, { Component } from "react";
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import ContactData from './ContactDate/ContactDate';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';


class Checkout extends Component {

    checkoutCanceldHeandler = () => {
        this.props.history.goBabk()
    };

    checkoutContineuHeandler = () => {
        this.props.history.replace('/checkout/contact-data');
    };

    render() {
        let summary = <Redirect to="/" />;
        if (this.props.ings) {
            const purcasedRedirect = this.props.purchased ? <Redirect to="/" /> : null;
            summary = (
                <div >
                    {purcasedRedirect}
                    <CheckoutSummary
                        ingredients={this.props.ings}
                        checkoutCanceld={this.checkoutCanceldHeandler}
                        checkoutContineu={this.checkoutContineuHeandler} />
                    <Route
                        path={this.props.match.path + '/contact-data'}
                        component={ContactData} />
                </div>
            );
        }
        return summary
    }
};

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        purchased: state.order.purchased
    }
};


export default connect(mapStateToProps)(Checkout);