import React, { Component } from 'react';
import { Link } from 'react-router-dom';


class Home extends Component{

	render(){
		return(
			<div className="row mt-5">
				<div className="col-md-6 m-auto">
					<div className="card card-body text-center">
						<h1>Task Management Application</h1>
						<p>Create an account or login</p>
						<Link to="/register" className="btn btn-primary btn-block mb-2">Register</Link>
						<Link to="/login" className="btn btn-secondary btn-block">Login</Link>
					</div>
				</div>
			</div>
		);
	}
}

export default Home;