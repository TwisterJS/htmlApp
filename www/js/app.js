// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

app.controller('tabSetup', function($http) {
$http.get('JSON/buildingBlocks.json')
  .success(function(data) {
      this.tabMenu = data;
  }.bind(this))
  .error(function(data) {
      alert("FAILED TO GET");
  });
});

app.controller('glossaryCtrl', function($http) {
$http.get('JSON/glossary.json')
  .success(function(data) {
      this.gList = data;
  }.bind(this))
  .error(function(data) {
      alert("FAILED TO GET");
  });
});


app.controller('gameOneCtrl',
  function getInfo($http, $ionicPopup, $scope) {
    $http.get('JSON/gameOne.json')
      .success(function(data) {
          $scope.gameQuestions = data;
      })
      .error(function(data) {
          alert("FAILED TO GET");
    });
  $scope.showPopup = function () {
      $scope.data = {};

      var myPopup = $ionicPopup.show({
          template: '<input type="text" ng-model="data.theirAnswer">',
          title: 'Type in the missing tab.',
          scope: $scope,
          buttons: [
              { text: 'Cancel' },
              {
                  text: 'Submit',
                  type: 'button-positive',
                  onTap: function(e) {
                    console.log(e);
                    if(!$scope.data.theirAnswer) {
                      e.preventDefault();
                    } else {
                      return $scope.data.theirAnswer;
                    }
                  }
              }
          ]
      });
      myPopup.then(function(res) {
        var theirAnswer = res;
        console.log(res);
        console.log(this);
      })
  }

});
