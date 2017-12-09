const authService = require('../lib/authentication/auth-service')
const fetch = require('node-fetch')

module.exports=(function(auth,fetch){
	let identityTicketMap = {

	}

	let username;
	let password;

	const UserAuthentication = function(){
		this.authUrl = 'http://localhost:3000/api'
	}

	UserAuthentication.prototype.login = async function(_username, _password){
		username = _username
		password = _password

		const loginMessage = {username, password}

		const stringifiedPayload = JSON.stringify({username, password})
		console.log(stringifiedPayload)
		fetch(`${this.authUrl}/login`,{
			'method':'POST',
			'body': stringifiedPayload,
			'headers': {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		})
		.then(res=>res.text())
		.then(encrypted=>auth.decrypt(encrypted).with(password))
		.then(JSON.parse)
		.then((response)=>{
			sessionKey = response['session-key']
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
			"payload": JSON.stringify({sessionKey, identity})
		}
		console.log({sessionKey, identity})
		connectMessage.payload = await auth.encrypt(connectMessage.payload).with(password)
		const stringifiedPayload = JSON.stringify(connectMessage)


		return fetch(`${this.authUrl}/connect`,{
			'method':'POST',
			'body': stringifiedPayload,
			'headers':{'content-type': 'application/json'}
		})
		.then(res=>res.json())
		.then((json)=>{
			identityTicketMap[identity] = json.ticket
		})
	}

	return new UserAuthentication()

})(authService,fetch)