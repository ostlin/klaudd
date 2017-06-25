var app = angular.module('klotterApp', []);

angular.module("klotterApp").directive('rotateonload', function(){
	return {
        restrict: 'A',
				link: function(scope, element, attrs) {
						element.bind('load', function() {
								console.log(element[0]);
									EXIF.getData(element[0], function() {
											var orientation = EXIF.getTag(this, "Orientation");
											console.log(orientation);
											console.log();
											if(6 == orientation) {
												$(this).css("transform", "rotate(90deg)")
												$(this).parent().css("overflow","hidden");
											}
											if(3 == orientation) {
												$(this).css("transform", "rotate(180deg)")
											}
									});
						});
						element.bind('error', function(){
								alert('image could not be loaded');
						});
				}
    };
});

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
