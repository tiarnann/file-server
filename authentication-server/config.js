module.exports=(function(){
/*	const privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
	const certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
	const credentials = {key: privateKey, cert: certificate};*/

	return {
		'db': (process.env.db || ''),
		'redisOptions':{
			'port': process.env.npm_package_config_redis_port,
			'host': process.env.npm_package_config_redis_host,
			'path': process.env.npm_package_config_redis_path
		},
		'credentials': {},
		'identity-secrets':{
			'directory-server': process.env.npm_package_config_dir_server_secret,
			'file-server':process.env.npm_package_config_file_server_secret,
			'transactions_server':process.env.npm_package_config_transactions_server_secret
		}
	}
}())



