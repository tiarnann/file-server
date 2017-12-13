const privateKey  = fs.readFileSync('../certs-keys/file-server/file-server-key.key', 'utf8')
const certificate = fs.readFileSync('../certs-keys/file-server/file-server-cert.crt', 'utf8')
const credentials = {key: privateKey, cert: certificate}

module.exports={
	'credentials': credentials,
	'secret':process.env.npm_package_config_file_server_secret,
	'redis':{
		'port':6379,
		'host':'127.0.0.1',
		'socket': '/tmp/redis.sock'
	},
	'credentials': {'key': null, 'cert': null}
}