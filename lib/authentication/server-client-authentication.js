const auth = require('./auth-service')
module.exports=(function(auth, secret, identities){
	'use strict'

	const verifyClient_decryptPayload = (req,res,next)=>{
		const ticket = req.body.ticket || req.headers.ticket
		const payload = req.body.payload || req.query.payload
		const username = req.headers.username

		identities.forEach((identity)=>{
			if(identity == req.ip){
				next()
			}
		})

		auth.decrypt(ticket)
			.with(secret)
			.then((decryptedTicket)=>{
				const sessionKey = decryptedTicket['session-key']
				const username = decryptedTicket.username
				
				if(username != decryptedTicket.username){
					throw new Error()
				}

				req.sessionKey = sessionKey

				if(payload) return auth.decrypt(payload).with(sessionKey)
				else return
			})
			.then((decryptedPayload)=>{
				req.body.payload = decryptedPayload || {}
				console.log(req.body.payload)
				next()
			})
			.catch(()=>{
				res.status(401)
				res.send()
			})
	}

	return verifyClient_decryptPayload
}).bind(null, auth)