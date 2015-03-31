angular.module('app')

.controller('AppCtrl', function($scope, $state, $ionicSideMenuDelegate, $ionicHistory, RoomBackend, RoomUI, ToastPlugin){
  'user strict';
  RoomBackend.getRooms().then(function(rooms){
    $scope.rooms = rooms;
  });

  // refresh rooms when you open side-menu
  $scope.$watch(function(){ return $ionicSideMenuDelegate.isOpen(); }, function(opened){
    if(opened){
      RoomBackend.getRooms().then(function(rooms){
        for(var i in rooms){
          if(!_.find($scope.rooms, {id: rooms[i].id})){
            $scope.rooms.unshift(rooms[i]);
          }
        }
      });
    }
  });

  $scope.createRoom = function(){
    RoomUI.createRoom().then(function(roomId){
      if(roomId){
        if(!_.find($scope.rooms, {id: roomId})){
          $scope.rooms.unshift({id: roomId});
        }
        ToastPlugin.show('Création de la room '+roomId);
        $state.go('app.room', {roomId: roomId});
        $ionicSideMenuDelegate.toggleLeft(false);
        $ionicHistory.nextViewOptions({
          disableAnimate: true,
          disableBack: true
        });
      }
    });
  };
})

.controller('RoomCtrl', function($scope, $stateParams, RoomSrv, UserSrv, RoomUI, UserUI, ToastPlugin){
  'user strict';
  var roomId = $stateParams.roomId;
  $scope.room = roomId;
  $scope.messages = [];

  $scope.$on('$ionicView.enter', function(){
    RoomSrv.onMessage(roomId, function(event, message){
      $scope.safeApply(function(){
             if(event === 'child_added')    { $scope.messages.unshift(message);                 }
        else if(event === 'child_removed')  { _.remove($scope.messages, {_ref: message._ref});  }
      });
    });
  });
  $scope.$on('$ionicView.leave', function(){
    RoomSrv.offMessage(roomId);
    $scope.messages = [];
  });

  $scope.sendMessage = function(){
    RoomSrv.sendMessage(roomId, UserSrv.get(), $scope.message);
    ToastPlugin.show('✓ Message envoyé');
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

.controller('RoomCtrl2', function($scope, $stateParams, RoomSrv2, UserSrv, RoomUI, UserUI, ToastPlugin){
  'user strict';
  var roomId = $stateParams.roomId;
  $scope.room = roomId;
  $scope.messages = null;

  $scope.$on('$ionicView.enter', function(){
    $scope.messages = RoomSrv2.getMessages(roomId);
  });
  $scope.$on('$ionicView.leave', function(){
    RoomSrv2.destroy($scope.messages);
  });

  $scope.sendMessage = function(){
    RoomSrv2.sendMessage($scope.messages, UserSrv.get(), $scope.message);
    ToastPlugin.show('✓ Message envoyé');
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
