app.config(['$stateProvider','$urlRouterProvider',
  function(  $stateProvider , $urlRouterProvider ) {
          
          $urlRouterProvider.otherwise('app/news');
          $stateProvider
              .state('app', {
                  abstract: true,
                  url: '/app',
                  templateUrl: 'partials/app.html',
                  controller:'app'
              })
              .state('app.news', {
                  url: '/news',
                  templateUrl: 'partials/modules/news.html',
                  controller: 'news'
              })
    }
  ]
);



