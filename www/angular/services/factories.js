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




app.factory("newsFactory", ['$http','C','fns', function($http,C,fns) {
    var obj = {};
    obj.theNewsArray = [];
    obj.newsRefresh  = function () {
        fns.query('SELECT * FROM news_main ORDER BY `news_id` DESC',[],function(res){
                for (var i = 0;k = res.result.rows.length, i< k; i++) {
                    var thisNews = res.result.rows.item(i);
                    thisNews.news_add_date = new Date(thisNews.news_add_date);
                    k = new Date(res.result.rows.item(i).news_add_date);
                    obj.theNewsArray.push(thisNews);
                }
        }); 
    }
    obj.newsRefresh();

    return obj;   
}]);

