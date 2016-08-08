app.service("fns", ['$http','C', function( $http , C ) {
    this.db = {};

    this.createDatabase = function() { 
		    	try {
				    if (!window.openDatabase) {
				        alert('Database not supported');
				    } else {
					 	this.db = openDatabase(C.db.Name, C.db.Version, C.db.DisplayName, C.db.MaxSize);
				    }
				    return true
				} catch(e) {
				    if (e == 2) {
				        alert("Invalid database version.");
				    } else {
				        alert("Unknown error "+e+".");
				    }
				    return false;
				}
	}

    // Creating the table
	this.createTables   = function() { 

			var news_table_query 	= 'CREATE TABLE IF NOT EXISTS news_main (id INTEGER PRIMARY KEY AUTOINCREMENT,news_id int,news_title TEXT,news_body TEXT,news_image TEXT, news_type int, news_add_date DATE)';
			this.query(news_table_query,[],function(res){
				console.log(res);
			});

	}
	//Querying the db
	this.query  = function(query,parameters,callback) {
			this.db.transaction(function(tx){
	   			tx.executeSql(  query, parameters,
								function(tx,result){
									callback({ 'code'  : 1, 'tx'    : tx, 'result': result });
								},
								function(error){
									callback({ 'code'  : 2, 'error' : error });
								});
			},
			function(error){
				alert("Error processing SQL:"+error.code);
				alert("Error processing SQL:"+error.message);
			},
			function(success){
			 		// console.log('success');
			});
	}
}]);