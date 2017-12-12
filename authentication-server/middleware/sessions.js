const redis = require("redis");

module.exports=(function(redisOptions){
	const client = redis.createClient(redisOptions);

	return function(req, res, next){
		req.sessionsStore = client
		next()
	}
})