import * as actionTypes from './actionsTypes';

import axios from '../../axios-orders';
import { fetchIngredientsFaild } from './burgerBuilder';

export const purchaseBurgerSucces = (id, orderData) => {
    return {
        type: actionTypes.PURCHASE_BURGER_SUCCES,
        orderId: id,
        orderData: orderData
    };
};

export const purchaseBurgerFail = error => {
    return {
        type: actionTypes.PURCHASE_BURGER_FAIL,
        error: error
    };
};

export const purchaseBurgerstart = () => {
    return {
        type: actionTypes.PURCHASE_BURGER_START
    };
};
export const purchaseBurger = (orderData, token) => {
    return dispatch => {
        dispatch(purchaseBurgerstart())
        axios.post('/orders.json?auth=' + token, orderData)
            .then(data => {
                dispatch(purchaseBurgerSucces(data.data.name, orderData))
            }).catch(err => {
                dispatch(purchaseBurgerFail(err))
                this.props.history.push('/')
            });
    };
};

export const purchaseInit = () => {
    return {
        type: actionTypes.PURCHASE_INIT
    };
};


export const fetchOrderSuccess = orders => {
    return {
        type: actionTypes.PURCHASE_BURGER_SUCCES,
        orders: orders
    };
};

export const fetchOrderFail = error => {
    return {
        type: actionTypes.FETCH_ORDER_FAIL,
        error: error
    };
};

export const fetchOrderStart = error => {
    return {
        type: actionTypes.FETCH_ORDER_START
    };
};


export const fetchOrders = (token, userId) => {
    return dispatch => {
        dispatch(fetchOrderStart());
        const queryParams = '?auth=' + token + '&orderBy="userId"&equalTo"' + userId + '"';
        axios.get('/orders.json' + queryParams)
            .then(res => {
                const fetchedOrders = [];
                for (const key in res.data) {
                    fetchedOrders.push({
                        ...res.data[key],
                        id: key
                    });
                };
                dispatch(fetchOrderSuccess(fetchedOrders));
            }).catch(err => {
                dispatch(fetchIngredientsFaild(err))
            });
    };
};