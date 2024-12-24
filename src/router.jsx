import React from "react";
import { Router, Route, Switch } from 'dva/router';
import HomePage from './pages/HomePage/index';
import ProdNews from './pages/ProdNews'

const RouterConfig = ({ history }) => {
    return (
        <Router history={history}>
            <Switch>
                <Route path="/" exact component={HomePage} />
                <Route path="/prodNews" exact component={ProdNews} />
            </Switch>
        </Router>
    )
}

export default RouterConfig;