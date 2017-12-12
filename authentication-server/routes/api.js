var express = require('express');
var router = express.Router();


const auth = (req,res, next)=>{
	return true
}

router.post('login',(req,res, next)=>{
	const {username, payload} = req.body

	// lookup associated password
	// check if session-key exists generate session-key
	// 
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

module.exports = router;