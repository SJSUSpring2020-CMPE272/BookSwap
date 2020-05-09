import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Login from './Login/Login';
import Signup from './Login/Signup';
import Home from './Home/Home';
import Aboutus from './Home/Aboutus';
import Profile from './Home/Profile';
import Messages from './Home/Messages';
import Recommendation from './Home/Recommendation';
import Requests from './Home/Requests';
import Navbar from './LandingPage/Navbar';
import Dashboard from './Home/Dashboard';
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
                <Route path="/dashboard" component={Dashboard}/>  
                <Route path="/profile" component={Profile}/>
                <Route path="/messages" component={Messages}/>
                <Route path="/recommendation" component={Recommendation}/>
                <Route path="/requests" component={Requests}/> 
                 
            </div>
        )
    }
}
//Export The Main Component
export default Main;