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
app.run(['$rootScope','$state','$stateParams','seven','fns',
function( $rootScope , $state , $stateParams , seven , fns ) {
        console.log('Run'); 


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

        if (localStorage.push == '' || localStorage.push == undefined || localStorage.push != 1 ) {
            
            if(!navigator.onLine) {
                    seven.alert('Error.. Please check your internet connectivity to activate push notification'); return;
                    return;
            }
            setTimeout(function(){
                new fns.push();
            },3000)
        }

}]);


