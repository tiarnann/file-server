const auth = require('./auth-service')
module.exports=(function(auth, secret){
	'use strict'

	const verifyClient_decryptPayload = (req,res,next)=>{
		const ticket = req.body.ticket || req.headers.ticket
		const payload = req.body.payload || req.query.payload

		console.log({ticket, payload, secret})

		auth.decrypt(ticket)
			.with(secret)
			.then((sessionKey)=>{
				req.sessionKey = sessionKey
			
				if(payload) return auth.decrypt(payload).with(sessionKey)
				else return
			})
			.then((decryptedPayload)=>{
				if(typeof decryptedPayload !== 'undefined' || decryptedPayload == null){
					req.body.decryptedPayload = decryptedPayload
				}
				next()
			})
			.catch(()=>{
				res.status(401)
				res.send()
			})
	}

	return verifyClient_decryptPayload
}).bind(null, auth)