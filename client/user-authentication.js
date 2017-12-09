const authService = require('../lib/authentication/auth-service')
const fetch = require('node-fetch')

module.exports=(function(auth,fetch){
	let sessionKey;
	let ticket;

	let username;
	let password;

	const UserAuthentication = function(){
		this.authUrl = 'http://localhost:3000/api'
	}

	UserAuthentication.prototype.login = async function(_username, _password){
		username = _username
		password = _password

		const loginMessage = {username, password}
		console.log(loginMessage)

		const stringifiedPayload = JSON.stringify(loginMessage)

		return fetch(`${this.authUrl}/login`,{
			'method':'POST',
			'body': stringifiedPayload,
			'headers':{'content-type': 'application/json'}
		})
	}

	UserAuthentication.prototype.connect = async function(identity){
		if(typeof username === 'undefined' || username == null){ 
			throw new ReferenceError('username is not defined. user must login first')
		}

		if(typeof password === 'undefined' || password == null){ 
			throw new ReferenceError('password is not defined. user must login first')
		}

		const connectMessage = {
			"username": username,
			"payload": {sessionKey, identity}
		}

		connectMessage.payload = await auth.encrypt(connectMessage.payload).with(password)
		const stringifiedPayload = JSON.stringify(connectMessage)


		return fetch(`${this.authUrl}/connect`,{
			'method':'POST',
			'body': stringifiedPayload,
			'headers':{'content-type': 'application/json'}
		})
	}

	return new UserAuthentication()

})(authService,fetch)