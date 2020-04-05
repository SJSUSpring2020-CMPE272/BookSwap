import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import booklove from '../../common/booklove.png'

class Aboutus extends Component {
    constructor(){
        super();
        this.state = {  
            books : []
        }
    }  
    //get the books data from backend  
    
    render(){
        //iterate over books to create a table row
      
        //if not logged in go to login page
        let redirectVar = null;
        
        return(
           
           <div>
     
               
                <div class="container">
  <h2>Book Swap</h2>
  
  <div class="row">
		<div class="col-md-12">
    
       
          </div>
        </div>
	</div>
</div>

        )
    }
}
//export Home Component
export default Aboutus;