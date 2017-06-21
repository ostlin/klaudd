angular.module('klotterApp').controller('klotterCtrl', function ($scope, $http, $window, $timeout) {

    $scope.loggedIn = false;
    $scope.name = "";

    /*var cache = Backendless.LocalCache.getAll();
    if (cache["stayLoggedIn"]) {
       var tokenExist = Backendless.UserService.isValidLogin();
       if (tokenExist) {
          userLoggedInStatus(cache["user-token"]);
       } else {
          Backendless.LocalCache.clear();
       }
    }*/

    $scope.facebookLogin = function() {
      console.log("wooo");
      permissions = "email";
      facebookFieldsMapping = {email:"email"};
      Backendless.UserService.loginWithFacebook(facebookFieldsMapping, permissions).then($scope.facebookLoginOK, gotError);
    }

    $scope.facebookLoginOK = function(user) {
      console.log(user.name);
      $timeout(function () {
        $scope.loggedIn = true;
        $scope.name = user.name;
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
		var queryBuilder = Backendless.DataQueryBuilder.create();

		// set where clause
		//queryBuilder.setWhereClause( "age > 30" );

		// request related objects for the columns
		//queryBuilder.setRelated( [ "address", "preferences" ] );

		// request sorting
		queryBuilder.setSortBy( [ "created desc" ] );

		// set offset and page size
		queryBuilder.setPageSize( 100 );
		//queryBuilder.setOffset( 0 );
	    Backendless.Persistence.of(klotter).find(queryBuilder).then(dataLoaded, gotError);
    }

    function dataLoaded(data) {
        $timeout(function () {
	        $scope.klotterposts.length = 0;
	        for(var item in data) {
	            $scope.klotterposts.push(data[item]);
	        }
    	}, 350);
    }

    function postAdded(post) {
	    $scope.newshittext = "";
	    $scope.getAllPosts();
    }
});
