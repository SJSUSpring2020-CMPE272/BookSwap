import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import {Redirect} from 'react-router';
//import dummy from '../../common/dummy.png';

import Modal from 'react-modal';
import { Button } from 'react-bootstrap';




class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
           
        };
        
    }
    
  

    render() {
      let redirectVar;
        if (!localStorage.getItem("token")) {
            redirectVar = <Redirect to="/login" />;
        }
       

       
      
                             
        

        return (
            <div>
            {redirectVar}
           <h2>Profile</h2>
            
    </div> 
    )
  }
}

export default Profile;

