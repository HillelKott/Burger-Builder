import React from "react";
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import ContactData from './ContactDate/ContactDate';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';


const Checkout = props => {

    const checkoutCanceldHeandler = () => {
        props.history.goBabk()
    };

    const checkoutContineuHeandler = () => {
        props.history.replace('/checkout/contact-data');
    };

    let summary = <Redirect to="/" />;
    if (props.ings) {
        const purcasedRedirect = props.purchased ? <Redirect to="/" /> : null;
        summary = (
            <div >
                {purcasedRedirect}
                <CheckoutSummary
                    ingredients={props.ings}
                    checkoutCanceld={checkoutCanceldHeandler}
                    checkoutContineu={checkoutContineuHeandler} />
                <Route
                    path={props.match.path + '/contact-data'}
                    component={ContactData} />
            </div>
        );
    }
    return summary
};

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        purchased: state.order.purchased
    }
};


export default connect(mapStateToProps)(Checkout);