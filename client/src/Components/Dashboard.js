import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { If, Else } from 'rc-if-else';
import axios from 'axios';
import Moment from 'moment';


const Task = props => (
	<tr>
		<td colSpan="2"><p className="lead">{ props.task.description }</p></td>
		<td></td>
		<td>
			<Link to={'/dashboard/status/' + props.task._id} className="btn btn-outline-secondary">
				<If condition={props.task.done}>
					Finished{" "}
					<Else>Unfinished{" "}</Else>
				</If>
			</Link>
		</td>
		<td><Link to={'/dashboard/update/'+props.task._id} className="text-secondary"><i className="fas fa-pencil-alt" aria-hidden="true"></i></Link></td>
		<td>
			<Link to={"/dashboard/delete/" + props.task._id} className="text-secondary"><i className="fas fa-trash-alt" aria-hidden="true"></i></Link>
		</td>
	</tr>
)

class Dashboard extends Component{
	constructor(props){
		super(props);
		this.state = {
			username: "",
			tasks: [],
			completedTasks: [],
			incompleteTasks: [],
			deadlineTasks: [],
			overdueTasks: [],
			taskCheck: false,
			redirectToReferrer: undefined
		};

		this.filterTasks = this.filterTasks.bind(this);
		this.taskList = this.taskList.bind(this);
		this.logOut = this.logOut.bind(this);
		this.completeTasks = this.completeTasks.bind(this);
		
	}
	//filter completed tasks
	filterTasks(){
		
		this.state.tasks.map((task) =>{
			//filter complete and incomplete tasks 
			if(task.done){
				this.setState({ completedTasks: [...this.state.completedTasks, task] });
			}else{
				this.setState({ incompleteTasks: [...this.state.incompleteTasks, task] });
			}

			
			var day = new Date();
			var today = Moment(day).format('MM DD YYYY');
			var deadline = Moment(task.deadline).format('MM DD YYYY');
			//filter overdue tasks
			if(deadline < today){
				if(task.done === false){
					this.setState({ overdueTasks: [...this.state.overdueTasks, task] });
				}
			}

			//filter deadline tasks
			if(deadline === today && task.done === false){
				this.setState({ deadlineTasks: [...this.state.deadlineTasks, task] });
			}
			return true;
		});
	}

	componentDidMount(){
		var { data } = this.props.location;
		var { stateRedirect } = this.props.location;
		this.setState({ redirectToReferrer: stateRedirect});
		
		axios.get('/users/dashboard/', { params: {data : data}} )
			.then(res =>{
				this.setState({ tasks: res.data, taskCheck: true });
				console.log(this.state.tasks);
				this.filterTasks();
				console.log(this.state.completedTasks);
				console.log(this.state.incompleteTasks);
			})
			.catch(err => {
				console.log(err);
			});
	}

	taskList(){
		//this.filterTasks();
		return this.state.tasks.map((currentTask, i) =>{
			return <Task task={currentTask} key={i} />
		});
	}

	completeTasks(){
		return this.state.completedTasks.map((task, i) =>{
			return <Task task={task} key={i} />
		});
	}

	incompleteTasks(){
		return this.state.incompleteTasks.map((task, i) =>{
			return <Task task={task} key={i} />
		});	
	}

	overdueTasks(){
		return this.state.overdueTasks.map((task, i) => {
			return <Task task={task} key={i} />
		});
	}

	deadlineTasks(){
		return this.state.deadlineTasks.map((task, i) => {
			return <Task task={task} key={i} />
		});
	}

	logOut(){
		this.setState({ redirectToReferrer: false });
	}


	render(){

		var { data } = this.props.location;
		const { redirectToReferrer } = this.state;
		if(data === undefined){
			data  = this.props.location.state;
		}

		if(redirectToReferrer === false){
			this.props.history.push({
				pathname: "/login",
				loginError: "You are not logged in to view page"
			});
		}

		const taskCheck = this.state.taskCheck;
		const name = data;

		return(
			<Fragment>
				<div className="card card-body mt-5">
					<h1 className="mt-4">Dashboard</h1>
					<p className="lead mb-3">Welcome {name}</p>
					<Link onClick={this.logOut} to="/login" className="btn btn-primary">Logout</Link>
				</div>

				<div className="card card-body">
					<Link to={{ pathname:'/add', state: { data: name }}}><button className="btn btn-success">Create New Task</button></Link>	
				</div>
				<div className="card card-body mb-5">
				<If condition={taskCheck === true}>
					<table className="table table-striped">
						<thead>
							<tr>
								<th scope="col" colSpan="2">Description</th>
								<th scope="col"></th>
								<th scope="col">Status</th>
								<th scope="col"></th>
								<th scope="col"></th>
							</tr>
						</thead>
						<thead>
							<tr>
								<th></th>
								<th className="text-muted">Complete Tasks</th>
							</tr>
						</thead>
						<tbody>
							{ this.completeTasks() }
						</tbody>
						<thead>
							<tr>
								<th></th>
								<th className="text-muted">Incomplete Tasks</th>
							</tr>
						</thead>
						<tbody>
							{ this.incompleteTasks() }
						</tbody>
						<thead>
							<tr>
								<th></th>
								<th className="text-muted">Overdue Tasks</th>
							</tr>
						</thead>
						<tbody>
							{ this.overdueTasks() }
						</tbody>
						<thead>
							<tr>
								<th></th>
								<th className="text-muted">Deadline Tasks</th>
							</tr>
						</thead>
						<tbody>
							{ this.deadlineTasks() }
						</tbody>
					</table>
				</If>
				</div>
			</Fragment>
		);
	}
}

export default Dashboard;