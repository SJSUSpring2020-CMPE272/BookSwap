import React, {Component} from 'react';
import '../../App.css';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import quote1 from '../../common/quote1.jpg';
import quote2 from '../../common/quote2.jpg';
import quote3 from '../../common/quote3.jpg';

import { CarouselProvider, Slider, Slide } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

class Aboutus extends Component {
    constructor(){
        super();
        this.state = {  
            books : [],
            index :0
        }
       

    }  
    //get the books data from backend  
    
      handleSelect = (e) => {
        this.setState({
            index : e.target.value
        })
    }
        
    
      
    render(){
        //iterate over books to create a table row
      
        //if not logged in go to login page
        let redirectVar = null;
        let index=this.state.index;
        
        
        return(
           
           <div>
     
               
                <div class="container">
                    <div class="center">
  <h1 style={{"text-align": "center"}}>Book Swap</h1>
  <br></br>
  </div>
  <div class="row">
		<div class="col-md-12">
        <div class="center">
            <p style = {{"font-size":"20px","font-style":"regular","text-align": "center"}}>
            This website is to help connecting book-lovers.
            In this era of digitalization we understand that there are many who still enjoy reading in old-fashioned way.Here we will help connect these like-minded people.
            You can register with us and add books that you want to swap, if there is another user who wish to read that book, then he can start a conversation and connect to you.
            If you two wish to swap your books, you can meet and swap books at your place of convenience.
</p>
<br></br>
<p style = {{"font-size":"20px","font-style":"regular","text-align": "center"}}>
            This would create a win-win situation for all.
            Users get to enjoy reading new books without buying and also have a chance to make new like-minded friends.
</p>
<br></br>
<p style = {{"font-size":"20px","font-style":"regular","text-align": "center"}}>
            Based on your favourite books we would try to recommend you books, then the users who have that book available to swap.
            Thus connecting you to right users.
           
    </p>
    <br></br>
    <div class="center" style={{"text-align": "center"}}>
    <CarouselProvider
        naturalSlideWidth={100}
        naturalSlideHeight={125}
        totalSlides={3}
        isPlaying={true}
      >
          
        <Slider>
          <Slide index={0}><img src={quote1} style={{width:900,height:500,justifyContent: "center"}}></img></Slide>
          <Slide index={1}><img src={quote2} style={{width:900,height:500,justifyContent: "center"}}></img></Slide>
          <Slide index={2}><img src={quote3} style={{width:900,height:500,justifyContent: "center"}}></img></Slide>
        </Slider>
      </CarouselProvider>
            
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
export default Aboutus;