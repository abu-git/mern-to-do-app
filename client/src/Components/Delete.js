import React, { Component } from 'react';
import axios from 'axios';
import { If, Else } from 'rc-if-else';
import Moment from 'react-moment';

class Delete extends Component{
	constructor(props){
		super(props);
		this.state = {
			_id: "",
			owner: "",
			description: "",
			deadline: "",
			done: undefined,
			alert: "",
			redirectToReferrer: undefined
		};
	}

	onSubmit = e =>{
		e.preventDefault();

		this.props.history.push({
			pathname: '/dashboard',
			data: this.state.owner
		});
	}

	onClick = e =>{
		e.preventDefault();

		axios.get('/users/dashboard/delete/'+this.state._id, {params: {data: this.state._id}})
			.then(() => {
				this.setState({
					alert: "DELETED"
				});
			})
			.catch(err =>{
				console.log(err);
			});
	}

	componentDidMount(){
		const taskID = this.props.match.params.id;
		if(!taskID){
			this.props.history.push('/login');
		}else{
			this.setState({ redirectToReferrer: true });
			axios.get('/users/dashboard/delete', { params: {data: taskID} })
				.then(res => {
					this.setState({
						_id: res.data._id,
						owner: res.data.owner,
						description: res.data.description,
						deadline: res.data.deadline,
						done: res.data.done
					});
				})
				.catch(err => {
					console.log(err);
				});
		}
	}

	render(){
		
		const { description, done, owner, deadline, alert } = this.state;

		return(
			<div className="row mt-5">
				<div className="col-md-8 m-auto">
					<div className="card">
						<div className="card-body">
							<h6 className="card-title"><i>task owner: {" "}</i><strong>{owner}</strong></h6>
							<h6 className="card-text text-muted"><i>task: {" "}</i><strong>{description}</strong></h6>
							<h6 className="card-text text-muted"><i>deadline: {" "}</i><Moment date={{deadline}} format="DD dddd MMM YYYY" /></h6>
							<h6 className="card-text text-muted">status: {" "}
								<If condition={done === true}>
									Finished
									<Else>Unfinished</Else>
								</If>
							</h6>
						</div>
						<div className="card-body">
							<h5 className="card-title"><If condition={alert !== ""}>
								Task DELETED{" "}
							</If></h5>
						</div>
						<div className="card-body">
							<form onSubmit={this.onSubmit}>
								<button onClick={this.onClick} className="btn btn-outline-danger">Delete Task</button>{" "}
								<button type="submit" className="btn btn-primary">Back to Dashboard</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Delete;