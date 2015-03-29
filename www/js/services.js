angular.module('app')

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
});
