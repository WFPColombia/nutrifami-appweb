nf2.controller('SimpleModalCtrl', function($scope, $uibModalInstance, data) {
    
    $scope.message = data.message;
    $scope.sticker = data.sticker;
    $scope.close = function() {
        $uibModalInstance.close();
    };
});
