angular.module('app')

.controller('AppCtrl', function($scope, RoomSrv){
  'user strict';
  var onMessageRef = null;
  $scope.messages = [];

  $scope.$on('$ionicView.enter', function(){
    onMessageRef = RoomSrv.onMessage(function(message){
      $scope.safeApply(function(){
        $scope.messages.unshift(message);
      });
    });
  });
  $scope.$on('$ionicView.leave', function(){
    if(onMessageRef !== null){
      RoomSrv.offMessage(onMessageRef);
      onMessageRef = null;
    }
  });

  $scope.sendMessage = function(){
    var message = {
      user: {
        avatar: 'http://ionicframework.com/img/docs/slimer.jpg',
        name: 'Slimer'
      },
      content: $scope.message
    };
    RoomSrv.sendMessage(message);
    $scope.message = '';
  };
})

.controller('AppCtrl2', function($scope, RoomSrv2){
  'user strict';
  $scope.messages = null;

  $scope.$on('$ionicView.enter', function(){
    $scope.messages = RoomSrv2.getMessages();
  });
  $scope.$on('$ionicView.leave', function(){
    RoomSrv2.destroy($scope.messages);
  });

  $scope.sendMessage = function(){
    var message = {
      user: {
        avatar: 'http://ionicframework.com/img/docs/slimer.jpg',
        name: 'Slimer'
      },
      content: $scope.message
    };
    RoomSrv2.sendMessage($scope.messages, message);
    $scope.message = '';
  };
});
