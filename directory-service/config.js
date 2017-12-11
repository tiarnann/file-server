module.exports={
	'secret': process.env.npm_package_config_dir_server_secret,
	'fileServerIp': `http://localhost:${process.env.npm_package_config_file_server_port}/api`,
	'redisOptions':{
		'port': process.env.npm_package_config_redis_port,
		'host': process.env.npm_package_config_redis_host,
		'path': process.env.npm_package_config_redis_path
	},
	'credentials': {'key': null, 'cert': null}
}
