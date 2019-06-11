import React, { Component } from 'react';
import { If, Else } from 'rc-if-else';
import axios from 'axios';
import Moment from 'react-moment';

class StatusUpdate extends Component{
	constructor(props){
		super(props);
		this.state = {
			_id: "",
			done: false,
			description: "",
			owner: "",
			deadline: "",
			alert: "",
			redirectToReferrer: undefined
		};
	}

	onClick = e =>{
		e.preventDefault();
		if(this.state.done){
			this.setState({done: false, alert: "Status changed to Unfinished"});
		}else{
			this.setState({ done: true, alert: "Status changed to Finshed" });
		}
	}

	onSubmit = e => {
		e.preventDefault();

		const updatedTask = {
			_id: this.state._id,
			description: this.state.description,
			done: this.state.done,
			owner: this.state.owner,
			deadline: this.state.deadline
		};

		axios.post('/users/dashboard/status', updatedTask)
			.then(res => {
				this.props.history.push({
					pathname: '/dashboard',
					data: res.data.owner
				});
			})
			.catch((err) => {
				console.log(err);
			});
	}

	componentDidMount(){
		const taskID = this.props.match.params.id;
		if(!taskID){
			this.props.history.push('/login');
		}else{
			this.setState({ redirectToReferrer: true });
			axios.get('/users/dashboard/status', { params: { data: taskID }})
				.then(res =>{
					console.log(res.data);
					this.setState({
						_id: res.data._id,
						done: res.data.done,
						description: res.data.description,
						owner: res.data.owner,
						deadline: res.data.deadline
					});
				})
				.catch(err => {
					console.log(err);
				});
		}
	}

	render(){

		const { done, description, owner, deadline, alert } = this.state;

		return(
			<div className="row mt-5">
				<div className="col-md-8 m-auto">
					<div className="card">
						<If condition={alert !== ""}>
							<div className="alert alert-warning alert-dismissible fade show" role="alert">
							 	{alert}
								<button type="button" className="close" data-dismiss="alert" aria-label="Close">
							    	<span aria-hidden="true">&times;</span>
							  </button>
							</div>
						</If> 
						<div className="card-body">
							<h6 className="card-title"><i>task owner: {" "}</i><strong>{owner}</strong></h6>
							<h6 className="card-text text-muted"><i>task: {" "}</i><strong>{description}</strong></h6>
							<h6 className="card-text text-muted"><i>deadline: {" "}</i><Moment date={{deadline}} format="DD dddd MMM YYYY" /></h6>
						</div>
						<div className="card-body">
							<h5 className="card-title">Status:{" "}<If condition={done}>
								Finshed{" "}
								<Else>Unfinished</Else>
							</If></h5>
						</div>
						<div className="card-body">
							<form onSubmit={this.onSubmit}>
								<button onClick={this.onClick} className="btn btn-outline-primary">Change Status</button>{" "}
								<button type="submit" className="btn btn-primary">Back to Dashboard</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default StatusUpdate;