const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//import Task schema
const Task = require('../models/Task');

//Dashboard route
//GET request for the users saved task on database
router.get('/dashboard/', (req, res) => {
	const owner = req.query.data
	Task.find({ owner: owner }, (err, docs) => {
		if(err){
			return res.status(500).send(err);
		}else{
			return res.status(200).json(docs);
		}
	});
});

//GET request that populates form to edit task
router.get('/dashboard/update/', (req, res) => {
	const taskID = req.query.data;
	Task.findById(taskID, (err, doc) => {
		if(err){
			console.log("error");
			return res.status(500).send(err);
		}
		else{
			return res.status(200).json(doc);
		}
	});
});

//GET request for status update
router.get('/dashboard/status/', (req, res) => {
	const taskID = req.query.data;
	Task.findById(taskID, (err, doc) =>{
		if(err){
			return res.status(500).send(err);
		}else{
			return res.status(200).json(doc);
		}
	});
});

//GET request for task to delete
router.get('/dashboard/delete', (req, res) => {
	Task.findById(req.query.data, (err, doc) => {
		if(err){
			return res.status(500).send(err);
		}else{
			return res.status(200).json(doc);
		}
	});
});

//GET request to delete task from database
router.get('/dashboard/delete/:id', (req, res) =>{
	Task.findByIdAndRemove(req.query.data, (err, doc) =>{
		if(err){
			return res.status(500).send(err);
		}else{
			return res.status(200).json(doc);
		}
	})
});


//POST request to change status update
router.post('/dashboard/status/', (req, res) =>{
	Task.findByIdAndUpdate(req.body._id, req.body, { new: true }, (err, doc) =>{
		if(err){
			return res.status(500).send(err);
		}else{
			return res.status(200).json(doc);
		}
	});
});


//POST request to add task to database
router.post('/add', (req, res) => {
	var newTask = new Task();
	newTask.description = req.body.description;
	newTask.done = false;
	newTask.owner = req.body.owner;
	newTask.deadline = req.body.deadline;

	newTask.save()
		.then(task => {
			res.status(200).json({ 'task': 'task added successfully'});
		})
		.catch(err => {
			res.status(400).send('error adding task');
		});
});

//POST request that updates task on database rather than create a new task
router.post('/dashboard/update', (req, res) =>{
	Task.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, doc) => {
		if(err){
			return res.status(500).send(err);
		}else{
			return res.status(200).json(doc);
		}
	});
});

module.exports = router;