angular.module('klotterApp').controller('klotterCtrl', function ($scope, $http, $window, $timeout) {
    $scope.loggedIn = false;
    $scope.name = "";
    $scope.klotterposts = [];

    var cache = Backendless.LocalCache.getAll();
    if (cache["stayLoggedIn"]) {
       var tokenExist = Backendless.UserService.isValidLogin().then(function (token) {
	       if (token) {
	          var currentUser = Backendless.UserService.loggedInUser();	          
	          var dataObject = Backendless.Persistence.of("Users").findById(currentUser).then(function (data) {      
		            $timeout(function () {
			          $scope.loggedIn = true;
			          $scope.name = data.name;
                      $scope.getAllPosts();
			    	}, 250);
	          });
	       } else {
	          Backendless.LocalCache.clear();
	       }	       
       });
    }

    $scope.facebookLogin = function() {
      console.log("wooo");
      permissions = "email";
      facebookFieldsMapping = {email:"email"};
      Backendless.UserService.loginWithFacebook(facebookFieldsMapping, permissions, true).then($scope.facebookLoginOK, gotError);
    }

    $scope.facebookLoginOK = function(user) {
      console.log(user.name);
      $timeout(function () {
        $scope.loggedIn = true;
        $scope.name = user.name;
        $scope.getAllPosts();
    	}, 250);
    }

    $scope.loginClick = function () {
	    var self = this;
	    Backendless.LocalCache.clear();
	    Backendless.UserService.login($scope.loginName, $scope.loginPassword, true).then($scope.userLoggedInStatus, gotError);
    }

    $scope.showRegister = function () {
       console.log($scope.wantToRegister);
       $scope.wantToRegister = true;
    }

    function userLoggedOut() {
		location.reload();
    }

    $scope.logoutUserClick = function() {
        localStorage.clear();
        Backendless.UserService.logout().then(userLoggedOut, gotError);
    }

    $scope.userLoggedInStatus = function (user) {
	    $timeout(function () {
		    $scope.loggedIn = true;
		    $scope.loginName = "";
		    $scope.loginPassword = "";
		    $scope.getAllPosts();
    	}, 250);
    }

    function gotError(err) { // see more on error handling
        if (err.code != 0) {
	        alert(err.message);
            console.log("error message - " + err.message);
            console.log("error code - " + err.statusCode);
        }
    }

    function userRegistered(user) {
	    Backendless.UserService.login($scope.createUserName, $scope.createPassword, true).then(userLoggedInStatus, gotError);
    }

    $scope.createUserClick = function() {
	    var user = new Backendless.User();
	    user.email = $scope.createUserName;
	    user.name = $scope.createName;
	    user.password = $scope.createPassword;
	    Backendless.UserService.register(user).then(userRegistered, gotError);
    }


    // POSTA DATA
    function klotter(args) {
	    args = args || {};
	    this.text = args.text || "";
	}

	function DataQuery(args) {
	  var properties = [];
	  var condition;
	  var options;
	}

    $scope.createPostClick = function() {
	    var post = new klotter( {
		    text: $scope.newshittext
		});
		Backendless.Persistence.of(klotter).save(post).then(postAdded, gotError);
    }

    $scope.getAllPosts = function() {
	    $scope.klotterposts.length = 0;
        Backendless.Files.listing( "/myFiles", "*.*", true, 100 ).then(dataLoaded, gotError);
    }

    function dataLoaded(data) {
        data.sort((a, b) => {
            return parseFloat(b.createdOn) - parseFloat(a.createdOn);
        });

        $timeout(function () {
	        $scope.klotterposts.length = 0;
            console.log('hittade bilder - ', data.length);
	        for(var item in data) {
	            $scope.klotterposts.push(data[item]);
	        }
    	}, 350);
    }

    function postAdded(post) {
	    $scope.newshittext = "";
	    $scope.getAllPosts();
    }

    $scope.handleFileSelect = function($event){
        var files = $event.target.files;
        $("#loadertrams").show();
        
        console.log("\n============ Uploading file with the SYNC API ============"); 
        try { 
        var uploadedFile = Backendless.Files.upload( files, '/myFiles').then(fileuploaded, fileUploadError); 
        console.log( "Uploaded file URL - " + uploadedFile.fileURL); 
        } catch(e) { 
        console.log(e); 
        } 
    }

    function fileuploaded(file) {
        $scope.getAllPosts();
        $("#loadertrams").hide();
    }

    function fileUploadError(error) {
        $("#loadertrams").hide();
        alert(error.message);
    }
});
