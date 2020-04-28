import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import jwtDecode from 'jwt-decode';
import api from '../../common/api';
import {backendURI} from '../../common/config';


//Define a Login Component
class Login extends Component{
    //call the constructor method
    constructor(props){
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            userEmail : "",
            password : "",
            authFlag:false
          
        }
        //Bind the handlers to this class
        this.userEmailChangeHandler = this.userEmailChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount(){
        this.setState({
            authFlag : false
        })
    }
    //username change handler to update state variable with the text entered by the user
    userEmailChangeHandler = (e) => {
        this.setState({
            userEmail : e.target.value
        })
    }
    //password change handler to update state variable with the text entered by the user
    passwordChangeHandler = (e) => {
        this.setState({
            password : e.target.value
        })
    }
    //submit Login handler to send a request to the node backend
    submitLogin = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            userEmail : this.state.userEmail,
            password : this.state.password
        }
        //set the with credentials to true
        //axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post(backendURI +'/login',data)
            .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    
                    const token=response.data;
                    api.setJwt(token);
                    localStorage.setItem("token", token);
                    const authToken = localStorage.getItem("token");
            const jwt = authToken.split(" ")[1]
            let user = jwtDecode(jwt);
            if (user) {
                localStorage.setItem("email_id", user.emailId);
                localStorage.setItem("user_id", user._id);
                localStorage.setItem("user_name", user.name);
                this.setState({
                    authFlag : true
                })
                }
            }
            }) .catch(err => { 
                this.setState({errorMessage: err.response.data});
            });
    }

    render(){
        //redirect based on successful login
        let redirectVar = null;
        if (!localStorage.getItem("token")) {
            redirectVar = <Redirect to="/login" />; 
        }
        else{
            redirectVar = <Redirect to="/dashboard" />;
        }
        if(this.state.authFlag)
        {
            redirectVar = <Redirect to="/dashboard" />; 

        }
        return(
       <div>
                {redirectVar}
            <div class="container">
<div class="back">
                
                <div class="login-form">
                    <div class="main-div">
                        <div class="panel">
                            <h2>Book Swap</h2>
                            <p>Please enter your email address and password</p>
                        </div>
                        
                            <div class="form-group">
                                <input onChange = {this.userEmailChangeHandler} type="text" class="form-control" name="username" placeholder="User Email Address"/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.passwordChangeHandler} type="password" class="form-control" name="password" placeholder="Password"/>
                            </div>
                            <button onClick = {this.submitLogin} class="btn btn-primary">Login</button>                 
                    </div>
                </div>
            </div>
            </div>
            </div>
           
        )
    }
}
//export Login Component
export default Login;