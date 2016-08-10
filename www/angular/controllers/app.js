// App Controller
app.controller('app', ['$scope','seven','$state','webServices','fns','C','$http',
    function ( $scope, seven, $state, webServices, fns,C,$http) {
            seven.hideIndicator();
            // Go back function
            $scope.goBack = function() {
                window.history.go(-1);
            }




            

            
}]);

// Home Controller
app.controller('news', ['$scope','fns','seven','$state','webServices','C','newsFactory',
    function ( $scope , fns , seven , $state, webServices, C , newsFactory) {
            seven.hideIndicator();
            $scope.newses = [];
            $scope.api_base_url = C.api_base_url;
            var tillNow = localStorage.tillNow || 0;
            var populateNews = function() { 
                $scope.newses = newsFactory.theNewsArray;
            }
            var fetchNews = function() {
                webServices.master('api/fetchNews',{
                            'tillNow'       : tillNow
                }).then(function(res){
                    if(res.data.news) {
                            console.log(res.data.news.length);
                            localStorage.tillNow = res.data.news[res.data.news.length-1].news_id;

                            for (var i = 0 ; i < res.data.news.length; i++) {
                                        console.log(res.data.news[i]);
                                        fns.query('INSERT into news_main (news_id,news_title,news_body,news_image,news_type,news_add_date) VALUES (?,?,?,?,?,?)', [res.data.news[i].news_id,res.data.news[i].news_title,res.data.news[i].news_body,res.data.news[i].news_image,res.data.news[i].news_type,res.data.news[i].news_add_date],function(res){
                                            console.log(res);
                                        });
                            };
                            populateNews();
                    } else {
                        // populateNews();
                    }
                    
                });
            }
            populateNews();
            fetchNews();




            


            
}]);


