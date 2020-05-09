import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import { Button, Form} from "react-bootstrap";
import {backendURI} from '../../common/config';

class Requests extends Component {

    constructor(props) {
        super(props);
        this.state = {
          requests:[]
           
        };
        this.getRequests = this.getRequests.bind(this);
        
    }

    componentWillMount() {
        this.getRequests();
     }


    getRequests = ()=>{
        let data = { userid: localStorage.getItem("user_id") }

        axios.post(backendURI + '/requests/getrequests', data)
            .then(response => {

                if (response.status === 200) {
                    console.log(response.data);
                    this.setState({
                        requests: response.data
                    });

                }
            })
            .catch(err => {
                this.setState({ errorMessage: "Messages cannot be viewed" });
            });
    }

    updateRequeststatus = (status, request) => {
        let data = { userid: localStorage.getItem("user_id"), status: status, senderid: request.senderid, bookName: request.bookName};
        axios.post(backendURI + '/requests/updaterequest', data)
            .then(response => {

                if (response.status === 200) {
                    alert(status + " swap request");

                }
            })
            .catch(err => {
                alert("Error in updating request");
            });
    }


     render(){
         let requests = null;
         if(this.state.requests.length > 0){
             requests = <div className="panel panel-default p50 uth-panel">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Book Name</th>
                                        <th>Author Name</th>
                                        <th>Requester Name</th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.requests.map(request =>
                                        <tr key={request._id}>
                                            <td>{request.bookName}</td>
                                            <td>{request.authorName}</td>
                                            <td>{request.sname}</td>
                                            <td><Button onClick={() => this.updateRequeststatus('Accepted', request)}>Accept</Button></td>
                                            <td><Button onClick={() => this.updateRequeststatus('Declined', request)}>Decline</Button></td>
                                        </tr>
                                    )
                                    }
                                </tbody>
                            </table>
                        </div>
         }
         else{
            requests = <h1 style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>No pending requests</h1>
         }
         return(
             <div style={{ padding: "20px"}}>
                {requests}
             </div>
         )
     }
}

export default Requests;