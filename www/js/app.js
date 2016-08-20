$(document).ready(function(){
		app.initialize();
		localStorage.appV = C.app_version; 
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
			fetchNews(myDb);
		}



		/*News populating..*/
		if (localStorage.firstFetch == '' || localStorage.firstFetch == undefined || localStorage.firstFetch != 1 ) {
			firstNewsPopulation();
		} else {
			setTimeout(function(){
				populateNews(myDb);
			},1111);

			setTimeout(function(){
				alert('set');
				// if(!navigator.onLine)  return false;
				alert('timeout');
				interNews(myDb);
			},7890);

		}

		
        
        /*Pushes....*/
        if(!navigator.onLine) {
        	if (localStorage.push == '' || localStorage.push == undefined || localStorage.push != 1 ) {
                // seven.alert('Push notification activation failed due to no internet connection');
                return;
            }
        }
		
		setTimeout(function(){
            new TpushService.push();
        },3000);
        
        /*Version update*/
        setTimeout(function(){
        	// if(navigator.onLine) {
            	$.post(C.api_site_url+'api/getVersion',{},function(res) {
                    	if(res && (res.status == 200)) {
                    		if((res.version != C.app_version) && (parseInt(res.version) > parseInt(C.app_version)) ) {
                    				seven.confirm( 'A new version of the app availiable. Would you like to download now ?', 'Upgrade app',function(){
										window.location.href = "http://www.google.com";
									},function(){
										
									});	
                    		}
                    	}
                });
            // }

        },7000);
});
	




