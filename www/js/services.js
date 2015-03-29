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
  var firebaseRef = new Firebase(Config.firebaseUrl+'default/');
  var service = {
    sendMessage: sendMessage,
    deleteMessage: deleteMessage,
    onMessage: onMessage,
    offMessage: offMessage
  };

  function sendMessage(user, message){
    firebaseRef.push(RoomUtils.formatMessage(user, message));
  }

  function deleteMessage(message){
    new Firebase(message._ref).remove();
  }

  function onMessage(fn){
    firebaseRef.on('child_added', function(snapshot){
      var data = snapshot.val();
      data._ref = snapshot.ref().toString();
      fn('child_added', data);
    });
    return firebaseRef.on('child_removed', function(snapshot){
      var data = snapshot.val();
      data._ref = snapshot.ref().toString();
      fn('child_removed', data);
    });
  }

  function offMessage(ref){
    firebaseRef.off('child_added', ref);
    firebaseRef.off('child_removed', ref);
  }

  return service;
})

// see https://www.firebase.com/docs/web/libraries/angular/api.html#angularfire-firebasearray
.factory('RoomSrv2', function($firebaseArray, RoomUtils, Config){
  'user strict';
  var firebaseRef = new Firebase(Config.firebaseUrl+'default/');
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

  function getMessages(){
    return $firebaseArray(firebaseRef);
  }

  function destroy(messages){
    messages.$destroy();
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

.factory('RoomUI', function($q, $ionicActionSheet){
  'use strict';
  var service = {
    messageActions: messageActions
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
