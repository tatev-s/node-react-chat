import React from 'react';
import { Link } from 'react-router-dom';
import {userService} from "../_services";

class RegisterPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {
                username: '',
                password: '',
                repassword: ''
            },
            validationErrors:{},
            registerSuccess :false,
            errorMessage: "",
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.valid = this.valid.bind(this);
    }

    handleChange(event) {
        const { name, value } = event.target;
        const { user } = this.state;
        this.setState({
            user: {
                ...user,
                [name]: value
            }
        });
    }
    valid(user){
        const validationErrorsNew = {};
        if(!user.username)
            validationErrorsNew.username = "Username is required";
        if(!user.password)
            validationErrorsNew.password = "Password is required";
        if(!user.repassword)
            validationErrorsNew.repassword = "Password Confirmation is required";
        if(user.password && user.repassword && user.repassword !== user.password)
            validationErrorsNew.repassword = "Password confirmation doesn't match Password";
        
        this.setState({validationErrors:validationErrorsNew});
        return Object.keys(validationErrorsNew).length > 0 ? false : true;
        
    }
    handleSubmit(event) {
        event.preventDefault();
        const _this = this;
        this.setState({ submitted: true });
        const { user } = this.state;

        if(!this.valid(user)){
            return ;
        }
        userService.register(user)
                .then(data=>{
                    _this.setState({registerSuccess:true});
                })
                .catch(error=>{
                    console.log('error',error.validationErrors)
                    const state = {};
                   if(error.validationErrors)
                      state.validationErrors = error.validationErrors;
                    
                   if(error.message) 
                      state.errorMessage = error.message;

                     _this.setState(state)
                })
   
       
    }

    render() {
        const { user, submitted, validationErrors,registerSuccess } = this.state;
        if(registerSuccess){
            return (
                <div className="col-md-6 col-md-offset-3">
                   <h2>Signup successed!</h2>
                    Please got to <Link to="/login" className=" btn-link">signin</Link> page
                </div>
            )
        }
        return (
            <div className="col-md-6 col-md-offset-3">
               
                <h2>Register</h2>
                <form name="form" onSubmit={this.handleSubmit}>

                    <div className={'form-group' + (submitted && validationErrors.username ? ' has-error' : '')}>
                        <label htmlFor="username">Username</label>
                        <input type="text" className="form-control" name="username" value={user.username} onChange={this.handleChange} />
                        {submitted && validationErrors.username &&
                            <div className="help-block">{validationErrors.username}</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && validationErrors.password ? ' has-error' : '')}>
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" name="password" value={user.password} onChange={this.handleChange} />
                        {submitted && validationErrors.password &&
                            <div className="help-block">{validationErrors.password}</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && validationErrors.repassword ? ' has-error' : '')}>
                        <label htmlFor="password">Password Confirmation</label>
                        <input type="password" className="form-control" name="repassword" value={user.repassword} onChange={this.handleChange} />
                        {submitted && validationErrors.repassword &&
                            <div className="help-block">{validationErrors.repassword}</div>
                        }
                        
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary">Register</button>
                        <Link to="/login" className="btn btn-link">Cancel</Link>
                    </div>
                </form>
            </div>
        );
    }
}

export default  RegisterPage 