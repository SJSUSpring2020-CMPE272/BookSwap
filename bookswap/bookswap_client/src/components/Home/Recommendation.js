import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import {Redirect} from 'react-router';
import bookdummy from '../../common/books.png';
import RangeSlider from "react-input-slider";
import Modal from 'react-modal';
import { Button } from 'react-bootstrap';
import {backendURI} from '../../common/config';

class Recommendation extends Component {
    constructor(props) {
        super(props);
        this.state = {
           books:[],
           searchString:'alchemist',
          bookTitle:'',
          allBookDetails:[],
          allBookDetailsInit:[],
          range: 15,
          unavailableModal:false
        };
        this.closeModal = this.closeModal.bind(this);
    }
    componentDidMount() {
      this.getRecommendation();
  }
  // filtering by distance
 distance=(lat1, lon1, lat2, lon2)=>{
  console.log("distance called on "+lat1+","+lon1+","+lat2+","+lon2+",");
  if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
   }
  else {
      var radlat1 = Math.PI * lat1/180;
      var radlat2 = Math.PI * lat2/180;
      var theta = lon1-lon2;
      console.log();
      var radtheta = Math.PI * theta/180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
          dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180/Math.PI;
      dist = dist * 60 * 1.1515;
      return dist;
  }
}

filterByDistance=(book)=>{
 let dist=0;
 let range= this.state.range;
 console.log("range captured"+range );
 console.log("filter by dist called on book" +book.bookName);

   dist=this.distance(localStorage.getItem("userLat"),localStorage.getItem("userLon"),
                         book.location.latitude,book.location.longitude );
    console.log("distance of book"+book.bookName+":" + dist);
    return dist<= this.state.range;
}

handleApply=()=>{
  let allBookDetails= this.state.allBookDetailsInit;
              let distanceFilteredBooks= allBookDetails.filter(this.filterByDistance);
              this.setState({allBookDetails:distanceFilteredBooks});
}

// filtering by distance

  getRecommendation=()=>
{
  this.setState({
           
    booksLength :0
 }); 
    
    axios.get(`https://cors-anywhere.herokuapp.com/https://14645873.ngrok.io/predictions/${this.state.searchString}`)
    .then(response => {
        if(response.status === 200){
          var result = response.data;
          let books=[];
          let i=0;
         
          for(var key of Object.keys(result))
          {
            books[i]=result[key];
            i++
          }
         
            console.log(JSON.stringify(books))
            this.setState({
               books ,
               booksLength:books.length  
            }); 
        }
    })
    .catch(err => { 
        this.setState({errorMessage:"Books cannot be viewed"});
    });
}
bookCriteria=(e)=>
{
    this.setState({
        searchString : e.target.value,
       
    })
}
closeModal() {
  this.setState({
      bookIsOpen: false,
      unavailableModal:false
  });
}
checkAvailabilityModal=async(book)=> {
  console.log(book.titles)
 await this.setState({
      titles:book.titles ,
        
  });
 this.check();
}
check=()=>{
  let data = {
    searchString:this.state.titles,
    pageIndex:1
   
}
console.log(data)
  axios.post(backendURI +'/book/searchBook',data)
  .then(response => {
      console.log("Status Code : ",response.status);
      if(response.status === 200){
        console.log(response.data.length)
          let allBookDetails=response.data[0];
          this.setState({
            allBookDetailsInit: allBookDetails
             
        }); 

          let distanceFilteredBooks= allBookDetails.filter(this.filterByDistance);
              allBookDetails=distanceFilteredBooks;
          console.log(JSON.stringify(allBookDetails))
          this.setState({
              allBookDetails,
               
          }); 
          
          if(allBookDetails)
          {
            this.setState({
              bookIsOpen:true,
              availability:true
               
          }); 

           
          }
          if(response.data.length==0)
          {
            this.setState({
              unavailableModal:true
            })
          }
      }
  })
  .catch(err => { 
      this.setState({errorMessage:"Books cannot be viewed"});
  });
}


  

    render() {
      let redirectVar;let booklist;let message;let bookdetails;let availabilityMessage;
        if (!localStorage.getItem("token")) {
            redirectVar = <Redirect to="/login" />;
        }
        if(this.state.booksLength==0)
        {
          message=( <div><h3>We're sorry, but we don't have any book recommendations specific to book entered</h3></div> )
        }
       
       
        
        booklist =( <div className="panel panel-default p50 uth-panel">
                <table className="table table-hover">
                    <thead>
                        <tr>
                          <th></th>
                            <th>Book Name</th>
                            <th>Genre</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.state.books.map(book =>
                   <tr key={book.titles}>
                      <td><img className="card-img-top" data-src={bookdummy} src={book.image_url||bookdummy}/></td>
                     <td>{book.titles}</td>
                     <td>{book.genres}</td>
                     <td><Button variant="primary" onClick={() => this.checkAvailabilityModal(book)}>Check Availability</Button></td>
                     
                   </tr>
                    )
                  }
                     </tbody>
                    
                </table>
                </div>)
       
      
                             
        

        return (
            <div>
            {redirectVar}
           
           <div className="main-div">
                            <div className="panel">
                                <h2>Enter your favourite book name to get recommendation</h2>
                                  
    <div class="row">    
        <div class="col-xs-8 col-xs-offset-2">
		    <div>
                <div class="input-group-btn search-panel">
                   
                  
                </div>
                <input type="text" class="form-control" name="search" placeholder="Book Name" onChange={this.bookCriteria}/>
                <div style={{display: "flex",justifyContent: "center",alignItems: "center"}}>
                    <button class="btn btn-primary" type="button" onClick={this.getRecommendation}><span class="glyphicon glyphicon-search"></span>Search</button>
                </div>
                <div>
                                                <p>Show books in: {this.state.range} mi.</p>
                                        <RangeSlider
        axis="x"
        x={this.state.range}
        xmin = {0}
        xmax ={50}
       onChange={({ x }) => {
            this.setState({range: x });

         }}
      />
      <Button onClick={() => this.handleApply()}>Apply</Button>
                                        </div>
            </div>
        </div>
	</div>
    {message}
    {availabilityMessage}
</div>
            {booklist}
    </div> 
    <Modal
                            isOpen={this.state.bookIsOpen}
                            onRequestClose={this.closeModal}
                             contentLabel="Example Modal" >
                                
                           <div> 
                                         
                            <div class="container">
                            {this.state.allBookDetails&&
                            <div class="panel panel-default">
                          
                            <div class="panel-heading">Book Details </div>
                           
                            <div class="panel-heading">Book Name: {this.state.titles}</div>
                            <div class="panel-body">Author Name: {this.state.allBookDetails.authorName}</div>
                            <div class="panel-body">Genre: {this.state.allBookDetails.genre}</div>
                            <div class="panel-body">Book Owner: {this.state.allBookDetails.bookOwnerName}</div>
                            <div class="panel-body">Additional Details: {this.state.allBookDetails.bookDescription}</div>
                            <div class="panel-body">ISBN Number: {this.state.allBookDetails.isbnNumber}</div>
    
                            <center> 
                                <Button variant="primary" onClick={this.closeModal}>
                                    <b>Close</b>
                                </Button>
                            </center>
                            </div>
                            }
                            </div>
                        </div>
                        </Modal>
                        <Modal
                            isOpen={this.state.unavailableModal}
                            onRequestClose={this.closeModal}
                             contentLabel="Example Modal" >
                                
                           <div> 
                                         
                            <div class="container">
                            
                            <div class="panel panel-default">
                          
                           
                            <center> 
                            <div class="panel-heading">We're sorry, but we don't have this book in our system yet</div>
                           
    
                            
                                <Button variant="primary" onClick={this.closeModal}>
                                    <b>Close</b>
                                </Button>
                            </center>
                            </div>
                            
                            </div>
                        </div>
                        </Modal>
    </div>
    )
  }
}

export default Recommendation;