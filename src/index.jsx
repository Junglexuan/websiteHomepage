import dva from "dva";
import rotuer from './router';
import './index.css';
import {createBrowserHistory as createHistory} from 'history';

const app = dva({history:createHistory()}) //initialize
app.use({}) //plugins
app.router(rotuer) //router
app.start('#root') //start
