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
.factory('RoomSrv', function(Config){
  'user strict';
  var firebaseRef = new Firebase(Config.firebaseUrl+'default/');
  var service = {
    sendMessage: sendMessage,
    onMessage: onMessage,
    offMessage: offMessage
  };

  function sendMessage(message){
    firebaseRef.push(message);
  }

  function onMessage(fn){
    return firebaseRef.on('child_added', function(snapshot){
      var data = snapshot.val();
      fn(data);
    });
  }

  function offMessage(ref){
    firebaseRef.off('child_added', ref);
  }

  return service;
})

// see https://www.firebase.com/docs/web/libraries/angular/api.html#angularfire-firebasearray
.factory('RoomSrv2', function($firebaseArray, Config){
  'user strict';
  var firebaseRef = new Firebase(Config.firebaseUrl+'default/');
  var service = {
    sendMessage: sendMessage,
    getMessages: getMessages,
    destroy: destroy
  };

  function sendMessage(messages, message){
    messages.$add(message);
  }

  function getMessages(){
    return $firebaseArray(firebaseRef);
  }

  function destroy(messages){
    messages.$destroy();
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
