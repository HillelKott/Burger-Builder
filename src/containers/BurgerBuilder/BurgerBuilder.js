import React, { useState, useEffect, useCallback } from "react";
import axios from '../../axios-orders';
import { useDispatch, useSelector, connect } from "react-redux";

import Aux from '../../hoc/Auxalery/auxalery';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrdeSummary/OrdeSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const BurgerBuilder = props => {

    const [purchasing, setPurchasing] = useState(false);

    const dispatch = useDispatch();

    const ings = useSelector(state => state.burgerBuilder.ingredients);
    const price = useSelector(state => state.burgerBuilder.totalPrice);
    const error = useSelector(state => state.burgerBuilder.error);
    const isAuthenticated = useSelector(state => state.auth.token !== null);

    const onIngrediantsAdded = ingName => dispatch(actions.addIngredient(ingName));
    const onIngrediantsremoved = ingName => dispatch(actions.removeIngredient(ingName));
    const onInitIngredients = useCallback(() => dispatch(actions.initIngredients()), [dispatch]);
    const onInitPurchase = () => dispatch(actions.purchaseInit());
    const onAuthRedirectPath = path => dispatch(actions.setAuthRedirectPath(path));



    useEffect(() => {
        onInitIngredients();
    }, [onInitIngredients]);

    const updatePurchaseState = ingredients => {
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum, el) => {
                return sum + el;
            }, 0);
        return sum > 0;
    };



    const purchaseHeandler = () => {

        if (isAuthenticated) {
            setPurchasing(true);
        } else {
            onAuthRedirectPath('/checkout');
            props.history.push('/auth');
        }
    };

    const purchaseCancelHendler = () => {
        setPurchasing(false);
    };

    const purchasContenueHeandler = () => {
        props.history.push('/checkout');
        onInitPurchase();
    };


    const disabledInfo = {
        ...ings
    };
    for (const key in disabledInfo) {
        disabledInfo[key] = disabledInfo[key] <= 0
    };
    let orderSummary = null;
    let burger = error ? <p>Ingredients can't be loaded!</p> : <Spinner />;

    if (ings) {
        burger = (
            <Aux>
                <Burger ingredients={ings} />
                <BuildControls
                    ingredientAdded={onIngrediantsAdded}
                    ingredientRemoved={onIngrediantsremoved}
                    disabled={disabledInfo}
                    purchasable={updatePurchaseState(ings)}
                    orderd={purchaseHeandler}
                    price={price}
                    isAuth={isAuthenticated}
                />
            </Aux>
        );
        orderSummary = <OrderSummary
            ingredients={ings}
            price={price}
            purchaseCanceled={purchaseCancelHendler}
            purchaseContinued={purchasContenueHeandler} />;
    };

    return (
        <Aux>
            <Modal show={purchasing} modalClosed={purchaseCancelHendler}>
                {orderSummary}
            </Modal>
            {burger}
        </Aux>
    )
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        isAuthenticated: state.auth.token !== null
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onIngrediantsAdded: (ingName) => dispatch(actions.addIngredient(ingName)),
        onIngrediantsremoved: (ingName) => dispatch(actions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));
