import React from "react";
import {Link} from "react-router-dom"
import {messagesService} from "../_services";
import io from 'socket.io-client';
import "./style.css"
const endpoint = process.env.REACT_APP_API_URL;
class HomePage extends React.Component  {

  constructor(props) {
    super(props);
    this.socket = {};
    this.state = {
      chatHistory:[],
      alert:""
    };
    this.getMessageSocket = this.getMessageSocket.bind(this);
    this.getChatHistory = this.getChatHistory.bind(this);
    this.handleChange = this.handleChange.bind(this);

  }
  handleChange(event){
    const target = event.target;
    this.setState({message:target.value});
  }

  getChatHistory = async e => {
    const _this = this;

    messagesService.history()
        .then(data=>{
          
            if(data.messages && data.messages.length > 0){
                _this.setState({chatHistory:data.messages});
            }
            
        })
        .catch(error=>{
            _this.setState({alert: error.message ? error.message: "Something went wrong"})
        })
  }
  getMessageSocket() {
    let token = localStorage.getItem("token");

    this.socket = io(endpoint , {
      query: `token=${token}`,
      path: '/publish',
      transports: ['websocket']
    });
    this.socket.on('message', (msg)=>{
      console.log('msg',msg);
      if(msg !== undefined && msg !== '') {
        let {chatHistory} = this.state;
        chatHistory.unshift(msg)
        this.setState({
          chatHistory,
          message:''
        },
        () => {
          //this.scrollbars.current.scrollToBottom()
        })
      }

      console.log('message', msg)
    })
  }
  componentDidMount() {
    this.getChatHistory();
    this.getMessageSocket()
  }
  sendMessage(msg){
    messagesService.publish({message:msg})
      .then(data=>{
        console.log('message after send',data)
      })
      .catch(error=>{
        console.log('error',error)
      })

    //this.socket.emit('message', {message:msg});
  }

  onEnterPress = (e) => {
    let element = e.target
    if(e.keyCode == 13 && e.shiftKey == false ) {
      e.preventDefault();
      if(element.value !== '' && element.value.replace(/\s/g, '').length) {
        this.sendMessage(element.value)
      }
    }
  }
  
  render() {
    
    const {chatHistory,message} = this.state;

    return (
      <div className="chat-box">    
            <div className="chat-wrap">
                    <div className="wrap-box">
                    
                        <table >
                        <thead>
                          <tr>
                            <th colSpan="2" scope="colgroup">Messages</th>
                          </tr>
                          </thead>
                        <tbody >
                        {chatHistory.length > 0 ? (
                            chatHistory.map((item, key) => {
                                return (
                                    <tr key={key} >
                                      <td style={{width:"20%"}}>
                                         {item.user.username}
                                      </td>
                                      <td style={{width:"80%"}}>
                                          {item.message}
                                      </td>
                                    </tr>
                                )
                            })
                        ):(
                            <tr>  
                                <td colSpan="2">No Messegesr</td>
                            </tr>
                        )}
                          </tbody>
                        </table>
                    </div>
                    <div className="field-wrap">
                          <textarea id="chat-input" rows="5" placeholder="Type a message…" value={message} onChange={this.handleChange} onKeyDown={this.onEnterPress} />
                          <Link to="/login" className="btn btn-primary">Logout</Link>
                    </div>
           

            </div>

      
       
      </div>
    );
  }
}

export default HomePage;
