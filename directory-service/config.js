/*
	To be added:
		httpServer info
		certs for https
		Information on other servers 
		Replica sets
		Redis store for sessions
 */
module.exports={
	'port': 3000,
	'fileServers':[
		/*list of ips*/
	], 
	/* redis info for sessions*/
	'redis':{
		'port':6379,
		'host':'127.0.0.1',
		'socket': '/tmp/redis.sock'
	},
	/* https stuff */
	'credentials': {'key': null, 'cert': null}
}