const express = require('express');
const user = require('../models/user')
const auth = require('../../lib/authentication/auth-service')

const api = (function(auth, express, User, db, identitySecrets){
	const router = express.Router();

	const UnauthorisedError = (()=>{
		let err = new Error('user or password is wrong')
		err.status = 400
		return err
	})()

	/*
		Store keyname and middleware methods
	 */
	const StoreValueLifetime = (60)*(120)

	const keyNameForSessionStore = username => `sessionStoreKey:${username}`
	const keyNameForPasswordStore = username => `passwordStoreKey:${username}`

	const attachSessionKey = (req, res, next)=>{
		const {username} = req.body
		const {sessionsStore} = req

		if(typeof sessionsStore === 'undefined' || sessionsStore == null){
			next()
		}

		const keyName = keyNameForSessionStore(username)
		sessionsStore.get(keyName, function(err, response){
			if(response == null){
				next()
			}
			req.sessionKey = response
			next()
		})

	}

	router.post('/login', attachSessionKey, (req, res, next)=>{
		const {username, password} = req.body
		const {sessionKey,sessionsStore} = req
	
		if(typeof sessionKey != 'undefined' && sessionKey != null){
			console.log()
			const payload = {'session-key': sessionKey}

			auth.encrypt(JSON.stringify(payload)).with(password)	
				.then((encryptedPayload)=>{
					res.status(200)
					res.send(encryptedPayload)
				})
				.catch(err=>{
					res.status(err.status || 400)
					res.send(err.message || 'unauthorised')
				})
			return
		}

		const usernameUndefined = typeof username === 'undefined' || username == null
		const passwordUndefined = typeof password === 'undefined' || password == null
		const storeUndefined = typeof sessionsStore === 'undefined' || sessionsStore == null

		if(usernameUndefined || passwordUndefined || storeUndefined){
			next(new ReferenceError('param is not defined'));
		}

		User.findOne({username})
			.then(user=>{
				if(user == null) throw UnauthorisedError;
				if(user.password != password) throw UnauthorisedError;

				return auth.random(15)
			})
			.then(sessionKey=>{
				sessionsStore.set(keyNameForSessionStore(username), sessionKey, 'EX', StoreValueLifetime)
				sessionsStore.set(keyNameForPasswordStore(username), password, 'EX', StoreValueLifetime)
				
				const payload = {'session-key': sessionKey}
				return auth.encrypt(JSON.stringify(payload)).with(password)
			})
			.then((encryptedPayload)=>{
				res.status(200)
				res.send(encryptedPayload)
			})
			.catch(err=>{
				res.send(err.status || 400)
				res.send(err.message || 'unauthorised')
			})
	})

	// Gets session-key for connection to a certain node
	router.post('/connect',attachSessionKey,  (req, res, next)=>{
		const {sessionKey,sessionsStore} = req
		const {username,payload} = req.body
		
		if(typeof sessionsStore === 'undefined' || sessionsStore == null){
			res.status(400)
			res.send()
			next()
		}
		sessionsStore.get(keyNameForPasswordStore(username), function(err, password){
			if(err != null){
				res.status(400)
				res.send('unauthorised')
				next()
			}
			console.log(password)
			console.log(payload)
			auth.decrypt(payload).with(password).then(dec=>JSON.parse(dec))
				.then((decrypted)=>{
					console.log('this is decrypted')
					const {identity} = decrypted
					return identitySecrets[identity]
				}).then(secret=>{
					console.log(secret)
					console.log(sessionKey)
					return auth.encrypt(sessionKey).with(secret).then(ticket=>ticket)
				}).then(ticket=>{
					console.log(ticket)
					return {'session-key': sessionKey,'ticket': ticket}
				}).then(token=>{
					console.log(token)
					res.status(200)
					res.send(token)
				}).catch(err => {
					console.log(err)
					res.status(400)
					res.send('unauthorised')
				})
			})
	})


	return router
})

module.exports = api.bind(null, auth, express, user)
