import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import {Redirect} from 'react-router';
import Modal from 'react-modal';
import { Button, Form} from "react-bootstrap";
import {backendURI} from '../../common/config';
import BookGrid from './BookGrid'

class Messages extends Component {
    constructor(props) {
        super(props);
        this.state = {
          messages:[],
          sender:[],
          receiver:[],
          openConversationFlag:false,
          conversations:[],
          userId_2:'',
          newmessage:''
           
        };
        this.closeModal = this.closeModal.bind(this);
        
    }
    componentWillMount() {
      this.getAllReceiver();
      this.getAllSender();
   }
getAllReceiver=()=>
{
   let data =
   {
       userid:localStorage.getItem("user_id")  
   }
   axios.post(backendURI +'/messages/getAllReceiver',data)
       .then(response => {
           console.log("Status Code : ",response.status);
           if(response.status === 200){
               let receiver=response.data; 
               console.log(JSON.stringify(receiver))
               this.setState({
                   receiver 
               });
               localStorage.setItem("receiver",JSON.stringify(receiver));
               this.props.getAllConversation();
           }
       })
       .catch(err => { 
           this.setState({errorMessage:"Messages cannot be viewed"});
       });
}
getAllSender=()=>
{
   let data =
   {
       userid:localStorage.getItem("user_id")  
   }
   axios.post(backendURI +'/messages/getAllSender',data)
       .then(response => {
           console.log("Status Code : ",response.status);
           if(response.status === 200){
               let sender=response.data; 
               console.log(JSON.stringify(sender))
               this.setState({
                   sender  
               });
               localStorage.setItem("sender",JSON.stringify(sender));
               this.props.getAllConversation();
           }
       })
       .catch(err => { 
           this.setState({errorMessage:"Messages cannot be viewed"});
       });
}
openConversation(message){
   this.setState({
       openConversationFlag: true,
       userId_2:message.id ,
       username2:message.name
        
   });
  
   const data={userId_1:localStorage.getItem("user_id"),
       userId_2 :message.id,
   
   };
   axios.post(backendURI +'/messages/getAllMessages',data)
   .then(response => {
       console.log("Status Code : ",response.status);
       if(response.status === 200){
           let conversations=response.data.conversation;
           console.log(JSON.stringify(conversations));
           this.setState({
               conversations 
           });
           localStorage.setItem("conversation",JSON.stringify(conversations));
               this.props.getAllMessages();
       }
   })
   .catch(err => { 
       this.setState({errorMessage:"Conversations could not be viewed"});
   });

}
closeModal() {
   this.setState({
       openConversationFlag:false
      
   });
}
messageContentHandler=(e)=>
   {
       this.setState({
           newmessage : e.target.value
       })
   }
   submitMessage=()=>
   {
       let data = {
           userid:localStorage.getItem("user_id"),
           senderid:localStorage.getItem("user_id"),
           sname:localStorage.getItem("user_name"),
           senderUserType:2 ,
           receiverid:this.state.userId_2,
           receivername:this.state.username2,
           receiverUserType:1,
           content:this.state.newmessage
       }
   axios.post(backendURI +'/messages/',data)
       .then(response => {
           console.log("Status Code : ",response.status,response.data);
           if(response.status === 200){
               alert("Message sent"); 
               this.setState({
                   openConversationFlag: false
                     
               }); 
           }
       })
       .catch(err => { 
           this.setState({errorMessage:"Message could no be sent"});
       });
      
   }  
    
  

    render() {
      let redirectVar;
      
        if (!localStorage.getItem("token")) {
            redirectVar = <Redirect to="/login" />;
        }
        let all;
       all=[...this.state.sender,...this.state.receiver];
       console.log("all"+JSON.stringify(all));

        return (
          <div>
          {redirectVar}
     <div>
         <div className="panel panel-default p50 uth-panel">
      <table className="table table-hover">
          <thead>
              <tr>
                  <th>Messages</th>

                  
              </tr>
          </thead>
          <tbody>
          {all.map(message =>
              <tr key={message.id}>
              <td>{message.name}</td>
              <td><a onClick={() => this.openConversation(message)}>View Conversation</a></td>
              </tr>
          
          )}
           </tbody>
      </table>
      </div>
      <Modal
                      isOpen={this.state.openConversationFlag}
                      onRequestClose={this.closeModal}
                       contentLabel="Example Modal" >
                           <div className="row mt-3">
          {this.state.conversations.map(conversation =>
                <div key={conversation._id}>
              <div class="panel panel-default">
               <div class="panel-heading">{conversation.sname}:</div>
              <div class="panel-body">{conversation.content}</div>
              </div>
              </div>
              )
              
              }
            </div>
            <Form  >
                  <Form.Control as="textarea" rows="3" name="input_message" placeholder="Type your message..." onChange={this.messageContentHandler} pattern="^[A-Za-z0-9 ,.-]+$" required />
                  <br />
                  
              </Form>
                   <center>
                   <Button variant="primary" onClick={() => this.submitMessage()}>
                              <b>Send Message</b>
                          </Button>{" "}
                          <Button variant="primary" onClick={this.closeModal}>
                              <b>Close</b>
                          </Button>
                      </center>
                  </Modal>
      </div>
      </div>
  )
 
    
  }
}

export default Messages;