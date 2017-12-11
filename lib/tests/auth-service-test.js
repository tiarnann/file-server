const assert = require('assert')
const crypto = require('../authentication/crypto-service')
const auth = require('../authentication/auth-service')

describe(`encrypt-service`, ()=>{
	const password = `this is a terrible password`
	const payload = `hello there`

	it(`should generate random salts nearly everytime`, async ()=>{
		const gendSalts = []

		let i = 10
		while(i != 0){
			const salt = await auth.random(9)
			assert(gendSalts.indexOf(salt) == -1, 'salt is already present in array')
			gendSalts.push(salt)
			i--
		}
	})

	describe('symmetric encryption', ()=>{
		it(`should symmetrically encrypt payloads with a given password`, async ()=>{
			const encryptedPayload = await auth.encrypt(payload).with(password)
			const sameEncryptedPayload = await auth.encrypt(payload).with(password)
			
			assert.equal(encryptedPayload, sameEncryptedPayload)
		})

		it(`should generate different encrypted payloads when the keys are different`, async ()=>{
			const encryptedPayload = await auth.encrypt(payload).with(password)
			const samePayloadDifferentKey = await auth.encrypt(payload).with(`different key`)
			assert.notEqual(encryptedPayload, samePayloadDifferentKey)
		})
		
		it(`should generate different encrypted payloads when the payloads are different`, async ()=>{
			const encryptedPayload = await auth.encrypt(payload).with(password)
			const differentEncryptedPayload = await auth.encrypt(`different payload`).with(password)
			assert.notEqual(encryptedPayload, differentEncryptedPayload)
		})


		it(`should be able to be decrypt payloads when keys are the same`, async ()=>{
			const encryptedPayload = await auth.encrypt(payload).with(password)
			const decryptedPayload = await auth.decrypt(encryptedPayload).with(password)
			
			assert.equal(payload, decryptedPayload)
		})

		it(`should fail when decrypting payloads with different keys`, async ()=>{
			const encryptedPayload = await auth.encrypt(payload).with(password)

			try {
				const decryptedPayloadMethod = auth.decrypt(encryptedPayload).with(`different key`)
				assert.fail(`decryption did succeed`)
			}catch(err){
				assert.ok(`decryption did fail`)
			}
		})
	})
})