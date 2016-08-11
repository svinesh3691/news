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
app.controller('news', ['$scope','fns','seven','$state','webServices','C','newsFactory','$http',
    function ( $scope , fns , seven , $state, webServices, C , newsFactory,$http) {

            // alert('New news updated...'); 


            seven.hideIndicator();
            $scope.api_base_url = C.api_base_url;
            var tillNow = localStorage.tillNow || 0;
            var populateNews = function() { 
                $scope.newses = [];
                fns.query('SELECT * FROM news_main ORDER BY `news_id` DESC',[],function(res){
                        for (var i = 0;k = res.result.rows.length, i< k; i++) {
                            var thisNews = res.result.rows.item(i);
                            dt = new Date(res.result.rows.item(i).news_add_date);
                            thisNews.news_add_dater =  new Date(res.result.rows.item(i).news_add_date);
                            console.log(thisNews.news_add_dater);
                            $scope.newses.push(thisNews);
                            $scope.$apply();
                        }
                }); 
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
                        populateNews();
                    }
                    
                });
            } 
            fetchNews();




            var TpushService = {};
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
                                    localStorage.registrationId = data.registrationId;
                                    localStorage.push = 1;
                                });
                            }

                        });

                        push.on('error', function(e) {
                            console.log("push error = " + e.message);
                        });

                        push.on('notification', function(data) { 
                            TpushService.push_news(data.additionalData.coldstart,data.additionalData.id,data.title,data.message,data.additionalData.news_image,data.additionalData.news_type,data.additionalData.news_add_date);
                        });
            }

            TpushService.push_news = function(colds_start,news_id,news_title,news_body,news_image,news_type,news_add_date) {
                    fns.query('INSERT into news_main (news_id,news_title,news_body,news_image,news_type,news_add_date) VALUES (?,?,?,?,?,?)', [news_id,news_title,news_body,news_image,news_type,news_add_date],function(res){
                            // newsFactory.newsRefresh();
                             // window.location.reload();
                             if(colds_start == false) {
                                window.location.reload();
                             } else if(colds_start == undefined) {
                                populateNews();
                                alert('New news updated...'); 

                             }
                    });
            }
            
            // if (localStorage.push == '' || localStorage.push == undefined || localStorage.push != 1 ) {
            
                if(!navigator.onLine) {
                        seven.alert('Error.. Please check your internet connectivity to activate push notification'); return;
                        return;
                }
                setTimeout(function(){
                    new TpushService.push();
                },3000)


            // }


            
}]);


