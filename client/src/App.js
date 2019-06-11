import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

//import Authentiation Service
import authCentralState from './Components/Authentication';

//import Components
import Home from './Components/Home';
import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import Register from './Components/Register';
import Create from './Components/Create';
import Edit from './Components/Edit';
import Delete from './Components/Delete';
import TaskStatus from './Components/StatusUpdate';


//Higher Order Component to protect private component
const ProtectedRoute = ({ component: Component, ...rest}) => (
  <Route {...rest} render={(props) =>(
    authCentralState.isAuthenticated === true ?
      <Component {...props} /> : <Redirect to={{ pathname: '/login', state: {from: props.location}}}/>
  )}/>
);

class App extends Component{
  render(){
    return(
      <Router>
        <div className="App">
          <div className="container">
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register}/>

            <ProtectedRoute exact path="/dashboard" component={Dashboard}/>
            <ProtectedRoute path="/add" component={Create}/>
            <ProtectedRoute path="/dashboard/update/:id" component={Edit} />
            <ProtectedRoute path="/dashboard/delete/:id" component={Delete}/>
            <ProtectedRoute path="/dashboard/status/:id" component={TaskStatus}/>
          </div>
        </div>
      </Router>
    );
  }
}



export default App;
