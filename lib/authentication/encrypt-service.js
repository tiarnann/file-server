const crypto = require('crypto')

module.exports=(function(crypto){
	const saltLength = 8

	const Crypto = function(){
		this.crypto = crypto
	}

	Crypto.prototype.hash = async function(string){
		const sha256 = this.crypto.createHash(`sha256`)
		const hash = (sha256.update(string).digest('hex'))
		return hash
	}

	Crypto.prototype.validateHash = async function(hash, password){
		const salt = hash.substring(0, saltLength)
		
		const generatedHash = await this.hash(password + salt)
		const salted = salt + generatedHash
		return salted === hash
	}

	Crypto.prototype.safelyHash = async function(password){
		const salt =  await this.generateSalt(saltLength)
		const hash = await this.hash(password + salt)
		
		return (salt + hash)
	}

	Crypto.prototype.generateSalt = async function(length){
		const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
		
		const salt = Array.from({length: length})
			.fill(0)
			.map((x,i) => {
				return chars[Math.floor(Math.random() * chars.length)]
			})
			.reduce((s,c)=>s+c,'')

		return salt
	}

	return new Crypto()
})(crypto)