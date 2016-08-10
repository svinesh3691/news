app.service("fns", ['$http','C',function( $http , C ) {
    this.db = {};
    var Tfns = this;
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

			var news_table_query 	= 'CREATE TABLE IF NOT EXISTS news_main (news_id int,news_title TEXT,news_body TEXT,news_image TEXT, news_type int, news_add_date DATE)';
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



app.service("pushService", ['$http','C','fns',function( $http , C, fns ) {
    var TpushService = this;

	TpushService.push = function() {
                console.log('Initializing Push...');
                
                var push = PushNotification.init({
                    "android": {
                        "senderID": "730309421478"
                    },
                });

                push.on('registration', function(data) {
                    var oldRegId = localStorage.getItem('registrationId');
                    if (oldRegId !== data.registrationId) {
                    	console.log('registration event: ' + data.registrationId);
                        localStorage.setItem('registrationId', data.registrationId);
                        $http.post(C.api_site_url+'push/register', {id:data.registrationId}).then(function(){
                            alert('success');
                            localStorage.registrationId = data.registrationId;
                            localStorage.push = 1;
                        });
                    }

                });

                push.on('error', function(e) {
                    console.log("push error = " + e.message);
                });

                push.on('notification', function(data) {
                    console.log('notification event');
                    alert('Push notification success!');
                    alert(data.additionalData.id);
                    TpushService.push_news(data.additionalData.id,data.title,data.message,data.additionalData.news_image,data.additionalData.news_type,data.additionalData.news_add_date);
                    // console.log('data.message');
                    // console.log(data.message);
                    // console.log(data.title);
                    // console.log(data.count);
                    // console.log(data.sound);
                    // console.log(data.image);
                    // console.log('data.additionalData');
                    // console.log(data.test);
                    // console.log(data.additionalData.id);
                    // console.log(data.additionalData.foreground);
                    // console.log(data.additionalData.coldstart);

                });
    }

    TpushService.push_news = function(news_id,news_title,news_body,news_image,news_type,news_add_date) {
    		fns.query('INSERT into news_main (news_id,news_title,news_body,news_image,news_type,news_add_date) VALUES (?,?,?,?,?,?)', [news_id,news_title,news_body,news_image,news_type,news_add_date],function(res){
                     newsFactory.news_refresh();
            });
    }

}]);