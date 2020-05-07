import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import {backendURI} from '../../common/config';

class BookGrid extends Component {
    constructor(){
        super();
        this.state = {  
            books : [],
            index :0
        }
    }  
    //get the books data from backend  
    componentWillMount() {
        this.getSwapBook();
    }

    getSwapBook = async () => {
        let userId=localStorage.getItem("user_id");
        const data={bookOwnerId : userId}
        let result = await axios.post(backendURI +'/book/getSwapBook',data)
        let swapBookDetails = result.data;
        console.log(swapBookDetails);
        await this.setState({ swapBookDetails});
       
    };
    
      handleSelect = (e) => {
        this.setState({
            index : e.target.value
        })
    }

    render() {
      return (
        <div></div>
        )
    }
}
export default BookGrid;