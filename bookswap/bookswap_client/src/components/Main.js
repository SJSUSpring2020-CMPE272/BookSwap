import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Login from './Login/Login';
import Signup from './Login/Signup';
import Home from './Home/Home';
import Aboutus from './Home/Aboutus';

import Navbar from './LandingPage/Navbar';
//Create a Main Component
class Main extends Component {
    render(){
        return(
            <div>
                {/*Render Different Component based on Route*/}
                <Route path="/" component={Navbar}/>
                <Route path="/login" component={Login}/>
                <Route path="/home" component={Home}/>
                <Route path="/aboutus" component={Aboutus}/>
                <Route path="/signup" component={Signup}/>
              
                
                
            </div>
        )
    }
}
//Export The Main Component
export default Main;