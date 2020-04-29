import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import book1 from '../../common/book1.jpg';
import book2 from '../../common/book2.jpg';
import book3 from '../../common/book3.jpg';
import dummy from '../../common/dummy.png';
import bookdummy from '../../common/books.png';
import {backendURI} from '../../common/config';
import Modal from 'react-modal';
import { Button, Form} from "react-bootstrap";

import { CarouselProvider, Slider, Slide } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

class Dashboard extends Component {
    constructor(){
        super();
        this.state = {  
            allBookDetails : [],
            bookIsOpen:false,
            openMessage:false,
            pageIndex:1,
            searchString:'',
            books:[]
        }
        this.closeModal = this.closeModal.bind(this);
        this.cancelModal = this.cancelModal.bind(this);
    }  
    componentDidMount() {
      this.searchBook();
  }
  closeModal() {
    this.setState({
        bookIsOpen: false
    });
}
cancelModal() {
    this.setState({
        openMessage:false
    });
}
openMessageModal(book) {
    this.setState({
        openMessage:true,
        receiverid:book.bookOwnerId,
        receivername:book.bookOwnerName
    });
}
submitMessage=()=>
{
    let data = {
        senderid:localStorage.getItem("user_id"),
        sname:localStorage.getItem("user_name"),
        receiverid:this.state.receiverid,
        receivername:this.state.receivername,
        content:this.state.message
    }
axios.post(backendURI +'/messages/',data)
    .then(response => {
        console.log("Status Code : ",response.status,response.data);
        if(response.status === 200){
            alert("Message sent");
            this.getSwapBookAllUsers();
        }
    })
    .catch(err => { 
        this.setState({errorMessage:"Message could not be sent"});
    });
    this.setState({
        openMessage : false
    })
}
messageContentHandler=(e)=>
    {
        this.setState({
            message : e.target.value
        })
    }
  getSwapBookAllUsers =()=>
  {
    let userId=localStorage.getItem("user_id");
    const data={userId : userId}
      axios.post(backendURI +'/book/getSwapBookAllUsers',data)
      .then(response => {
          console.log("Status Code : ",response.status);
          if(response.status === 200){
              let allBookDetails=response.data;
              
              console.log(JSON.stringify(allBookDetails))
              this.setState({
                  allBookDetails   
              });
              
          }
      })
      .catch(err => { 
          this.setState({errorMessage:"Students cannot be viewed"});
      });
  }
  openBookModal(book) {
    this.setState({
        bookIsOpen: true,
        bookTitle:book.bookName,
        authorName:book.authorName,
        bookOwnerName:book.bookOwnerName,
        bookDescription:book.bookDescription,
        genre:book.genre,
        isbnNumber:book.isbnNumber        
    });
}
bookCriteria=(e)=>
{
    this.setState({
        searchString : e.target.value,
        pageIndex:1
    })
}
pageCountInc=async()=>{
    console.log(this.state.allBookDetails.length);
    if((this.state.allBookDetails.length)==5)
    {
   await this.setState({
    
        pageIndex:this.state.pageIndex+1 
        
    })
}
this.searchBook();
}
pageCountDec=async()=>{
    if(this.state.pageIndex>1)
    {
    await this.setState({
        pageIndex:this.state.pageIndex-1 
    }) 
}
this.searchBook();
}
searchBook=()=>
{
    let userId=localStorage.getItem("user_id");
    let data = {
        searchString:this.state.searchString ,
        pageIndex:this.state.pageIndex,
        userId : userId
    }
    axios.post(backendURI +'/book/searchBook',data)
    .then(response => {
        console.log("Status Code : ",response.status);
        if(response.status === 200){
            let allBookDetails=response.data;
            console.log(JSON.stringify(allBookDetails))
            this.setState({
                allBookDetails   
            }); 
        }
    })
    .catch(err => { 
        this.setState({errorMessage:"Books cannot be viewed"});
    });
}
    
    render(){
        //iterate over books to create a table row
        let redirectVar;let bookImage=bookdummy;let booklist;
        if (!localStorage.getItem("token")) {
            redirectVar = <Redirect to="/login" />;
        }
        
        booklist =( <div className="panel panel-default p50 uth-panel">
                <table className="table table-hover">
                    <thead>
                        <tr>
                          <th></th>
                            <th>Book Name</th>
                            <th>Details</th>
                            <th>Swap</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.allBookDetails.map(book =>
                   <tr key={book._id}>
                      <td><img className="card-img-top" data-src={bookImage} src={book.imageUrl||bookImage}/></td>
                     <td>{book.bookName}</td>
                     <td><Button variant="primary" onClick={() => this.openBookModal(book)}>View Book Details</Button></td>
                     <td><Button onClick={() => this.openMessageModal(book)}>Send Message</Button></td>
                   </tr>
                    )
                  }
                     </tbody>
                    
                </table>
                <div style={{display: "flex",justifyContent: "center",alignItems: "center"}}>
            <nav aria-label="Page navigation example">
  <ul className="pagination justify-content-center">
    <li class="page-item">
      <a class="page-link" href="#" onClick={() => this.pageCountDec()} tabIndex="-1">Previous</a>
    </li>
                <li class="page-item"><a class="page-link" href="#">{this.state.pageIndex}</a></li>
    <li class="page-item">
      <a class="page-link" href="#" onClick={() => this.pageCountInc()}>Next</a>
    </li>
  </ul>
</nav>
</div>
</div>)
       
        return (
            <div>
            {redirectVar}
            
            <div className="container">
                    
                        <div className="main-div">
                            <div className="panel">
                                <h2>Book Search</h2>
                                  
    <div class="row">    
        <div class="col-xs-8 col-xs-offset-2">
		    <div>
                <div class="input-group-btn search-panel">
                   
                  
                </div>
                <input type="text" class="form-control" name="search" placeholder="Book Name or Author Name" onChange={this.bookCriteria}/>
                <div style={{display: "flex",justifyContent: "center",alignItems: "center"}}>
                    <button class="btn btn-primary" type="button" onClick={this.searchBook}><span class="glyphicon glyphicon-search"></span>Search</button>
                </div>
            </div>
        </div>
	</div>
    
</div>
</div>
{booklist}



 </div>
 <Modal
                            isOpen={this.state.bookIsOpen}
                            onRequestClose={this.closeModal}
                             contentLabel="Example Modal" >
                           <div>             
                            <div class="container">
                            <div class="panel panel-default">
                            <div class="panel-heading">Book Details </div>
                            <div class="panel-heading">Book Name: {this.state.bookTitle}</div>
                            <div class="panel-body">Author Name: {this.state.authorName}</div>
                            <div class="panel-body">Genre: {this.state.genre}</div>
                            <div class="panel-body">Book Owner: {this.state.bookOwnerName}</div>
                            <div class="panel-body">Additional Details: {this.state.bookDescription}</div>
                            <div class="panel-body">ISBN Number: {this.state.isbnNumber}</div>
                            <center> 
                                <Button variant="primary" onClick={this.closeModal}>
                                    <b>Close</b>
                                </Button>
                            </center>
                            </div>
                            </div>
                        </div>
                        </Modal>
                        <Modal
                            isOpen={this.state.openMessage}
                            onRequestClose={this.cancelModal}
                             contentLabel="Example Modal" >
                                 
                               
                <div class="panel panel-default">
                    <div class="panel-heading">To: {this.state.receivername} </div> 
                </div>
                <Form  >
                        <Form.Control as="textarea" rows="3" name="input_message" placeholder="Type your message..." onChange={this.messageContentHandler} pattern="^[A-Za-z0-9 ,.-]+$" required />
                        <br />
                    </Form>
                         <center>
                         <Button variant="primary" onClick={this.submitMessage}>
                                    <b>Send Message</b>
                                </Button>{" "}
                                <Button variant="primary" onClick={this.cancelModal}>
                                    <b>Cancel</b>
                                </Button> 
                            </center>
                        </Modal>
 </div>
           
    )
    }
}
//export Home Component
export default Dashboard;