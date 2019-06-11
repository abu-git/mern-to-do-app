import React, { Component } from 'react';
import { If } from 'rc-if-else';
import axios from 'axios';
//import Moment from 'react-moment';
import validator from 'validator';


class Edit extends Component{
	constructor(props){
		super(props);
		this.state = {
			_id: "",
			description: "",
			owner: "",
			deadline: "",
			redirectToReferrer: undefined,
			errors: ""
		};
	}

	backToDash = e => {
		e.preventDefault();

		this.props.history.push({
			pathname: '/dashboard',
			data: this.state.owner
		});
	}

	validateInput(){
		if(validator.isEmpty(this.state.description)){
			this.setState({ errors: "Task Description field is required" });
			return false;
		}

		if(validator.isEmpty(this.state.deadline)){
			this.setState({errors: "Task Deadline field is required" });
			return false;
		}
		return true;
	}

	onChange = e => {
		this.setState({ [e.target.id]: e.target.value });
	}

	onSubmit = e => {
		e.preventDefault();
		const validate = this.validateInput();
		if(validate){
			const newTask = {
				_id: this.state._id,
				description: this.state.description,
				deadline: this.state.deadline,
				owner: this.state.owner
			};

			axios.post('http://localhost:3001/users/dashboard/update', newTask)
				.then(res =>{
					//console.log("task updated");
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

	componentDidMount(){
		const taskID = this.props.match.params.id;
		if(!taskID){
			this.props.history.push('/login');
		}else{
			axios.get('http://localhost:3001/users/dashboard/update/', { params: {data: taskID}})
				.then( res =>{
					//console.log(res.data);
					this.setState({
						_id: res.data._id, 
						description: res.data.description,
						owner: res.data.owner,
						deadline: res.data.deadline
					});
				}).catch(err => {
					console.log("error: " + err);
				});
		}
	}

	render(){

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
				<h2>Hello {this.state.owner}</h2>
				<p className="lead mb-3">Edit task below</p>

				<form onSubmit={this.onSubmit}>
					<input type="hidden" name="_id" value={this.state._id}/>
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

export default Edit;