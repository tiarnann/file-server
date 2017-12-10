/*
	To be added:
		httpServer info
		certs for https
		Information on other servers 
		Replica sets
		Redis store for sessions
 */
module.exports={
	'dbs':[
	], 
	'redis':{
		'port': 3001,
		'host':'127.0.0.1',
		'socket': '/tmp/redis.sock'
	},
	'credentials': {'key': null, 'cert': null}
}