angular.module('app')

.factory('UserSrv', function(Storage){
  'use strict';
  var userKey = 'user';
  var userCache = Storage.get(userKey) || {name: 'Anonymous'};
  var service = {
    get: get,
    set: set
  };

  function get(){
    return angular.copy(userCache);
  }

  function set(user){
    Storage.set(userKey, user);
    userCache = angular.copy(user);
  }

  return service;
})

.factory('UserUI', function($rootScope, $ionicPopup){
  'use strict';
  var service = {
    changeName: changeName
  };

  function changeName(currentName){
    var popupScope = $rootScope.$new(true);
    popupScope.data = {
      userName: currentName
    };
    return $ionicPopup.show({
      template: '<input type="text" ng-model="data.userName" autofocus>',
      title: 'Votre nom :',
      scope: popupScope,
      buttons: [
        { text: 'Annuler' },
        {
          text: '<b>Modifier</b>',
          type: 'button-positive',
          onTap: function(e){
            return popupScope.data.userName;
          }
        },
      ]
    });
  }

  return service;
})

// see https://www.firebase.com/docs/web/api/
.factory('RoomSrv', function(RoomUtils, Config){
  'user strict';
  var service = {
    sendMessage: sendMessage,
    deleteMessage: deleteMessage,
    onMessage: onMessage,
    offMessage: offMessage
  };

  function sendMessage(roomId, user, message){
    _getRef(roomId).push(RoomUtils.formatMessage(user, message));
  }

  function deleteMessage(message){
    new Firebase(message._ref).remove();
  }

  function onMessage(roomId, fn){
    var firebaseRef = _getRef(roomId);
    firebaseRef.on('child_added', function(snapshot){
      var data = snapshot.val();
      data._ref = snapshot.ref().toString();
      fn('child_added', data);
    });
    firebaseRef.on('child_removed', function(snapshot){
      var data = snapshot.val();
      data._ref = snapshot.ref().toString();
      fn('child_removed', data);
    });
  }

  function offMessage(roomId){
    var firebaseRef = _getRef(roomId);
    firebaseRef.off('child_added');
    firebaseRef.off('child_removed');
  }

  var roomRefs = {};
  function _getRef(roomId){
    if(!roomRefs[roomId]){
      roomRefs[roomId] = new Firebase(Config.firebaseUrl+roomId+'/');
    }
    return roomRefs[roomId];
  }

  return service;
})

// see https://www.firebase.com/docs/web/libraries/angular/api.html#angularfire-firebasearray
.factory('RoomSrv2', function($firebaseArray, RoomUtils, Config){
  'user strict';
  var service = {
    sendMessage: sendMessage,
    deleteMessage: deleteMessage,
    getMessages: getMessages,
    destroy: destroy
  };

  function sendMessage(messages, user, message){
    messages.$add(RoomUtils.formatMessage(user, message));
  }

  function deleteMessage(messages, message){
    messages.$remove(message);
  }

  function getMessages(roomId){
    return $firebaseArray(_getRef(roomId));
  }

  function destroy(messages){
    messages.$destroy();
  }

  function _getRef(roomId){
    return new Firebase(Config.firebaseUrl+roomId+'/');
  }

  return service;
})

.factory('RoomBackend', function($http, Config){
  'user strict';
  var service = {
    getRooms: getRooms
  };

  function getRooms(){
    return $http.get(Config.firebaseUrl+'.json?shallow=true').then(function(res){
      var rooms = [];

      if(res && res.data){
        for(var i in res.data){
          if(res.data[i] && rooms.indexOf(i) === -1){
            rooms.push({id: i});
          }
        }
      }

      if (rooms.length === 0) {
        rooms.push({id: 'default'});
      }

      return rooms;
    });
  }

  return service;
})

.factory('RoomUtils', function(){
  'use strict';
  var service = {
    formatMessage: formatMessage
  };

  function formatMessage(user, message){
    return {
      sendDate: Date.now(),
      user: user,
      content: message
    };
  }

  return service;
})

.factory('RoomUI', function($rootScope, $q, $ionicActionSheet, $ionicPopup){
  'use strict';
  var service = {
    messageActions: messageActions,
    createRoom: createRoom
  };

  function messageActions(message){
    var defer = $q.defer();
    var hideSheet = $ionicActionSheet.show({
      titleText: 'Message de '+message.user.name+' :',
      destructiveText: 'Supprimer',
      destructiveButtonClicked: function(){
        defer.resolve('delete');
        hideSheet();
      },
      cancelText: 'Annuler',
      cancel: function(){
        defer.resolve('cancel');
        hideSheet();
      }
    });
    return defer.promise;
  }

  function createRoom(){
    var popupScope = $rootScope.$new(true);
    popupScope.data = {
      roomId: ''
    };
    return $ionicPopup.show({
      template: '<input type="text" ng-model="data.roomId" autofocus>',
      title: 'Nom de la room :',
      scope: popupScope,
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Rejoindre',
          type: 'button-positive',
          onTap: function(e){
            return popupScope.data.roomId;
          }
        }
      ]
    });
  }

  return service;
})

.factory('Storage', function($window){
  'use strict';
  var localStorageFallback = {};
  var service = {
    get: get,
    set: set
  };

  function get(key){
    if($window.localStorage){
      try {
        return JSON.parse($window.localStorage.getItem(key));
      } catch(e) {
        return null;
      }
    } else {
      return angular.copy(localStorageFallback[key]);
    }
  }

  function set(key, value){
    if($window.localStorage){
      $window.localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorageFallback[key] = angular.copy(value);
    }
  }

  return service;
});
