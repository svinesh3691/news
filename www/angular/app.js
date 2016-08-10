/* Core Phone gap [JS] Codes */ 
function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

// onDeviceReady
function onDeviceReady() {
        // Back Button Management
        document.addEventListener("backbutton", function (e) {
            e.preventDefault();
            var exit_confirm = confirm('Are you sure to exit app? ');
            if(exit_confirm) navigator.app.exitApp();
        }, false );     
}


/* Creating Module app */
var app = angular.module('app', [
	'configs',
    'ui.router',
]);

/*config Phase*/
app.config(['$controllerProvider','$compileProvider','$filterProvider','$provide',
   function( $controllerProvider , $compileProvider , $filterProvider , $provide ) {
            // lazy controller, directive and service
            app.controller = $controllerProvider.register;
            app.directive  = $compileProvider.directive;
            app.filter     = $filterProvider.register;
            app.factory    = $provide.factory;
            app.service    = $provide.service;
            app.constant   = $provide.constant;
            app.value      = $provide.value;
        }
]);


/*Run Phase*/
app.run(['$rootScope','$state','$stateParams','seven','fns','pushService','$http','C',
function( $rootScope , $state , $stateParams , seven , fns , pushService , $http, C) {
        

        // On Each state change success scroll to the top of the page
        $rootScope.$on('$stateChangeSuccess', function() {
              document.body.scrollTop = document.documentElement.scrollTop = 0;
        });


        var dbCreate = fns.createDatabase();  
        if (dbCreate) {
            fns.createTables();
        } else {
            alert('Unable to create database... !');
        }


            var pusher = function() {
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
                            // TpushService.push_news(data.additionalData.id,data.title,data.message,data.additionalData.news_image,data.additionalData.news_type,data.additionalData.news_add_date);
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

            push_news = function(news_id,news_title,news_body,news_image,news_type,news_add_date) {
                    fns.query('INSERT into news_main (news_id,news_title,news_body,news_image,news_type,news_add_date) VALUES (?,?,?,?,?,?)', [news_id,news_title,news_body,news_image,news_type,news_add_date],function(res){
                             // newsFactory.news_refresh();
                             window.location.reload();
                    });
            }

            if (localStorage.push == '' || localStorage.push == undefined || localStorage.push != 1 ) {
            
                if(!navigator.onLine) {
                        seven.alert('Error.. Please check your internet connectivity to activate push notification'); return;
                        return;
                }
                setTimeout(function(){
                    // new pusher();
                },3000)
            }

}]);


