const express = require('express');
const user = require('../models/user')

const api = (function(express, userSchema,db){
	const router = express.Router();

	const auth = (req,res, next)=>{
		req.locals.isAuthenticated = true
		next()
	}

	// Testing
	router.get('/', (req, res, next)=>{
		userSchema.find().then((users)=>{
			res.send(users);
		})
	})

	// Logs the user in, creates session key and sends it back
	router.post('/login', (req, res, next)=>{
		const {username, payload} = req.body
	})

	// Gets session-key for connection to a certain node
	router.get('connect',(req, res, next)=>{})

	return router
})

module.exports = api.bind(null, express, user)
