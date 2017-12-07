module.exports=(function(){
/*	const privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
	const certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
	const credentials = {key: privateKey, cert: certificate};*/

	return {
		'db': (process.env.db || ''),
		'credentials': {}
		}
}())



