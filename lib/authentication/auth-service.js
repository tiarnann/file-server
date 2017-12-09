const cryptoService = require('./crypto-service')

module.exports=(function(cryptoService){
	const Auth = function(){}

	Auth.prototype.random = function(length){
		return cryptoService.generateSalt(length)
	}

	Auth.prototype.verify = function(payload){
		return {
			is: (key)=>{
				return {
					with: async (secret)=>{
						const ticket = await this.decrypt(payload).with(secret)
						return (ticket == key)
					}
				}
			}
		}
	}

	Auth.prototype.decrypt = function(payload){
		return {
			with: async (key)=>{
				const decrypted = await cryptoService.symmetricDecryptWith(key, payload)
				return decrypted
			}
		}
	}

	Auth.prototype.encrypt = function(payload){
		return {
			with: async (key)=>{
				const encrypted = await cryptoService.symmetricEncryptWith(key, payload)
				return encrypted
			}
		}
	}

	return new Auth()
})(cryptoService)