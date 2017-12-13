const authService = require('../lib/authentication/auth-service')
const fetch = require('node-fetch')

module.exports=(function(auth,fetch){
	let identityTicketMap = {
	}

	let username;
	let password;
	let sessionKey;
	
	const UserAuthentication = function(baseUrl,options){
		this.authUrl = baseUrl
		
		if(options){
			username = options.username || ''
			password = options.password || ''

			identityTicketMap = options.identityTicketMap || {}
			sessionKey = identityTicketMap['user'] || ''
		}
	}

	UserAuthentication.prototype.login = async function(_username, _password){
		username = _username
		password = _password

		const loginMessage = {username, password}

		const stringifiedPayload = JSON.stringify({username, password})
		const res = await fetch(`${this.authUrl}/login`,{
			'method':'POST',
			'body': stringifiedPayload,
			'headers': {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		})
		const encryptedSession = await res.text()
		const decrypted = await auth.decrypt(encryptedSession).with(password)
		const parsed = JSON.parse(decrypted)

		sessionKey = parsed['session-key']
		identityTicketMap['user'] = parsed['session-key']

		return
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

		connectMessage.payload = await auth.encrypt(connectMessage.payload).with(password)
		const stringifiedPayload = JSON.stringify(connectMessage)

		const res = await fetch(`${this.authUrl}/connect`,{
			'method':'POST',
			'body': stringifiedPayload,
			'headers':{'content-type': 'application/json'}
		})
		const json = await res.json()
		identityTicketMap[identity] = json.ticket

		return
	}

	UserAuthentication.prototype.sessionKeyFor = function(identity){
		return identityTicketMap[identity]
	}

	UserAuthentication.prototype.state = function(){
		return {username,password,identityTicketMap}
	}

	UserAuthentication.prototype.username = function(){
		return {username,password,identityTicketMap}
	}

	UserAuthentication.prototype.encrypt = function(payload){
		return auth.encrypt(payload).with(sessionKey)
	}


	return UserAuthentication

})(authService,fetch)