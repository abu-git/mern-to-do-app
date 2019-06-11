import React, { Component } from 'react';
import { If } from 'rc-if-else';
import axios from 'axios';
import validator from 'validator';

class Create extends Component{
	constructor(props){
		super(props);
		this.state = {
			description: "",
			deadline: "",
			owner: this.props.location.state,
			errors: "",
			redirectToReferrer: undefined
		};

		this.validateInput = this.validateInput.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.onChange = this.onChange.bind(this);
	}

	backToDash = e => {
		e.preventDefault();

		this.props.history.push({
			pathname: '/dashboard',
			data: this.state.owner
		});
	}

	validateInput(){
		//Desritption check
		if(validator.isEmpty(this.state.description)){
			this.setState({ errors: "Task Description field is required" });
			return false;
		}
		//Deadline check
		if(validator.isEmpty(this.state.deadline)){
			this.setState({errors: "Task Deadline field is required" });
			return false;
		}
		return true;
	}

	onSubmit = e => {
		e.preventDefault();
		//validate submitted input
		const validate = this.validateInput();

		//if valid, proceed
		if(validate){
			//create new task object
			const newTask = {
				description: this.state.description,
				deadline: this.state.deadline,
				owner: this.state.owner
			};
			//post to backend for saving
			axios.post('/users/add', newTask)
				.then(res =>{
					this.props.history.push({
						pathname: '/dashboard',
						data: this.state.owner
					});
				})
				.catch(err => {
					console.log(err);
				});
		}
	}

	onChange = e => {
		this.setState({ [e.target.id]: e.target.value });
	}

	componentDidMount(){
		const { data } = this.props.location.state;
		if(!this.props.location.state){
			this.props.history.push("/login");
		}else{
			this.setState({ owner: data, redirectToReferrer: true });
		}	
	}


	render(){
		
		const { data } = this.props.location.state;
		const { errors } = this.state; 
		return(
			<div className="card card-body mt-3">
				<If condition={errors}>
					<div className="alert alert-warning alert-dismissible fade show" role="alert">
						{errors}
						<button type="button" className="close" data-dismiss="alert" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
				</If>
				<h2>Hello {data}</h2>
				<p className="lead mb-3">Create a task below</p>
				<form onSubmit={this.onSubmit}>
					<input type="hidden" name="_id" value={this.state._id}/>
					<input type="hidden" owner="owner" value={this.state.owner} onChange={this.onChange}/>
					<div className="form-group">
						<label htmlFor="description">Task Description</label>
						<input onChange={this.onChange}
							value={this.state.description} 
							id="description"
							className="form-control" 
							rows="2" />
					</div>
					<div className="form-group">
						<label htmlFor="deadline">Task Deadline</label>
						<input onChange={this.onChange} 
							className="form-control" 
							id="deadline" 
							rows="1" 
							value={this.state.deadline} 
							placeholder="e.g March 19 2019"/>
					</div>
					<div className="form-group">
						<button type="submit" className="btn btn-outline-primary">Add Task</button>{" "}
						<button onClick={this.backToDash} className="btn btn-primary">Back to Dashboard</button>
					</div>
				</form>
			</div>
		);
	}
}

export default Create;