module.exports={
	'secret': 'SESSION_KEY',
	'fileServerIp': `http://localhost:${process.env.FILE_PORT}/api`,
	'redis':{
		'port':6379,
		'host':'127.0.0.1',
		'socket': '/tmp/redis.sock'
	},
	'credentials': {'key': null, 'cert': null}
}
