import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { If } from 'rc-if-else';
import axios from 'axios';
import validator from 'validator';

class Register extends Component{
	constructor(props){
		super(props);
		this.state = {
			name: "",
			email: "",
			password: "",
			password2: "",
			errors: ""
		};

		this.validateInput =  this.validateInput.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	validateInput(){
		//Name checks
		if(validator.isEmpty(this.state.name)){
			this.setState({ errors: "Name field is required"});
			return false;
		}
		//Email checks
		if(validator.isEmpty(this.state.email)){
			this.setState({ errors: "Email field is required" });
			return false;
		}else if(!validator.isEmail(this.state.email)){
			this.setState({ errors: "Email is invalid" });
			return false;
		}
		//Password checks
		if(validator.isEmpty(this.state.password)){
			this.setState({ errors: "Password field is required" });
			return false;
		}

		if(validator.isEmpty(this.state.password2)){
			this.setState({ errors: "Confirm password field is required" });
			return false;
		}

		if(!validator.isLength(this.state.password, { min: 6, max: 30 })){
			this.setState({ errors: "Password must be at least 6 characters"});
			return false;
		}

		if(!validator.equals(this.state.password, this.state.password2)){
			this.setState({ errors: "Passwords do not match" });
			return false;
		}
		return true;
	}

	onChange = e =>{
		this.setState({ [e.target.id]: e.target.value });
	}

	onSubmit = e =>{
		e.preventDefault();
		const validate = this.validateInput();

		const newUser = {
			name: this.state.name,
			email: this.state.email,
			password: this.state.password,
			password2: this.state.password2
		}
		if(validate){
			axios.post('http://localhost:3001/users/register', newUser)
				.then(res => {
					this.props.history.push({
						pathname: '/login',
						data: "You can now login"
					});
				})
				.catch(err =>{
					console.log(err);
				});
		}
	}

	render(){

		const { errors } = this.state;
		return(
			<div className="row mt-5">
				<div className="col-md-8 m-auto">
					<div className="card card-body">
						<h1 className="text-center mb-3">Register</h1>
						<If condition={errors !== ""}>
							<div className="alert alert-warning alert-dismissible fade show" role="alert">
								{errors}
								<button type="button" className="close" data-dismiss="alert" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
						</If>
						<form onSubmit={this.onSubmit}>
							<div className="form-group">
								<label htmlFor="name">Name</label>
								<input onChange={this.onChange}
									value={this.state.name}
									id="name"
									className="form-control"
									placeholder="Enter Name"/>
							</div>
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
									value={this.state.password}
									id="password"
									type="password"
									className="form-control"
									placeholder="Enter Password"/>
							</div>
							<div className="form-group">
								<label htmlFor="password2">Confirm Password</label>
								<input onChange={this.onChange}
									value={this.state.password2}
									id="password2"
									type="password"
									className="form-control"
									placeholder="Confirm Password"/>
							</div>
							<button type="submit" className="btn btn-primary btn-block">Register</button>
						</form>
						<p className="lead mt-4">
							Have an Account? <Link to="/login">Login</Link>
						</p>
					</div>
				</div>
			</div>
		);
	}
}

export default withRouter(Register);