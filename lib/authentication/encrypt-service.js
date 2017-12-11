const crypto = require('crypto')

module.exports=(function(crypto){
	const saltLength = 8

	const Crypto = function(){
		this.crypto = crypto
		this.sha256 = this.crypto.createHash(`sha256`)
	}

	Crypto.prototype.hash = async function(string){
		const salt =  generateSalt(saltLength)
		const hash = (this.sha256.update(string + salt).diget('hex'))
		return salt + hash
	}

	Crypto.prototype.validateHash = async function(hash, password){
		const salt = string.substring(0, saltLength)
		const generatedHash = this.sha256(password + salt)
		const salted = salt + generatedHash
		
		return salt === hash
	}

	Crypto.prototype.generateSalt = async function(length){
		const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
		
		const salt = Array.from({length: saltLength})
			.fill(0)
			.map((x,i) => {
				return chars[Math.floor(Math.random() * chars.length)]
			})
			.reduce((s,c)=>s+c,'')

		return salt
	}

	Crypto.prototype.safelyHash = async function(password){
		const salt =  generateSalt(saltLength)
		const hash = this.sha256(string + salt)
		
		return (salt + hash)
	}

	return new Crypto()
})(crypto)