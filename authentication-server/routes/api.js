const express = require('express');
const user = require('../schemas/user')

const api = (function(express, userSchema, db){
	const router = express.Router();

	const auth = (req,res, next)=>{
		next()
	}

	router.post('login', auth,(req,res, next)=>{
		const {username, payload} = req.body

		// lookup associated password
		// check if session-key exists generate session-key
		res.send({});
	})

	router.post('signup',(req,res, next)=>{
		const {username, payload} = req.body

		// lookup associated password
		// check if session-key exists generate session-key
		// 
		res.send({});
	})

	router.get('connect', auth,(req,res, next)=>{
		const {username, payload} = req.body

		// lookup associated password
		// check if session-key exists generate session-key
		// 
		res.send({});
	})

	return router
})

module.exports = api.bind(null, express, user)
