module.exports=(function(){
/*	const privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
	const certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
	const credentials = {key: privateKey, cert: certificate};*/

	return {
		'db': (process.env.db || ''),
		'redis':{
			'port':6379,
			'host':'127.0.0.1',
			'socket': '/tmp/redis.sock'
		},
		'credentials': {}
	}
}())



