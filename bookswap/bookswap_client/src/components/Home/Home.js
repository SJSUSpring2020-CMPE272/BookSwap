import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import booklove from '../../common/booklove.png'
import book from '../../common/book.png'

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
                <div class="container">  
                <div class="col-md-4"><img src={book} style={{width:"350", height:"350",padding:"50px"}}></img><br></br></div>
                </div>
                
  <div class="row" >
  
		<div class="col-md-12">
         
            <div class="input-group" id="adv-search">
                <input type="text" class="form-control" placeholder="Search for books" />
                <div class="input-group-btn">
                    <div class="btn-group" role="group">
                        <div class="dropdown dropdown-lg">
                            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false"><span class="caret"></span></button>
                            <div class="dropdown-menu dropdown-menu-right" role="menu">
                                <form class="form-horizontal" role="form">
                                  <div class="form-group">
                                    
                                  </div>
                                  <div class="form-group">
                                    <label for="contain">Author</label>
                                    <input class="form-control" type="text" />
                                  </div>
                                  <div class="form-group">
                                    <label for="contain">Title</label>
                                    <input class="form-control" type="text" />
                                  </div>
                                  <button type="submit" class="btn btn-primary"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></button>
                                </form>
                            </div>
                        </div>
                        <button type="button" class="btn btn-primary"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></button>
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