module.exports=(function(fs,directory){
	const identitySessionKeys = {
	}

	const FSAPI = function(){}
	
	FSAPI.prototype.set = function(identity,sessionKey) {
		identitySessionKeys[identity] = sessionKey
	}

	FSAPI.prototype.create = async function(filename, buffer){}

	FSAPI.prototype.update = async function(filename, buffer){}

	FSAPI.prototype.delete = async function(filename){}

	return new FSAPI()
})