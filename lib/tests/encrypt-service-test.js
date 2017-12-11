const assert = require('assert')
const encrypt = require('../authentication/encrypt-service')
console.log(encrypt)
describe(`encrypt-service`, ()=>{
	it(`should generate random salts everytime`, async ()=>{
		const gendSalts = []

		let i = 10
		while(i != 0){
			const salt = await encrypt.generateSalt(9)
			console.log(salt)
			assert(gendSalts.indexOf(salt) == -1, 'salt is already present in array')
			gendSalts.push(salt)
			i--
		}
	})

	it(`should safelyHash should return a salted and hashed string`, async ()=>{
		const password = 'this is a terrible password'
		
		const safeHash = await encrypt.safelyHash(password)
		assert(typeof safeHash === 'string')
	})

	it(`should validate passwords and hashes gen'd from safelyHash`, async ()=>{
		const password = `this is a terrible password`

		const safeHash = await encrypt.safelyHash(password)
		
		const isValid = await encrypt.validateHash(safeHash, password)

		assert(isValid === true, `password was not valid`)
	})
})