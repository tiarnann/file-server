const privateKey  = fs.readFileSync('../certs-keys/transactions-server/transactions-server-key.key', 'utf8')
const certificate = fs.readFileSync('../certs-keys/transactions-server/transactions-server-cert.crt', 'utf8')
const credentials = {key: privateKey, cert: certificate}

module.exports={
	'credentials': credentials,
	'secret':process.env.npm_package_config_transactions_server_secret,
	'writerDatabase':'', 
	'credentials': {'key': null, 'cert': null}
}