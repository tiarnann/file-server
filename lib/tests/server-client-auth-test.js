const nop = (()=>{})
const sessionKey = "dV6aU8nmL2AQFK8"
const payload = "ab081372e5d8beb2efe476a02611d197"
const secret = "KxqzOXYR&is(-2NDCKf3UAzf2d$_FyUP"
const ticket = 'ca12e7403cf9cf301ed46a116d5db3b6'
const decrypted = {'test':true}
const req = {
	'body': {ticket,payload},
	'query': {payload},
	'headers':{ticket}
}
const middleware = require('../authentication/server-client-authentication')(secret)

describe('server-client-authentication',()=>{
	it('add a sessionKey to the req object', ()=>{
		middleware(req, {}, ()=>{
			assert.equal(req.sessionKey, sessionKey)
		})
	})
	it('add decryptedPayload to the req object', ()=>{
		middleware(req, {}, ()=>{
			assert.equal(req.decryptedPayload, decrypted)
		})
	})

	it('add decryptedPayload to the req object with the query obj when the req body is not there', ()=>{
		req.body = {}
		middleware(req, {}, ()=>{
			assert.equal(req.decryptedPayload, decrypted)
		})
	})

	it('should fail when the ticket isnt valid', ()=>{
		req.body = {}
		req.headers.ticket = "wrong"
		
		middleware(req, {}, ()=>{
			assert.fail()
		})
	})

	it('should fail when the payload isnt valid', ()=>{
		req.body = {}
		req.headers.ticket = ticket
		req.query.payload = 'not valid'
		
		middleware(req, {}, ()=>{
			assert.ok()
		})
	})

	it('should call nop when the payload isnt there but the ticket is valid', ()=>{
		req.body = {}
		req.headers.ticket = ticket
		req.query.payload = ''
		
		middleware(req, {}, ()=>{
			assert.fail()
		})
	})
})
