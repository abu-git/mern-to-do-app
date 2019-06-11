const chai = require('chai');
const expect = chai.expect;
const should = chai.should(); 
const chaiHttp = require('chai-http');

const server = require('../server');

//import Task schema
const Task = require('../models/Task');

//use chai Http assertion library
chai.use(chaiHttp);


//Two backend route tests (GET req and POST req) that make use of database access
describe('/GET request test', () =>{
	describe('this requests populates the user Dashboard', ()=>{
		it('request should return status 200', (done)=>{
			chai.request(server)
				.get('/users/dashboard')
				.end((err, res) =>{
					res.should.have.status(200);
					done();
				});
		});
	});

	describe('/POST request test', ()=>{
		describe('this request posts a task to MongoDB', ()=> {
			it('request should return status 200', (done) =>{
				//dummy test task data
				var task = new Task();
				task.description = "test task description";
				task.done = false;
				task.owner = "Sam Smith";
				task.deadline = "6/6/2019";

				chai.request(server)
					.post('/users/add')
					.send(task)
					.end((err, res) =>{
						res.should.have.status(200);
						done();
					});
			});
		});
	});
});
