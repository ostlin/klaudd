var app = angular.module('klotterApp', []);

angular.module("klotterApp").directive("ngUploadChange",function(){
    return{
        scope:{
            ngUploadChange:"&"
        },
        link:function($scope, $element, $attrs){
            $element.on("change",function(event){
                $scope.ngUploadChange({$event: event})
            })
            $scope.$on("$destroy",function(){
                $element.off();
            });
        }
    }
});


(function () {
	var APPLICATION_ID = '17336321-EBBE-B67F-FFBA-B43C41594100';
	var API_KEY = '370A795C-E620-1E61-FF9B-0BAAE8EE4D00';
	Backendless.serverURL = "https://api.backendless.com";
	Backendless.initApp(APPLICATION_ID, API_KEY);
})();
