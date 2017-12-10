const roundRobin = require('../lib/load-balancing/round-robin-generator')

/*
	Handles multiple databases, distributing read load making eventual consistency
 */
module.exports=(function(LoadBalancer, databaseConfig){
	const {dbs} = databaseConfig

	const {readers, writer} = databaseConfig

	const Replication = function(){
		setInterval(this.retry.bind(this), 1000)
	}

	Replication.prototype.retry = function(){
	}

	Replication.prototype.insert = async function(model, object){
		if(queue.length > 1){
			const operation = 'insert'
			queue.push({
				model,
				object,
				operation
			})
			return
		}
	}

	Replication.prototype.update = async function(model, object){
		if(queue.length > 1){
			const operation = 'update'
			const reader = 
			queue.push({
				model,
				object,
				operation
			})
			return
		}


	}


	Replication.prototype.remove = async function(model, object){
		if(queue.length > 1){
			const operation = 'remove'
			queue.push({
				model,
				object,
				operation
			})
			return
		}

		
	}

	return Replication
})(roundRobin)