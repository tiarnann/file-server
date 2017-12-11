const assert = require('assert')
const encrypt = require('../authentication/crypto-service')

describe(`crypto-service`, ()=>{
	const password = `this is a terrible password`
	const payload = `hello there`

	it(`should generate random salts nearly everytime`, async ()=>{
		const gendSalts = []

		let i = 10
		while(i != 0){
			const salt = await encrypt.generateSalt(9)
			assert(gendSalts.indexOf(salt) == -1, 'salt is already present in array')
			gendSalts.push(salt)
			i--
		}
	})

	describe('hashing',()=>{
		it(`should safelyHash should return a salted and hashed string`, async ()=>{
		
			const safeHash = await encrypt.safelyHash(password)
			assert(typeof safeHash === 'string')
		})

		it(`should validate passwords and hashes gen'd from safelyHash`, async ()=>{

			const safeHash = await encrypt.safelyHash(password)

			const isValid = await encrypt.validateHash(safeHash, password)

			assert(isValid === true, `password was not valid`)
		})

	})

	describe('symmetric encryption', ()=>{
		it(`should symmetrically encrypt payloads with a given password`, async ()=>{
			const encryptedPayload = await encrypt.symmetricEncryptWith(password, payload)
			const sameEncryptedPayload = await encrypt.symmetricEncryptWith(password, payload)
			
			assert.equal(encryptedPayload, sameEncryptedPayload)
		})

		it(`should generate different encrypted payloads when the keys are different`, async ()=>{
			const encryptedPayload = await encrypt.symmetricEncryptWith(password, payload)
			const samePayloadDifferentKey = await encrypt.symmetricEncryptWith(`different key`, payload)
			assert.notEqual(encryptedPayload, samePayloadDifferentKey)
		})
		
		it(`should generate different encrypted payloads when the payloads are different`, async ()=>{
			const encryptedPayload = await encrypt.symmetricEncryptWith(password, payload)
			const differentEncryptedPayload = await encrypt.symmetricEncryptWith(password, `different payload`)
			assert.notEqual(encryptedPayload, differentEncryptedPayload)
		})


		it(`should be able to be decrypt payloads when keys are the same`, async ()=>{
			const encryptedPayload = await encrypt.symmetricEncryptWith(password, payload)
			const decryptedPayload = await encrypt.symmetricDecryptWith(password, encryptedPayload)
			
			assert.equal(payload, decryptedPayload)
		})

		it(`should fail when decrypting payloads with different keys`, async ()=>{
			const encryptedPayload = await encrypt.symmetricEncryptWith(password, payload)

			try {
				const decryptedPayloadMethod = encrypt.symmetricDecryptWith(`different key`, encryptedPayload)
				assert.fail(`decryption did succeed`)
			}catch(err){
				assert.ok(`decryption did fail`)
			}
		})
	})
})