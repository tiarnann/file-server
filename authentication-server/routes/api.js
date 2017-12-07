const express = require('express');
const user = require('../models/user')
const crypto = require('../../lib/authentication/crypto-service')

const api = (function(crypto, express, userSchema, db){
	const router = express.Router();

	/*
		Session keys
	 */
	const associatedSessionStoreKeyname = (id)=> `auth-session-key:${id}`

	const getSessionKey = (req, res, next)=>{
		const {username, payload} = req.body
		
		const keyname = associatedSessionStoreKeyname(username)
		req.sessionKey = sessionsStore.get(keyname)
		
		next()
	}

	const decryptPayload = (req,res,next)=>{
		const {sessionsStore, sessionKey} = req
		const {username, payload} = req.body

		userSchema.findOne().then((user)=>{
			const keyname = associatedSessionStoreKeyname(username)
			
			sessionsStore.get(keyname,(err, sessionKey)=>{
				crypto.symmetricDecryptWith(key, payload).then((decryptedPayload)=>{
					req.body.decryptedPayload = decryptedPayload
					next()
				})
			})
		})
	}

	// Testing
	router.get('/', (req, res, next)=>{
		userSchema.find().then((users)=>{
			res.send(users);
		})
	})

	// Logs the user in, creates session key and sends it back
	router.post('/login', (req, res, next)=>{
		const {username, password} = req.body
		const {sessionsStore} = req
		const sessionKey = crypto.generateSalt(15)

		const payload = `{'sessionKey':${sessionKey}`

		(async ()=>{
			sessionsStore.set(`${sessionStoreKey}:${username}`,sessionKey,(err, key)=>{
				if(err){
					throw new Error(`couldn't store failed you. Sorry about that`)
				}
			})
		}).then(()=>{
			return crypto.symmetricEncryptWith(sessionKey, response)
		}).then((encryptedPayload)=>{
			res.send(encryptedPayload)
		})
	})

	// Gets session-key for connection to a certain node
	router.get('/connect', getSessionKey, decryptPayload, (req, res, next)=>{
		const {decryptedPayload} = req.body
		const {sessionKey} = req

		const response = {
			'server-type': 'fs'
			'server-session-key': crypto.generateSalt(15)
		}

		crypto.symmetricEncryptWith(sessionKey, response).then((encryptedPayload)=>{
			crypto.symmetricEncryptWith(sessionKey, response).then((encryptedPayload)=>{
				res.send(encryptedPayload)
			})
		})
	})

	return router
})

module.exports = api.bind(null, crypto, express, user)
