angular.module('app')

.controller('AppCtrl', function($scope, RoomSrv, UserSrv, UserUI){
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
    RoomSrv.sendMessage(UserSrv.get(), $scope.message);
    $scope.message = '';
  };

  $scope.changeUserName = function(){
    var user = UserSrv.get();
    UserUI.changeName(user.name).then(function(newName){
      if(newName){
        user.name = newName;
        UserSrv.set(user);
      }
    });
  };
})

.controller('AppCtrl2', function($scope, RoomSrv2, UserSrv, UserUI){
  'user strict';
  $scope.messages = null;

  $scope.$on('$ionicView.enter', function(){
    $scope.messages = RoomSrv2.getMessages();
  });
  $scope.$on('$ionicView.leave', function(){
    RoomSrv2.destroy($scope.messages);
  });

  $scope.sendMessage = function(){
    RoomSrv2.sendMessage($scope.messages, UserSrv.get(), $scope.message);
    $scope.message = '';
  };

  $scope.changeUserName = function(){
    var user = UserSrv.get();
    UserUI.changeName(user.name).then(function(newName){
      if(newName){
        user.name = newName;
        UserSrv.set(user);
      }
    });
  };
});
