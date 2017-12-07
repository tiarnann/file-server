module.exports=(function(){
	const User = function(){
	}

	User.prototype.create = async (username, password, ip=null)=>{
		return {username, password, ip}
	};

	return User()
}())