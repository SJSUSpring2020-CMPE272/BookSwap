import React,{Component} from 'react';
import {Link} from 'react-router-dom';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import booklogo from '../../common/books.png'

//create the Navbar Component
class Navbar extends Component {
    constructor(props){
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }
    //handle logout to destroy the cookie
    handleLogout = () => {
        localStorage.clear();
    }
    render(){
        //if Cookie is set render Logout Button
        let navLogin = null;
        if(localStorage.getItem("token")){
            console.log("Able to read cookie");
            
            navLogin = (
                <ul class="nav navbar-nav navbar-right">
                    <li><Link to="/dashboard">Dashboard</Link></li>
                     <li><Link to="/recommendation">Recommendations</Link></li>
                        <li><Link to="/messages">Messages</Link></li>
                        <li><Link to="/profile"><span class="glyphicon glyphicon-user"></span>Profile</Link></li>
                        <li><Link to="/" onClick = {this.handleLogout}><span class="glyphicon glyphicon-user"></span>Logout</Link></li>
                </ul>
            );
        }else{
            //Else display login button
            console.log("Not Able to read token");
            navLogin = (
                <ul class="nav navbar-nav navbar-right">
                        <li><Link to="/signup">Sign Up</Link></li>
                        <li><Link to="/login"><span class="glyphicon glyphicon-log-in"></span> Login</Link></li>
                </ul>
            )
        }
        let redirectVar = null;
        if(localStorage.getItem("token")){  
            redirectVar = <Redirect to="/dashboard"/>
        }
        else{
            redirectVar = <Redirect to="/aboutus"/>
        }
        return(
            <div>
                {redirectVar}
            <nav class="navbar navbar-inverse">
                <div class="container-fluid">
                <div className="navbar-header">
                    <a className="navbar-brand brand-name">
                        <img src={booklogo}/>
                    </a>     
                    </div>
                    <ul class="nav navbar-nav">
                        <li><Link to="/home">Book Swap</Link></li>
                        <li><Link to="/aboutus">About Us</Link></li>
                       
                    </ul>
                    {navLogin}
                </div>
            </nav>
        </div>
        )
    }
}

export default Navbar;