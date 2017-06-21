var app = angular.module('klotterApp', []);



(function () {
	var APPLICATION_ID = '2860E1C5-8811-6193-FF8C-71ED4B349700';
	var API_KEY = '7FC57F96-C6ED-747A-FF24-3292425AE500';
	Backendless.serverURL = "https://api.backendless.com";
	Backendless.initApp(APPLICATION_ID, API_KEY);
})();
