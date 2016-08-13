$(document).ready(function(){
		app.initialize();
		// Database operations 
		var myDb = new dbClass();
		var dbCreate = myDb.createDatabase();  
	    if (dbCreate) {
	        myDb.createTables();
	    } else {
	        alert('Unable to create database... !');
		} 

		/*First news population Function*/
		function firstNewsPopulation() {
			if(!navigator.onLine) {
				seven.confirm( 'No internet connection! <br> Internet is needed to start the application first time. <br> <br>  Please turn on your data/wifi and click ok ', '<span style="color:red">Error</span>',function(){
					firstNewsPopulation();
				},function(){
					navigator.app.exitApp();
				});
                return false;
			}
			setTimeout(function(){
				fetchNews(myDb);
				return true;	
			},2000);
		}

		/*News populating..*/
		if (localStorage.firstFetch == '' || localStorage.firstFetch == undefined || localStorage.firstFetch != 1 ) {
			return firstNewsPopulation();
		} else {
			setTimeout(function(){
				populateNews(myDb);
			},1111);
		}
        
        /*Pushes....*/
        if(!navigator.onLine) {
        	if (localStorage.push == '' || localStorage.push == undefined || localStorage.push != 1 ) {
                seven.alert('Push notification activation failed due to no internet connection');
                return;
            }
        }
		
		setTimeout(function(){
			seven.alert('Registering push...');
            new TpushService.push();
        },3000);
        
});
	




