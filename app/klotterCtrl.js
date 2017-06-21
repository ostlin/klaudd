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
        $("#working").hide();
        $("#main").show();
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

    $scope.getAllPosts = function() {
	    $scope.klotterposts.length = 0;
        Backendless.Files.listing( "/myFiles", "*.*", true, 100 ).then(dataLoaded, gotError);
    }

    $scope.getAllPosts = function() {
	    $scope.klotterposts.length = 0;
		var queryBuilder = Backendless.DataQueryBuilder.create();
		 
		// set where clause
		//queryBuilder.setWhereClause( "age > 30" );
		 
		// request related objects for the columns
		//queryBuilder.setRelated( [ "address", "preferences" ] );
		 
		// request sorting
		queryBuilder.setSortBy( [ "created desc" ] );
		 
		// set offset and page size
		queryBuilder.setPageSize( 100 );
		queryBuilder.setOffset( 0 );
	    Backendless.Persistence.of(post).find(queryBuilder).then(dataLoaded, gotError);
    }



    function dataLoaded(data) {
 

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
        $("#working").show();
        $("#main").hide();
        
        console.log("\n============ Uploading file with the SYNC API ============"); 
        try { 
        var uploadedFile = Backendless.Files.upload( files, '/myFiles').then(fileuploaded, fileUploadError); 
        console.log( "Uploaded file URL - " + uploadedFile.fileURL); 
        } catch(e) { 
        console.log(e); 
        } 
    }

    function fileuploaded(file) {
        var inputtext = $scope.inputtext; 
        $("#working").hide();
        $("#main").show();

	    var data = new post( {
		    text: inputtext,
            url: file.fileURL
		});

		Backendless.Persistence.of(post).save(data).then(postAdded, gotError);
    }

    function postAdded(post) {
        $scope.getAllPosts();
        $("#working").hide();
        $("#main").show();
    }

    function fileUploadError(error) {
        $("#working").hide();
        $("#main").show();
        alert(error.message);
    }

    function post(args) {
	    args = args || {};
	    this.text = args.text || "";
        this.url = args.url || "";
	}
});
