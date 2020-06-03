import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import {userService} from "../_services";

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            submitted: false,
            validationErrors: {},
            redirectUrl:''
        };
        userService.logout();
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.valid = this.valid.bind(this);
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }
    valid({username,password}){
        const validationErrorsNew = {};
        if(!username)
            validationErrorsNew.username = "Username is required";
        if(!password)
            validationErrorsNew.password = "Password is required";

        this.setState({validationErrors:validationErrorsNew});
        return Object.keys(validationErrorsNew).length > 0 ? false : true;
        
    }
    handleSubmit(e) {
        e.preventDefault();
        const _this = this;
        this.setState({ submitted: true });
        const { username, password } = this.state;
        if(!this.valid({ username, password })){
            return ;
        }
        userService.login(username, password)
                .then(data=>{
                    console.log(data)
                    _this.setState({redirectUrl:"/dashboard"});
                })
                .catch(error=>{
                    console.log('error',error)
                    const state = {};
                   if(error.validationErrors)
                      state.validationErrors = error.validationErrors;
                    
                   if(error.message) 
                      state.errorMessage = error.message;

                     _this.setState(state)
                })
    }

    render() {
        if(this.state.redirectUrl){
            return  <Redirect to={this.state.redirectUrl} />
        }
        const { username, password, submitted, validationErrors } = this.state;
        return (
            <div className="col-md-6 col-md-offset-3">
                <h2>Login</h2>
                <form name="form" onSubmit={this.handleSubmit}>
                    <div className={'form-group' + (submitted && validationErrors.username ? ' has-error' : '')}>
                        <label htmlFor="username">Username</label>
                        <input type="text" className="form-control" name="username" value={username} onChange={this.handleChange} />
                        {submitted && validationErrors.username &&
                            <div className="help-block">{validationErrors.username}</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && validationErrors.password ? ' has-error' : '')}>
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" name="password" value={password} onChange={this.handleChange} />
                        {submitted && validationErrors.password  &&
                            <div className="help-block">{validationErrors.password}</div>
                        }
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary">Login</button>
                        <Link to="/register" className="btn btn-link">Register</Link>
                    </div>
                </form>
            </div>
        );
    }
}

export default LoginPage