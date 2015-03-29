angular.module('app')

// see https://www.firebase.com/docs/web/api/
.factory('RoomSrv', function(){
  'user strict';
  var firebaseUrl = 'https://chat-devoxx-2015.firebaseio.com/loicknuchel/default/';
  var firebaseRef = new Firebase(firebaseUrl);
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
.factory('RoomSrv2', function($firebaseArray){
  'user strict';
  var firebaseUrl = 'https://chat-devoxx-2015.firebaseio.com/loicknuchel/default/';
  var firebaseRef = new Firebase(firebaseUrl);
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
