import dva from "dva";
import rotuer from './router';
import './index.css';

const app = dva() //initialize
app.use({}) //plugins
app.router(rotuer) //router
app.start('#root') //start
