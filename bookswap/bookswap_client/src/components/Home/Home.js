import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import book1 from '../../common/book1.jpg';
import book2 from '../../common/book2.jpg';
import book3 from '../../common/book3.jpg';
import {backendURI} from '../../common/config';
import bookdummy from '../../common/books.png';
class Home extends Component {
    constructor(){
        super();
        this.state = {  
            bookDetails : []
        }
    }  
    componentWillMount() {
      this.getAvailableBooks();
  }
    //get the books data from backend  
    getAvailableBooks =()=>
  {
      axios.get(backendURI +'/book/getAvailableBook')
      .then(response => {
          console.log("Status Code : ",response.status);
          if(response.status === 200){
              let bookDetails=response.data;
              
              console.log(JSON.stringify(bookDetails))
              this.setState({
                  bookDetails   
              });
              
          }
      })
      .catch(err => { 
          this.setState({errorMessage:"Books cannot be viewed"});
      });
  }
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
        {this.state.bookDetails.map(book =>
        <div class="col col-lg-4"  key={book._id}>
  <div class="card">
    <img class="card-img-top" src={book.imageUrl||bookdummy} alt="Card image cap"/>
    <div class="card-body">
        <h5 class="card-title">{book.bookName}</h5>
        <p class="card-text">{book.bookDescription}</p>
    </div>
  </div>
      
  </div>
   ) }
 
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