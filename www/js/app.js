$(document).ready(function(){

		// Database operations 
		var myDb = new dbClass();
		var dbCreate = myDb.createDatabase();  
	    if (dbCreate) {
	        myDb.createTables();
	    } else {
	        alert('Unable to create database... !');
		} 
		
		/*News populating..*/
		setTimeout(function(){
			fetchNews(myDb);	
		},2000)
        
        
        if(!navigator.onLine) {
        	if (localStorage.push == '' || localStorage.push == undefined || localStorage.push != 1 ) {
                alert('Error.. Please check your internet connectivity to activate push notification');
            }
        } else {
        		setTimeout(function(){
		            new TpushService.push();
		        },3000);
        }
        


});
	




