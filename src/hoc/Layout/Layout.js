import React, { Component } from 'react';

import classes from './Layout.module.css'
import Aux from '../Auxalery/auxalery';
import ToolBar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import { connect } from "react-redux";

class Layout extends Component {

    state = {
        showSideDrawer: false
    }

    sideDrawerClosedHeandler = () => {
        this.setState({ showSideDrawer: false });
    };

    sideDrawerToggleHeandler = () => {
        this.setState(prevState => {
            return { showSideDrawer: !prevState.showSideDrawer }
        })
    }

    render() {


        return (
            <Aux>
                <ToolBar
                    isAuth={this.props.isAuthenticated}
                    drawerToggleClicked={this.sideDrawerToggleHeandler} />
                <SideDrawer
                    isAuth={this.props.isAuthenticated}
                    open={this.state.showSideDrawer}
                    closed={this.sideDrawerClosedHeandler} />
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Aux>
        )
    };
};

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token != null
    }
};

export default connect(mapStateToProps)(Layout); 