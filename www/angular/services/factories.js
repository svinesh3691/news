app.factory("seven", ['$http', function($http) {
	var myApp = new Framework7({
                    modalTitle: 'Alert',
                    material: true, // Enable Material theme
    });
    return myApp;   
}]);

app.factory("webServices", ['$http','C', function($http,C) {
    var serviceBase = C.api_site_url;
    // var serviceBase = 'http://demo.vintechnosys.com/oddo_api/';
    var obj = {};
    obj.master = function(func_name,post_data){
        return $http.post(serviceBase + func_name, post_data);
    }
    obj.master_get = function(func_name,post_data){
        return $http.get(serviceBase + func_name, post_data);
    }
    return obj;   
}]);