var app = angular.module('klotterApp', []);



(function () {
	var APPLICATION_ID = '17336321-EBBE-B67F-FFBA-B43C41594100';
	var API_KEY = '370A795C-E620-1E61-FF9B-0BAAE8EE4D00';
	Backendless.serverURL = "https://api.backendless.com";
	Backendless.initApp(APPLICATION_ID, API_KEY);
})();
