import React, { useState } from 'react';

import classes from './Layout.module.css'
import Aux from '../Auxalery/auxalery';
import ToolBar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import { connect } from "react-redux";

const Layout = props => {
    const [sideDrawerIsVisible, setSideDrawerIsVisible] = useState(false)


    const sideDrawerClosedHeandler = () => {
        setSideDrawerIsVisible(false);
    };

    const sideDrawerToggleHeandler = () => {
        setSideDrawerIsVisible(!sideDrawerIsVisible);
    };

    return (
        <Aux>
            <ToolBar
                isAuth={props.isAuthenticated}
                drawerToggleClicked={sideDrawerToggleHeandler} />
            <SideDrawer
                isAuth={props.isAuthenticated}
                open={sideDrawerIsVisible}
                closed={sideDrawerClosedHeandler} />
            <main className={classes.Content}>
                {props.children}
            </main>
        </Aux>
    )
};

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token != null
    }
};

export default connect(mapStateToProps)(Layout); 