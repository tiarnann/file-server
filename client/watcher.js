const events = require('events')
const path = require('path')
const watchr = require('watchr')

module.exports=(function(watchr, path, EventEmitter, directory='.', ignoredExtensions=['swp', 'swpx']){
	const emitter = new EventEmitter()

	/*
		Returns whether a given file should be ignored
	 */
	const ignoredExtensionMap = ignoredExtensions.reduce((obj,ex) => {obj[ex] = true; return obj},{})
	const ignore = (fullPath)=>{
		const filename = path.basename(fullPath)
		const isDotfile = filename.split('.')[0] == ''
		
		if(isDotfile) return true

		const extension = path.extname(fullPath)

		return ignoredExtensionMap[extension] || false
	}

	/*
		Emits change events
	 */
	const listener = (changeType, fullPath, currentStat, previousStat)=>{
		const shouldIgnore = ignore(fullPath)
		
		if(shouldIgnore){
			emitter.emit('ignore', fullPath)
			return
		}
		
		const filename = path.basename(fullPath)
		const isDirectory = ((currentStat || previousStat).isDirectory())
		const type = isDirectory ?'directory':'file'

		emitter.emit(changeType, fullPath, filename, type, currentStat)
		return
	}

	const next = (err)=> {
		if ( err )  return console.log('watch failed on', directory, 'with error', err)
		console.log('watch successful on', directory)
	}

	/*
		Watchr setup
	 */
	const stalker = watchr.open(directory, listener, next)
	
	stalker.once('close', (reason)=>{
		console.log('closed', directory, 'because', reason)
		stalker.removeAllListeners()
	})

	process.on('close',()=>{
		console.log('closing stalker')
		stalker.close()
	})

	return emitter
}).bind(null, watchr, path, events)
