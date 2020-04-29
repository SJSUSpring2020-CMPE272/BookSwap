import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import book1 from '../../common/book1.jpg';
import book2 from '../../common/book2.jpg';
import book3 from '../../common/book3.jpg';

import { CarouselProvider, Slider, Slide } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

class Home extends Component {
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
                <div class="container-fluid">
        </div>
        <br></br>
        <div class="container">
            <div class="center">
        <h2>Some Books Available:</h2>
        
        <div class="card-group">
        <div class="row">
        <div class="col col-lg-4">
  <div class="card">
    <img class="card-img-top" src={book1} alt="Card image cap"/>
    <div class="card-body">
      <h5 class="card-title">Book 1</h5>
      <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
      <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
    </div>
  </div>
  </div>
  <div class="col col-lg-4">
  <div class="card">
    <img class="card-img-top" src={book2} alt="Card image cap"/>
    <div class="card-body">
      <h5 class="card-title">Book 2</h5>
      <p class="card-text">This card has supporting text below as a natural lead-in to additional content.</p>
      <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
    </div>
    </div>
    </div>

    <div class="col col-lg-4">
  <div class="card">
    <img class="card-img-top" src={book3} alt="Card image cap"/>
    <div class="card-body">
      <h5 class="card-title">Book 3</h5>
      <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.</p>
      <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
    </div>
    </div>
    </div>
  </div>
</div>
  </div>
       </div>
	
</div>

        )
    }
}
//export Home Component
export default Home;