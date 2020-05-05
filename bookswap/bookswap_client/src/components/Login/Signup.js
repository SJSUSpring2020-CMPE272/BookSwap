import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import {backendURI} from '../../common/config';
import {Redirect} from 'react-router';


//Define a Signup Component
class Signup extends Component{
    //call the constructor method
    constructor(props){
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            userEmail : "",
            password : "",
            name :"",
            address:"",
            city:"",
            stateName:"",
            zipcode:"",
            errorMessage : "",
            successFlag :false
        }
        //Bind the handlers to this class
       
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
    //name change handler to update state variable with the text entered by the user
    nameChangeHandler = (e) => {
        this.setState({
            name : e.target.value
        })
    }

    //name change handler to update state variable with the text entered by the user
    addressChangeHandler = (e) => {
        this.setState({
            address : e.target.value
        })
    }
    
    //name change handler to update state variable with the text entered by the user
    zipcodeChangeHandler = (e) => {
        this.setState({
            zipcode : e.target.value
        })
    }

    //name change handler to update state variable with the text entered by the user
    stateNameChangeHandler = (e) => {
        this.setState({
            stateName : e.target.value
        })
    }

    //name change handler to update state variable with the text entered by the user
    cityChangeHandler = (e) => {
        this.setState({
            city : e.target.value
        })
    }

    
    //submit Login handler to send a request to the node backend
    submitSignUp = (e) => {
        //var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            userEmail : this.state.userEmail,
            password : this.state.password,
            name : this.state.name,
            address: this.state.address,
            city: this.state.city,
            stateName: this.state.stateName,
            zipcode: this.state.zipcode
        }
        console.log(data);
        //set the with credentials to true
       //axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post(backendURI+'/signup',data)
            .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    this.setState({
                        successFlag : true
                       
                    })
                    alert("Signed up successfully!!Login Now!");
                }
            })
            .catch(err => { 
                this.setState({errorMessage: err.response.data});
            });
    }
    
    render(){
        //redirect based on successful login
        let redirectVar = null;
        if(this.state.successFlag)
        {
            redirectVar = <Redirect to="/login" />;  
        }
        return(
            <div>
                {redirectVar}
            <div className="container">
                <div class="back">
                <div className="login-form">
                    <div className="main-div">
                        <div className="panel">
                            <h2>Join Book Swap today and enjoy unlimited free swapping </h2>
                            <h2>Sign Up</h2>
                            <p>Please enter your Details</p><br/>
                            <div style={{float: "left", color: "red"}} >
                { this.state.errorMessage &&
                            <h5 className="error">Error: { this.state.errorMessage} </h5> }
                            </div>
                        </div>

                        <form onSubmit={this.submitSignUp} >
                        <div className="form-group">
                            </div>
                            <div className="form-group">
                            <label htmlFor="name">Your Name:</label>
                                <input onChange = {this.nameChangeHandler} type="text" className="form-control" name="Name" placeholder="Name" required />
                            </div>
                            <div className="form-group">
                            <label htmlFor="Email Address">Your Email Address:</label>
                                <input onChange = {this.userEmailChangeHandler}  type="email" className="form-control" name="Email Address" placeholder="Email Address" required />
                            </div>
                            <div className="form-group">
                            <label htmlFor="password"> Create Password:</label>
                                <input onChange = {this.passwordChangeHandler}  type="password" className="form-control" name="password" placeholder="Password" required />
                            </div>
                            <div className="form-group">
                            <label htmlFor="address"> Enter address:</label>
                                <input onChange = {this.addressChangeHandler}  type="text" className="form-control" name="Address" placeholder="Address" required />
                            </div>
                            <div className="form-group">
                            <label htmlFor="city"> Enter City:</label>
                                <input onChange = {this.cityChangeHandler}  type="text" className="form-control" name="city" placeholder="City" required />
                            </div>
                            <div className="form-group">
                            <label htmlFor="stateName"> State:</label>
                                <input onChange = {this.stateNameChangeHandler}  type="text" className="form-control" name="stateName" placeholder="CA" required />
                            </div>
                            <div className="form-group">
                            <label htmlFor="zipcode"> Enter Zipcode:</label>
                                <input onChange = {this.zipcodeChangeHandler}  type="text" className="form-control" name="zipcode" placeholder="ZipCode" required />
                            </div>
                            <button type ="submit"  className="btn btn-primary">Sign Up</button>   
                            </form>              
                    </div>
                    
                </div>
                
            </div>
            </div>
            </div>
        )
    
   
    
}
}


export default Signup;