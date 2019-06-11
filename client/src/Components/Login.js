import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { If } from 'rc-if-else';
import axios from 'axios';
import validator from 'validator';

import authCentralState from './Authentication';

class Login extends Component{
	constructor(props){
		super(props);
		this.state = {
			email: "",
			password: "",
			errors: "",
			redirectToReferrer: false //state prop for authentication
		};

		this.validateInput = this.validateInput.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	validateInput(){
		//Email checks
		if(validator.isEmpty(this.state.email)){
			this.setState({ errors: "Email field is required" });
			return false;
		}else if(!validator.isEmail(this.state.email)){
			this.setState({ errors: "Email is invalid" });
			return false;
		}
		//Password check
		if(validator.isEmpty(this.state.password)){
			this.setState({ errors: "Password field is required" });
			return false;
		}
		return true;
	}

	onSubmit = e => {
		e.preventDefault();
		const validate = this.validateInput();
		if(validate){
			const newUser = {
				email: this.state.email,
				password: this.state.password
			};

			axios.post('/users/login', newUser)
				.then(res => {
					authCentralState.authenticate(() =>	{
						this.setState({ redirectToReferrer: true })
					});
					const username = res.data.user;
					console.log(username);
					this.props.history.push({
						pathname: '/dashboard',
						data: username,
						stateRedirect: true
					});
				})
				.catch((err) =>{
					console.log("error");
					this.setState({ errors: "Incorrect Login details."})
					this.props.history.push('/login');
				});
		}
	}

	onChange = e => {
		this.setState({ [e.target.id]: e.target.value });
	}

	render(){

		const { loginError } = this.props.location;
		const errors = this.state.errors;	
		const { data } = this.props.location;	

		return(
			<div className="row mt-5">
				<div className="col-md-8 m-auto">
					<div className="card card-body">
						<If condition={loginError}>
							<div className="alert alert-warning alert-dismissible fade show" role="alert">
								{loginError}
								<button type="button" className="close" data-dismiss="alert" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
						</If>
						<h1 className="text-center mb-3">Login</h1>

						<If condition={errors !== ""}>
							<div className="alert alert-warning alert-dismissible fade show" role="alert">
								{errors}
								<button type="button" className="close" data-dismiss="alert" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
						</If>
						<If condition={data}>
							<div className="alert alert-warning alert-dismissible fade show" role="alert">
								{data}
								<button type="button" className="close" data-dismiss="alert" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
						</If>
						<form onSubmit={this.onSubmit}>
							<div className="form-group">
								<label htmlFor="email">Email</label>
								<input onChange={this.onChange}
									value={this.state.email}
									id="email"
									className="form-control"
									placeholder="Enter Email"/>
							</div>
							<div className="form-group">
								<label htmlFor="password">Password</label>
								<input onChange={this.onChange}
									type="password"
									value={this.state.password}
									id="password"
									className="form-control"
									placeholder="Enter Password"/>
							</div>
							<button type="submit" className="btn btn-primary btn-block">Login</button>
						</form>
						<p className="lead mt-4">
							No Account? <Link to="/register">Register</Link>
						</p>
					</div>
				</div>
			</div>
		);
	}
}

export default Login;