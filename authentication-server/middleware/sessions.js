const redis = require("redis");

module.exports=(function(redisOptions){
	const client = redis.createClient(redisOptions);
	redis.debug_mode = true;

	return function(req, res, next){
		req.sessionsStore = client
		next()
	}
})