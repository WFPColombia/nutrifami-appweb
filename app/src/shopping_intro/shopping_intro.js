nf2.controller('ShoppingIntroCtrl', function($scope, ngAudio) {
    'use strict';
    $scope.audio1 = ngAudio.load("audios/consejos-saludables-1.mp3");
    $scope.audio2 = ngAudio.load("audios/consejos-saludables-2.mp3");

});
