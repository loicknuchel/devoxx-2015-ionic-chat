angular.module('app')

.controller('AppCtrl', function(){
  'user strict';
})

.controller('RoomCtrl', function($scope, RoomSrv, UserSrv, RoomUI, UserUI){
  'user strict';
  var onMessageRef = null;
  $scope.messages = [];

  $scope.$on('$ionicView.enter', function(){
    onMessageRef = RoomSrv.onMessage(function(event, message){
      $scope.safeApply(function(){
             if(event === 'child_added')    { $scope.messages.unshift(message);                 }
        else if(event === 'child_removed')  { _.remove($scope.messages, {_ref: message._ref});  }
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

  $scope.messageActions = function(message){
    RoomUI.messageActions(message).then(function(action){
      if(action === 'delete'){
        RoomSrv.deleteMessage(message);
      }
    });
  };
})

.controller('RoomCtrl2', function($scope, RoomSrv2, UserSrv, RoomUI, UserUI){
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

  $scope.messageActions = function(message){
    RoomUI.messageActions(message).then(function(action){
      if(action === 'delete'){
        RoomSrv2.deleteMessage(message);
      }
    });
  };
});
