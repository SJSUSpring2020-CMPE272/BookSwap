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

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import SimpleMap from './SimpleMap';
import AddressTable from './AddressTable';

let swapcheck = [];

class Dashboard extends Component {
    constructor(){
        super();
        this.state = {  
            allBookDetails : [],
            bookIsOpen:false,
            openMessage:false,
            isMeetingLocationModalOpen: false,
            pageIndex:1,
            searchString:'',
            books:[],
            booksList:[],
            swapBookDetails: [],
            categories:[],
            categoriesMap:{},
            categorisedBooks: [],
            unCategorisedBooks: [],
            authorsList: [],
            dropdownList: [],
            selectedOption: 'book'
        }
        this.closeModal = this.closeModal.bind(this);
        this.cancelModal = this.cancelModal.bind(this);
        this.getBooksList = this.getBooksList.bind(this);
        this.closeMeetingLocations = this.closeMeetingLocations.bind(this);
    }  
    componentDidMount() {
      this.searchBook(null);
      this.getSwapBook();
      this.getBooksList();
      this.swapCheck();
  }
  closeModal() {
    this.setState({
        bookIsOpen: false
    });
  }

getSwapBook = async () => {
        let userId = localStorage.getItem("user_id");
        const data = { bookOwnerId: userId }
        let result = await axios.post(backendURI + '/book/getSwapBook', data)
        let swapBookDetails = result.data;
        console.log(swapBookDetails);

        let categoriesMap = {};

        swapBookDetails.forEach(detail => {
            if(detail.genre in categoriesMap) {
                categoriesMap[detail.genre] = categoriesMap[detail.genre] + 1;
            } else {
                categoriesMap[detail.genre] = 1;
            }
        });
        await this.setState({ 
            swapBookDetails :swapBookDetails,
            categoriesMap : categoriesMap });
    };

getBooksList = () => {
    let userId=localStorage.getItem("user_id");
    const data={userId : userId}
      axios.post(backendURI +'/book/getSwapBookAllUsers',data)
      .then(response => {
          if(response.status === 200){
              let allBookDetails=response.data;
              let books = [];
              let categories = [];
              let authors = [];
              allBookDetails.forEach(detail => {
                    if(!books.includes(detail.authorName)){
                        books.push({title:detail.bookName});
                    }
                    if(!categories.includes(detail.genre)){
                        categories.push(detail.genre);
                    }
                    if(!authors.includes(detail.authorName)){
                        authors.push({title:detail.authorName});
                    }
              });

              allBookDetails = this.sortAllBooks(allBookDetails, this.state.categoriesMap);
              
              this.setState({
                  allBookDetails   
              });

              this.setState({
                booksList: books,
                categories: categories,
                categorisedBooks: allBookDetails,
                unCategorisedBooks: allBookDetails,
                authorsList: authors,
                dropdownList: books
            });
              
          }
      })
      .catch(err => { 
          this.setState({errorMessage:"Students cannot be viewed"});
      });
};

sortAllBooks = (allBookDetails, categoriesCountMap) => {
    var sortedGenres = [];
    for (var genre in categoriesCountMap) {
        sortedGenres.push([genre, categoriesCountMap[genre]]);
    }

    sortedGenres.sort(function(a, b) {
        return b[1] - a[1];
    });

    var tempBookDetails = [];

    sortedGenres.forEach(genre => {
        allBookDetails.forEach(detail => {
            if(detail.genre === genre[0]) {
                tempBookDetails.push(detail);
            }
        });
    });
    return tempBookDetails;
}

swapCheck = () => {
    let userId=localStorage.getItem("user_id");
    const data={userid : userId}
    console.log(userId);
      axios.post(backendURI +'/requests/swapcheck',data)
      .then(response => {
          if(response.status === 200){
              response.data.forEach(element => {
                if(element.requeststatus != 'Declined'){
                    swapcheck.push(element);
                }
              });
              this.setState({
                swapcheck: swapcheck
            });
          }
      })
      .catch(err => { 
          this.setState({errorMessage:"swapcheck error"});
      });
}

checkSwapStatus = (book) => {
    let result = false;
    swapcheck.forEach(element => {
        if(element.bookName === book.bookName){
            result = true;
        }
    });

    return result;

}



cancelModal() {
    this.setState({
        openMessage:false
    });
}
closeMeetingLocations() {
    this.setState({
        isMeetingLocationModalOpen:false
    });
}
openMeetingLocationModal(zoom, center, loc0, loc1, loc2, loc3, loc4) {
    this.setState({
        isMeetingLocationModalOpen:true,
        zoom: zoom,
        center: center,
        loc0: loc0,
        loc1: loc1,
        loc2: loc2,
        loc3: loc3,
        loc4: loc4
    });
}
openMessageModal(book) {
    this.setState({
        openMessage:true,
        receiverid:book.bookOwnerId,
        receivername:book.bookOwnerName
    });
}

sendSwapRequest = (book) =>{
    console.log(book);
    let data = {
        senderid:localStorage.getItem("user_id"),
        sname:localStorage.getItem("user_name"),
        receiverid: book.bookOwnerId,
        rname: book.bookOwnerName,
        requeststatus: 'In Progress',
        bookName: book.bookName,
        authorName: book.authorName,
        isbnNumber:book.isbnNumber,
        bookDescription:book.description,
        genre:book.genre

    };

    axios.post(backendURI +'/requests/addrequest',data)
    .then(response => {
        if(response.status === 200){
            alert("Your swap request has been submitted successfully");
        }
    })
    .catch(err => { 
        alert("Error in your swap request");
    });

    // Show suggested meeting locations
    this.submitLatLong(book)
}
submitLatLong=(book)=>
   {

    var localLat = 0;
    var localLong = 0;

    navigator.geolocation.getCurrentPosition(
        (position) => {

            localLat = position.coords.latitude
            localLong = position.coords.longitude
            console.log("Cordinates"+localLat, localLong);

            let data = {
            lat1 : book.location.latitude,
            long1 : book.location.longitude,
            lat2: localLat,
            long2: localLong
        }

   axios.post(backendURI +'/latlong/',data)
       .then(response => {
           // console.log("Status Code : ",response.status,response.data);
           if(response.status === 200) {
                var result = response.data;
                let businesses = result["businesses"];

                var center = {lat:result["region"]["center"]["latitude"], lng:result["region"]["center"]["longitude"]}
                var loc0 = {lat:businesses[0]["coordinates"]["latitude"], lng:businesses[0]["coordinates"]["longitude"], text: "A", name: businesses[0]["name"], address: businesses[0]["location"]["display_address"][0] + "," + businesses[0]["location"]["display_address"][1]}
                var loc1 = {lat:businesses[1]["coordinates"]["latitude"], lng:businesses[1]["coordinates"]["longitude"], text: "B", name: businesses[1]["name"], address: businesses[1]["location"]["display_address"][0] + "," + businesses[1]["location"]["display_address"][1]}
                var loc2 = {lat:businesses[2]["coordinates"]["latitude"], lng:businesses[2]["coordinates"]["longitude"], text: "C", name: businesses[2]["name"], address: businesses[2]["location"]["display_address"][0] + "," + businesses[2]["location"]["display_address"][1]}
                var loc3 = {lat:businesses[3]["coordinates"]["latitude"], lng:businesses[3]["coordinates"]["longitude"], text: "D", name: businesses[3]["name"], address: businesses[3]["location"]["display_address"][0] + "," + businesses[3]["location"]["display_address"][1]}
                var loc4 = {lat:businesses[4]["coordinates"]["latitude"], lng:businesses[4]["coordinates"]["longitude"], text: "E", name: businesses[4]["name"], address: businesses[4]["location"]["display_address"][0] + "," + businesses[4]["location"]["display_address"][1]}
                
                this.openMeetingLocationModal(13, 
                    center,loc0,loc1,loc2,loc3,loc4)
           }
       })
       .catch(err => { 
           this.setState({errorMessage:"Message could no be sent"});
       });
                
            });

    console.log(book);
      
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
          if(response.status === 200){
              let allBookDetails=response.data;
              
              this.setState({
                  allBookDetails   
              });
              
          }
      })
      .catch(err => { 
          this.setState({errorMessage:"Students cannot be viewed"});
      });
  };

  selectCategory = (event) => {
    let allBookDetails = [];
    let books = [];
    let authors = [];
    if(event.target.value === ''){
        allBookDetails = this.state.unCategorisedBooks
    }
    else{
        allBookDetails = this.state.unCategorisedBooks.filter(allBookDetail => allBookDetail.genre == event.target.value);
    }
    allBookDetails.forEach(detail => {
        if(!books.includes(detail.authorName)){
            books.push({title:detail.bookName});
        }
        
        if(!authors.includes(detail.authorName)){
            authors.push({title:detail.authorName});
        }
    });
    let options = [];
    if(this.state.selectedOption === 'book'){
        options = books;
    }
    else{
        options = authors;
    }
    this.setState({
        searchString: event.target.value,
        pageIndex:1,
        booksList: books,
        authorsList: authors,
        dropdownList: options,
        searchString: event.target.value
    });
    this.searchBook(event.target.value);
  };

  handleOptionChange = (changeEvent) =>{
    let options = [];

    if(changeEvent.target.value === 'book'){
        options = this.state.booksList;
    }
    else{
        options = this.state.authorsList;
    }

    this.setState({
        selectedOption: changeEvent.target.value,
        dropdownList: options
      });
  };

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
    if(e == null){
        e = '';
    }
    else{
        e = e.title;
    }
    this.setState({
        searchString : e,
        pageIndex:1
    })
}
pageCountInc=async()=>{
    if((this.state.allBookDetails.length)==5)
    {
   await this.setState({
    
        pageIndex:this.state.pageIndex+1 
        
    })
}
this.searchBook(null);
}
pageCountDec=async()=>{
    if(this.state.pageIndex>1)
    {
    await this.setState({
        pageIndex:this.state.pageIndex-1 
    }) 
}
this.searchBook(null);
}
searchBook=(searchString)=>
{
    if(searchString == null){
        searchString = this.state.searchString;
    }
    
    let userId=localStorage.getItem("user_id");
    let data = {
        searchString: searchString,
        pageIndex:this.state.pageIndex,
        userId : userId
    }
    console.log(data);
    axios.post(backendURI +'/book/searchBook',data)
    .then(response => {
        if(response.status === 200){
            let allBookDetails=response.data;
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
                            <th>Chat</th>
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
                     <td><Button disabled={this.checkSwapStatus(book)} onClick={() => this.sendSwapRequest(book)}>Swap Book</Button></td>
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
                            <h3 style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>Book Search</h3>

                            <div class="row">
                                <div class="col-xs-8 col-xs-offset-2">
                                    <div>
                                        <div class="input-group-btn search-panel">


                                        </div>
                                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "0px 0px 10px 0px" }}>
                                            <label style={{ padding: "0px 10px 0px 0px"}}><input type="radio" value="book" checked={this.state.selectedOption === 'book'} onChange={this.handleOptionChange} /> Book</label>
                                            
                                            <label><input type="radio" value="author" checked={this.state.selectedOption === 'author'} onChange={this.handleOptionChange}/> Author</label>
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                            <FormControl variant="outlined" style={{ padding: "0px 10px 0px 0px", width: 150 }}>
                                                <InputLabel htmlFor="outlined-age-native-simple" style={{ zIndex: '0' }}>Category</InputLabel>
                                                <Select
                                                    native
                                                    value={this.state.selectedCategory}
                                                    onChange={this.selectCategory}
                                                    label="Category"
                                                    inputProps={{
                                                        name: 'category',
                                                        id: 'outlined-age-native-simple',
                                                    }}
                                                >
                                                    <option aria-label="None" value=""></option>
                                                    {this.state.categories.map((key, index) => { return <option value={key}>{key}</option> })}
                                                </Select>
                                            </FormControl>
                                            <Autocomplete id="combo-box-demo"
                                                options={this.state.dropdownList}
                                                name="search"
                                                onChange={(event, newValue) => this.bookCriteria(newValue)}
                                                getOptionLabel={(option) => option.title}
                                                style={{ width: 300 }}
                                                renderInput={(params) => <TextField {...params} label="Book Name or Author Name" variant="outlined" style={{ zIndex: '0' }}/>}
                                            />
                                        </div>
                                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "10px 0px 0px 0px" }}>
                                            <button class="btn btn-primary" type="button" onClick={() => this.searchBook(null)}><span class="glyphicon glyphicon-search"></span>Search</button>
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
                <Modal
                    isOpen={this.state.isMeetingLocationModalOpen}
                    onRequestClose={this.closeMeetingLocations}
                    contentLabel="Example Modal" >


                    <div class="panel panel-default">
                        <div class="panel-heading">Meeting Point Suggestions...</div>
                        <div class="panel-body">
                        <SimpleMap 
                          zoom = {this.state.zoom} 
                          center = {this.state.center} 
                          loc0 = {this.state.loc0}
                          loc1 = {this.state.loc1}
                          loc2 = {this.state.loc2}
                          loc3 = {this.state.loc3}
                          loc4 = {this.state.loc4}>
                        </SimpleMap>
                        <AddressTable
                          loc0 = {this.state.loc0}
                          loc1 = {this.state.loc1}
                          loc2 = {this.state.loc2}
                          loc3 = {this.state.loc3}
                          loc4 = {this.state.loc4}>
                        </AddressTable>
                        </div>
                    </div>
                    <center>
                        <Button variant="primary" onClick={this.closeMeetingLocations}>
                            <b>Close</b>
                        </Button>
                    </center>
                </Modal>
            </div>
           
    )
    }
}
//export Home Component
export default Dashboard;