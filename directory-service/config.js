module.exports={
	'secret': 'SESSION_KEY',
	'port': 3001,
	'fileServerIp': 'http://localhost:3001/api',
	'redis':{
		'port':6379,
		'host':'127.0.0.1',
		'socket': '/tmp/redis.sock'
	},
	'credentials': {'key': null, 'cert': null}
}