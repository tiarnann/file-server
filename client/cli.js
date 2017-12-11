const commander = require('commander')
module.exports=(function(commander, EventEmitter){
	const emitter = new EventEmitter()
	
	commander
		.command('read [options]')
		.description('Read a file')
		.alias('r')
		.action((file,o)=>{
			emitter.emit('read', file)
		})

	commander
		.command('write [options]')
		.description('Write a file')
		.alias('w')
		.action((file,o)=>{
			emitter.emit('write', file)
		})

	commander
		.command('fetch [options]')
		.description('Fetch all files')
		.alias('f')
		.action((file,o)=>{
			emitter.emit('fetch', file)
		})

		commander.parse(process.argv);
	return emitter
}).bind(null, commander)