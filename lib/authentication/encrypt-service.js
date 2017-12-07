const crypto = require('crypto')

module.exports=(function(crypto){
	const saltLength = 8

	const Crypto = function(){
		this.crypto = crypto
	}

	Crypto.prototype.symmetricEncryptWith = async function(key, rawPayload){
		if( typeof key === 'undefined' || key == null){
			return null
		}

		if( typeof rawPayload === 'undefined' || rawPayload == null){
			return null
		}

		const cipher = this.crypto.createCipher('aes256', key);

		let encryptedPayload = cipher.update(rawPayload, 'utf8', 'hex');
		encryptedPayload += cipher.final('hex');

		return encryptedPayload
	}

	Crypto.prototype.symmetricDecryptWith = async function(key, encryptedPayload){
		if( typeof key === 'undefined' || key == null){
			return null
		}

		if( typeof encryptedPayload === 'undefined' || encryptedPayload == null){
			return null
		}

		const decipher = this.crypto.createDecipher('aes256', key);

		let decryptedPayload = decipher.update(encryptedPayload, 'hex', 'utf8');
		decryptedPayload += decipher.final('utf8');

		return decryptedPayload
	}

	Crypto.prototype.hash = async function(string){
		if(typeof string === 'undefined' || string == null){
			return null
		}

		const sha256 = this.crypto.createHash(`sha256`)
		const hash = (sha256.update(string).digest('hex'))

		return hash
	}

	Crypto.prototype.validateHash = async function(hash, password){
		if(typeof hash === 'undefined'|| hash == null){
			return null
		}
		else if(typeof password === 'undefined' || password == null)
		{
			return null
		}

		const salt = hash.substring(0, saltLength)
		
		const generatedHash = await this.hash(password + salt)
		const salted = salt + generatedHash
		return salted === hash
	}

	Crypto.prototype.safelyHash = async function(password){
		if(typeof password === 'undefined' || password == null){
			return null
		}
		const salt =  await this.generateSalt(saltLength)
		const hash = await this.hash(password + salt)
		
		return (salt + hash)
	}

	Crypto.prototype.generateSalt = async function(length){
		if(typeof length === 'undefined' || length == null){
			return null
		}
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