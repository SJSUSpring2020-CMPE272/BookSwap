import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import {Redirect} from 'react-router';
import dummy from '../../common/dummy.png';
import bookdummy from '../../common/books.png';
import {backendURI} from '../../common/config';

import Modal from 'react-modal';
import { Button } from 'react-bootstrap';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
          user_profile:[],
          swapBookDetails:[],
          showEditModal:false,
          showSwapModal:false,
          categoryValue:'Romance'
           
        };
        this.closeModal = this.closeModal.bind(this);
      }

      componentWillMount() {
        this.getProfile();
        this.getSwapBook();
        
    }
        getProfile = async () => {
          let userId=localStorage.getItem("user_id");
          const data={userId : userId}
          let result = await axios.post(backendURI +'/profile',data)
          let user_profile = result.data;
          console.log(user_profile);
          await this.setState({ user_profile});
          localStorage.setItem("user_profile",JSON.stringify(user_profile));
          
          
          console.log(user_profile._id);
      };

      getSwapBook = async () => {
        let userId=localStorage.getItem("user_id");
        const data={bookOwnerId : userId}
        let result = await axios.post(backendURI +'/book/getSwapBook',data)
        let swapBookDetails = result.data;
        console.log(swapBookDetails);
        await this.setState({ swapBookDetails});
       
    };
      handleEdit = ()=>{

        this.setState({ showEditModal:true});
                
       }
       handleSwapAdd = ()=>{

        this.setState({ showSwapModal:true});
                
       }
       closeModal() {
        this.setState({
            showEditModal:false,
            showSwapModal:false
  
        });
    }

    
            onSubmit = async (e) => {
              e.preventDefault();
              const data = {
                  userId:this.state.user_profile.userId,
                  userName:this.state.userName||this.state.user_profile.name,
                  userEmail :this.state.user_profile.emailId,
                  userAboutMe:this.state.userAboutMe||this.state.user_profile.aboutMe,
                  userContactNumber:this.state.userContactNumber||this.state.user_profile.contactNumber,
                  userCity:this.state.userCity||this.state.user_profile.city,
                  userState:this.state.userState||this.state.user_profile.state,
                  userCountry:this.state.userCountry||this.state.user_profile.country
    
              }
              console.log("data going to update"+JSON.stringify(data));
              //set the with credentials to true
              axios.defaults.withCredentials = true;
              axios.post(backendURI +'/profile/update',data)
              .then(response => {
              if (response.status === 200) {
                  this.setState({
                      showEditModal: false
                  });
                 
                  this.getProfile();
              }
          })
          .catch(err => { 
              this.setState({errorMessage: "error"});
          })
      } 

      onSwapSubmit = async (e) => {
        e.preventDefault();
        const data = {
            bookOwnerId:this.state.user_profile.userId,
            bookOwnerName:this.state.user_profile.name,
            bookOwnerEmail :this.state.user_profile.emailId,
            bookName:this.state.bookName,
            authorName:this.state.authorName,
            description:this.state.swapBookDescription,
            isbnNumber:this.state.isbnNumber,
            category:this.state.categoryValue
        }
        console.log("data going to book"+JSON.stringify(data));
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        axios.post(backendURI +'/book/addSwapBook',data)
        .then(response => {
        if (response.status === 200) {
            this.setState({
                showSwapModal: false
            });
           
            this.getSwapBook();
        }
    })
    .catch(err => { 
        this.setState({errorMessage: "error"});
    })
} 
      userNameChangeHandler = (e) => {
        this.setState({
            userName: e.target.value
        });
    };
    aboutChange = (e) => {
        this.setState({
            userAboutMe: e.target.value
        });
    };
    contactChange = (e) => {
        this.setState({
            userContactNumber: e.target.value
        });
    };
    cityChange = (e) => {
      this.setState({
          userCity: e.target.value
      });
  };
  stateChange = (e) => {
      this.setState({
          userState: e.target.value
      });
  };
  countryChange = (e) => {
      this.setState({
          userCountry: e.target.value
      });
  };
  bookNameChangeHandler = (e) => {
    this.setState({
        bookName: e.target.value
    });
};
authorChange = (e) => {
  this.setState({
      authorName: e.target.value
  });
};
isbnChange= (e) => {
  this.setState({
      isbnNumber: e.target.value
  });
};
bookDescriptionChange= (e) => {
  this.setState({
      swapBookDescription: e.target.value
  });
};
handleCategoryChange =(e)=>{
  this.setState({
      categoryValue : e.target.value
  })

}
  handleDeletion=async(swapBook)=>
  {
   await this.setState({
        bookId: swapBook._id
    });
    const data = {
        bookId:this.state.bookId
    }
    console.log("data going to book"+JSON.stringify(data));
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    axios.post(backendURI +'/book/removeSwapBook',data)
    .then(response => {
    if (response.status === 200) {
        this.setState({
            removeBook:true
        });
    }
    
}
)
.catch(err => { 
    this.setState({errorMessage: "error"});
})
await this.getSwapBook();
  }
    
  

    render() {
      let redirectVar;let userImage=dummy;let bookImage=bookdummy;
        if (!localStorage.getItem("token")) {
            redirectVar = <Redirect to="/login" />;
        }
        return (
          <div>
          {redirectVar}
          <div class="container">
          <div className="row mt-3">
                <div className="col-sm-4">
                    <div className="card" style={{width: 15 +"rem"}}>
                        <img className="card-img-top" src={userImage} alt="" />
                        <button type="button" id="picEdit" className="btn btn-primary btn-block btn-xs pull-right" onClick={this.handleImageEdit}>Edit Profile Picture</button>
                        <div className="text-center">
                        <div className="card-body">
                        <div class="panel panel-default">
                 
                  <div class="panel-body">{this.state.user_profile.name}</div>
                  </div>
                     </div>
                    </div>
                    </div>
                </div>
                
                <div className="col-sm-7">
                <div class="panel panel-default">
                  <div class="panel-heading">About</div>
                  <div class="panel-body">{this.state.user_profile.name}</div>
                  <div class="panel-body">{this.state.user_profile.emailId}</div>
                  <div class="panel-body">{this.state.user_profile.aboutme}</div>
                  <div class="panel-body">{this.state.user_profile.contactNumber}</div>
                  <div class="panel-body">{this.state.user_profile.city}</div>
                  <div class="panel-body">{this.state.user_profile.state}</div>
                  <div class="panel-body">{this.state.user_profile.country}</div>

              </div>
                   <div class="panel-footer text-right">
               <button type="button" id="profileEdit" class="btn btn-primary btn-block pull-right" onClick={this.handleEdit}>Edit Basic Details</button>
               <button type="button" id="swapBookAdd" class="btn btn-primary btn-block pull-right" onClick={this.handleSwapAdd}>Add Books you want to Swap</button>
              
                  </div>
                  
                  {this.state.swapBookDetails.map(swapBook =>
                  <div key={swapBook._id}>
                    <div class="panel panel-default">
                    <div class="panel-heading">Added Book Details</div>
                    
                    <div className="card" style={{width: 15 +"rem"}}>
                          <img className="card-img-top" src={swapBook.imageUrl||bookImage} alt="" />
                          </div>   
                    <div class="panel-body">Book Name: {swapBook.bookName}</div>
                    <div class="panel-body">Book Author: {swapBook.authorName}</div>
                    <div class="panel-body">Genre: {swapBook.genre}</div>
                    <div class="panel-body">ISBN Number: {swapBook.isbnNumber}</div>
                    <div class="panel-body">Description: {swapBook.bookDescription}</div>
                    </div>
                    <div class="panel-footer">
                    <button type="button" id="swapBookDel" class="btn btn-primary btn-danger pull-right" onClick={() =>this.handleDeletion(swapBook)}>Remove</button>
                  </div>
                  </div>
                    )
                  }
             
            
    </div> 
    </div>
    <Modal
       isOpen={this.state.showEditModal}
       onRequestClose={this.closeModal}
        contentLabel="Example Modal" >
      <div>             
      <form onSubmit={this.onSubmit}>
            <div class="container">
            <div class="panel panel-default">
                    <div class="panel-heading">Let us know more about you...</div>
                            <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1"><b>Username</b></span>
                                </div>
                                <input type="text" size="50" name="user_name" className="form-control" aria-label="Username" aria-describedby="basic-addon1" onChange={this.userNameChangeHandler} defaultValue={this.state.user_profile.name}  pattern=".*\S.*" title="Please enter a unique user name.Username cannot be spaces" required />
                            </div>

                            <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1"><b>About me</b></span>
                                </div>
                                <input type="text" size="50" name="aboutMe" className="form-control" aria-label="aboutMe" aria-describedby="basic-addon1" onChange={this.aboutChange} defaultValue=
                                {this.state.user_profile.aboutme}  pattern=".*\S.*"/>
                            </div>
                            <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1"><b>Email</b></span>
                                </div>
                                <input type="email" size="50" name="email_id" className="form-control" aria-label="Email" aria-describedby="basic-addon1" defaultValue=
                                {this.state.user_profile.emailId} readOnly />
                            </div>
                            <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1"><b>Contact Number</b></span>
                                </div>
                                <input type="number" size="50" name="contactNumber" className="form-control" aria-label="ContactNumber" aria-describedby="basic-addon1" onChange={this.contactChange} defaultValue= {this.state.user_profile.contactNumber} pattern=".*\S.*" />
                            </div>
                            <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1"><b>City</b></span>
                                </div>
                                <input type="text"size="50" name="city" className="form-control" aria-label="City" aria-describedby="basic-addon1" onChange={this.cityChange} defaultValue= {this.state.user_profile.city}  pattern=".*\S.*"  />
                            </div>

                            <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1"><b>State</b></span>
                                </div>
                                <input type="text"size="50" name="state" className="form-control" aria-label="State" aria-describedby="basic-addon1" onChange={this.stateChange} defaultValue={this.state.user_profile.state}  pattern=".*\S.*" />
                            </div>
                            <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1"><b>Country</b></span>
                                </div>
                                <input type="text"size="50" name="country" className="form-control" aria-label="country" aria-describedby="basic-addon1" onChange={this.countryChange} defaultValue= {this.state.user_profile.country} pattern=".*\S.*" />
                            </div>
                            
                            <center>
                                <Button variant="primary" type="submit">
                                    <b>Update</b>
                                </Button>&nbsp;&nbsp;
                                <Button variant="secondary" onClick={this.closeModal}>
                                    <b>Close</b>
                                </Button>
                            </center>
                            </div>
                            </div>
                        </form>
    </div>
   </Modal>
   <Modal
       isOpen={this.state.showSwapModal}
       onRequestClose={this.closeModal}
        contentLabel="Example Modal" >
      <div>             
      <form onSubmit={this.onSwapSubmit}>
            <div class="container">
            <div class="panel panel-default">
                    <div class="panel-heading">Let us know more about book you want to swap: </div>
                            <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1"><b>Book name</b></span>
                                </div>
                                <input type="text" size="50" name="book_name" className="form-control" aria-label="bookname" aria-describedby="basic-addon1" onChange={this.bookNameChangeHandler} pattern=".*\S.*" title="Please enter a bookname, bookname cannot be spaces" required />
                            </div>

                            <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1"><b>Author Name</b></span>
                                </div>
                                <input type="text" size="50" name="authorName" className="form-control" aria-label="authorName" aria-describedby="basic-addon1" onChange={this.authorChange}
                                  pattern=".*\S.*"/>
                            </div>
                            <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1"><b>Isbn Number</b></span>
                                </div>
                                <input type="text" size="50" name="isbnnumber" className="form-control" aria-label="ISBN" aria-describedby="basic-addon1" onChange={this.isbnChange} title="No hyphens" required/>
                            </div>
                            <div className="input-group mb-2">
    <div className="input-group-prepend">
        <span className="input-group-text" id="basic-addon1"><b>Genre</b></span>
    </div>
    <select value={this.state.categoryValue} onChange={this.handleCategoryChange}  className="form-control" aria-label="category" aria-describedby="basic-addon1"  required >
    <option value="romance">Romance</option>
    <option value="mystery">Mystery</option>
    <option value="fantasy">Fantasy</option>
    <option value="fiction">Fiction</option>
    <option value="thriller">Thriller</option>
    <option value="horror">Horror</option>
    <option value="humor">Humor</option>
    <option value="classics">Classics</option>
    <option value="adult">Adult</option>
    <option value="historical">Historical</option>
    <option value="paranormal">Paranormal</option>
    <option value="contemporary">Contemporary</option>
    <option value="chick-lit">Chick-lit</option>
    <option value="young-adult">Young adult</option>
    <option value="childrens">Children's</option>
    <option value="Inspirational, self-help, and religious books">Inspirational, self-help, and religious books</option>
    <option value="Biography, autobiography, and memoir">Biography, autobiography, and memoir</option>
    <option value="Technology">Technology</option>
    <option value="Others">Others</option>
    </select>
</div>
                           
                           
                            <div className="input-group mb-2">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1"><b>Book Description</b></span>
                                </div>
                                <input type="text"size="50" name="state" className="form-control" aria-label="bookDescription" aria-describedby="basic-addon1" onChange={this.bookDescriptionChange} pattern=".*\S.*" />
                            </div>
                           
                            
                            <center>
                                <Button variant="primary" type="submit">
                                    <b>Add Book</b>
                                </Button>&nbsp;&nbsp;
                                <Button variant="secondary" onClick={this.closeModal}>
                                    <b>Close</b>
                                </Button>
                            </center>
                            </div>
                            </div>
                        </form>
    </div>
   </Modal>
    </div>
    </div>
    )
  }
}

export default Profile;

