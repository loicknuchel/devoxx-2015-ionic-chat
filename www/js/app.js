angular.module('app', ['ionic', 'firebase', 'angularMoment'])

.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
  .state('app', {
    url: '/app',
    templateUrl: 'views/app.html',
    controller: 'AppCtrl'
  });
  $urlRouterProvider.otherwise('/app');
})

.constant('Config', {
  firebaseUrl: 'https://chat-devoxx-2015.firebaseio.com/loicknuchel/'
})

.run(function($ionicPlatform, $rootScope){
  $ionicPlatform.ready(function(){
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard){
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar){
      StatusBar.styleDefault();
    }
  });

  $rootScope.safeApply = function(fn){
    var phase = this.$root ? this.$root.$$phase : this.$$phase;
    if(phase === '$apply' || phase === '$digest'){
      if(fn && (typeof(fn) === 'function')){
        fn();
      }
    } else {
      this.$apply(fn);
    }
  };
})
