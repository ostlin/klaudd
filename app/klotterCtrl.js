angular.module('klotterApp').controller('klotterCtrl', function ($scope, $http, $window, $timeout) {
    $scope.loggedIn = false;
    $scope.name = "";
    $scope.klotterposts = [];
    $scope.verifylogin = true;
    $scope.pagingoffset = 0;

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
                      $scope.verifylogin = false;
			    	}, 50);
	          });
	       } else {
	          Backendless.LocalCache.clear();
              $scope.verifylogin = false;
	       }	       
       });
    } else {
        $scope.verifylogin = false;
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
    	}, 100);
    }

    function userLoggedOut() {
		location.reload();
    }

    $scope.logoutUserClick = function() {
        localStorage.clear();
        Backendless.UserService.logout().then(userLoggedOut, gotError);
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
		var queryBuilder = Backendless.DataQueryBuilder.create();
		 
		// request sorting
		queryBuilder.setSortBy( [ "created desc" ] );
		$scope.pagingoffset = 0;
		// set offset and page size
		queryBuilder.setPageSize( 10 );
		queryBuilder.setOffset( $scope.pagingoffset);
	    Backendless.Persistence.of(post).find(queryBuilder).then(dataLoaded, gotError);
    }

    $scope.loadmore = function () {
        $scope.loadingmoredata = true;
		var queryBuilder = Backendless.DataQueryBuilder.create();
		// request sorting
		queryBuilder.setSortBy( [ "created desc" ] );
		// set offset and page size
		queryBuilder.setPageSize( 10 );
		queryBuilder.setOffset( $scope.pagingoffset);
	    Backendless.Persistence.of(post).find(queryBuilder).then(dataLoaded, gotError);       
    }

    function dataLoaded(data) {
        $timeout(function () {
            $scope.pagingoffset = $scope.pagingoffset + data.length;
            console.log('hittade bilder - ', data.length);
	        for(var item in data) {
	            $scope.klotterposts.push(data[item]);
	        }
            $scope.loadingmoredata = false;
    	}, 50);
    }

    function postAdded(post) {
	    $scope.newshittext = "";
	    $scope.getAllPosts();
    }

    // new upload function
    $scope.handleFileSelect = function($event) {
        $("#working").show();
        $("#main").hide();
        $("#images").hide();
        var filesToUpload = $event.target.files;
        var file = filesToUpload[0];
        // Create an image
        var ctx = document.getElementById('thepicture').getContext('2d');
        var img = new Image;
        img.onload = function() {
                    var MAX_WIDTH = 600;
                    var MAX_HEIGHT = 600;
                    var width = img.width;
                    var height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }
                    ctx.canvas.width = width;
                    ctx.canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);
                    pictureRenderd(ctx.canvas.toDataURL("image/png"));
        }
        img.src = URL.createObjectURL(file);
    }

    function pictureRenderd(data) {
        var filename = new Date().getTime() + ".png";
        var path = '/myFiles/' + new Date().getTime() + '/';

        // Decode the dataURL
        binary = atob(data.split(',')[1])
        // Create 8-bit unsigned array
        array = []
        for (var i = 0; i < binary.length; ++i) {
            array.push(binary.charCodeAt(i));
        }
        var blob = new Blob([ new Uint8Array(array)], {type : 'image/png'})
        var savedFile = Backendless.Files.saveFile( path, filename, blob, true ).then(fileuploaded, fileUploadError);
        console.log("File sent");
    }

    function fileuploaded(file) {
        var inputtext = $scope.inputtext; 
	    var data = new post( {
		    text: inputtext,
            url: file
		});

		Backendless.Persistence.of(post).save(data).then(postAdded, gotError);
    }

    function postAdded(post) {
        $scope.inputtext = "";
        $scope.getAllPosts();
        $("#working").hide();
        $("#main").show();
        $("#images").show();
    }

    function fileUploadError(error) {
        $("#working").hide();
        $("#main").show();
        $("#images").show();
        alert(error.message);
    }

    function post(args) {
	    args = args || {};
	    this.text = args.text || "";
        this.url = args.url || "";
	}
});
