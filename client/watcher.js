module.exports=(function(EventEmitter,fs){
	
	const Watcher = function(directory='.', ignoredExtensions=[]){
		this.ignoredExtensions = ignoredExtensions.reduce((obj,extension)=>{
			obj[extension] = true
			return obj 
		},{})

		fs.watch(directory, this.listen.bind(this))
	}

	Watcher.prototype = Object.create(EventEmitter.prototype, {
	    constructor: {
	        value: Watcher,
	        enumerable: false
	    }
	})
	
	Watcher.prototype.stats = function(name){
		try {
			const stats = fs.statSync(name)

			if(typeof stats === 'undefined' || stats == null){
				return {exists: false}
			}

			let type;

			if(stats.isDirectory()) type = 'directory';
			if(stats.isFile())type = 'file';

			stats.exists = true
			stats.type = type

			return stats
		} catch(e){
			return {exists:false}
		}

		
	}
	
	Watcher.prototype.event = function(event, exists){
		if(event == 'rename'){
			if(exists){
				return 'rename'
			} else{
				return 'delete'
			}
		}

		return event
	}

	Watcher.prototype.listen = function(event, name){
		const ignore = this.shouldIgnore(name)

		if(ignore){
			this.emit('ignored', name)
			return
		}

		const stats = this.stats(name)
		const associatedEvent = this.event(event, stats.exists)
		

		this.emit(associatedEvent, name, stats)
	}

	Watcher.prototype.shouldIgnore = function(filename){
		const splitName = filename.split('.')
		const isDotFile = (splitName[0] == '')
		const extension = (splitName.length > 1)?splitName.pop():''

		if(isDotFile){ return true}
		if(this.ignoredExtensions[filename]){ return true }

		return false
	}

	return Watcher
})
