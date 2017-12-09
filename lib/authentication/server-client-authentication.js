module.exports=(function(auth, secret){
	'use strict'

	const verifyClient_decryptPayload = (req,res,next)=>{
		const ticket = req.body.ticket || req.headers.ticket
		const payload = req.body.payload || req.query.payload

		console.log({ticket, payload,secret})
		auth.decrypt(ticket)
			.with(secret)
			.then((sessionKey)=>{
				console.log('sessionKey')
				console.log(sessionKey)
				req.sessionKey = sessionKey
			
				if(payload) return auth.decrypt(payload).with(sessionKey)
				else return
			})
			.then((decryptedPayload)=>{
				if(typeof decryptedPayload !== 'undefined' || decryptedPayload == null){
					console.log('decryptedPayload')
					console.log(decryptedPayload)
					req.body.decryptedPayload = decryptedPayload
				}
				next()
			})
			.catch(()=>{
				res.status(400)
				res.send('unauthorised')
			})
	}

	return verifyClient_decryptPayload
})