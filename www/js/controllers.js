angular.module('app')

.controller('AppCtrl', function($scope){
  'user strict';

  $scope.messages = [
    {user: {avatar: 'http://ionicframework.com/img/docs/venkman.jpg', name: 'Venkman'}, content: 'Back off, man. I\'m a scientist.'},
    {user: {avatar: 'http://ionicframework.com/img/docs/spengler.jpg', name: 'Egon'}, content: 'We\'re gonna go full stream.'},
    {user: {avatar: 'http://ionicframework.com/img/docs/stantz.jpg', name: 'Ray'}, content: 'Ugly little spud, isn\'t he?'},
    {user: {avatar: 'http://ionicframework.com/img/docs/winston.jpg', name: 'Winston'}, content: 'That\'s a big Twinkie.'},
    {user: {avatar: 'http://ionicframework.com/img/docs/tully.jpg', name: 'Tully'}, content: 'Okay, who brought the dog?'},
    {user: {avatar: 'http://ionicframework.com/img/docs/barrett.jpg', name: 'Dana'}, content: 'I am The Gatekeeper!'},
    {user: {avatar: 'http://ionicframework.com/img/docs/slimer.jpg', name: 'Slimer'}, content: 'Boo!'}
  ];

  $scope.sendMessage = function(){
    $scope.messages.unshift({
      user: {
        avatar: 'http://ionicframework.com/img/docs/slimer.jpg',
        name: 'Slimer'
      },
      content: $scope.message
    });
    $scope.message = '';
  };
});
