// App Controller
app.controller('app', ['$scope','seven','$state','services','fns','C','$http',
    function ( $scope, seven, $state, services, fns,C,$http) {
            seven.hideIndicator();
            // Go back function
            $scope.goBack = function() {
                window.history.go(-1);
            }
            

            var push = function() {
                console.log('Initializing Push...');
                
                var push = PushNotification.init({
                    "android": {
                        "senderID": "730309421478"
                    },
                });

                push.on('registration', function(data) {
                    console.log('registration event: ' + data.registrationId);
                    var oldRegId = localStorage.getItem('registrationId');
                    console.log(oldRegId);
                    if (oldRegId !== data.registrationId) {
                        console.log('saving new');

                        // Save new registration ID
                        localStorage.setItem('registrationId', data.registrationId);
                        // Post registrationId to your app server as the value has changed
                        console.log('post new');
                        console.log(C.api_site_url+'push/register');
                        $http.post(C.api_site_url+'push/register', {id:data.registrationId}).then(function(){
                            alert('success');
                            localStorage.registrationId = data.registrationId;
                            localStorage.push = 1;
                        });
                    }

                    alert(data.registrationId);
                });

                push.on('error', function(e) {
                    console.log("push error = " + e.message);
                });

                push.on('notification', function(data) {
                    console.log('notification event');
                    alert('Push notification success!');
                    alert(data.additionalData.id)
                    alert(data.id)
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


            if (localStorage.push == '' || localStorage.push == undefined || localStorage.push != 1 ) {
                
                if(!navigator.onLine) {
                        seven.alert('Error.. Please check your internet connectivity to activate push notification'); return;
                        return;
                }
                setTimeout(function(){
                    new push();
                },3000)
            }

}]);

// Home Controller
app.controller('news', ['$scope','fns','seven','$state',
    function ( $scope , fns , seven , $state ) {
            seven.hideIndicator();
}]);


