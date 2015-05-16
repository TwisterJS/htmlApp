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

app.controller('gameOneCtrl', function($http, $ionicPopup, $scope) {

  function jsonSuccess(data) {
    console.log(data);
    $scope.questions = data;
  }
  function jsonError(data) {
    alert("FAILED TO GET");
  }



  function onTap(e) {
    console.log($scope);
    if(!$scope.popup.answer) {
        e.preventDefault();
    } else {
        return $scope.answer;
    }
  }

  function showPopup(q, index, questions) {
      $scope.popup.answer = '';
      $scope.popup.compare = q.answer;

      function checkAnswer(res) {
          var answer = $scope.popup.answer;
          var compare = $scope.popup.compare;

          if(answer == compare){
              questions[index].answered = true;
              questions[index].wrong = false;
          } else {
              questions[index].wrong = true;
          }

          $scope.popup = {};
      }

  function clickOK() {
    $scope.clickOK = true;
  }

      var buttons = [
          { text: 'Cancel' },
          { text: 'Submit',
            type: 'button-positive',
            onTap: onTap}
        ];

      var popupConfig = {
          template: '<input type="text" ng-model="popup.answer">',
          title: 'Type in the missing tab.',
          scope: $scope,
          buttons: buttons
      };
      var myPopup = $ionicPopup.show(popupConfig);
      myPopup.then(checkAnswer);
  };

  $http
    .get('JSON/gameOne.json')
    .success(jsonSuccess)
    .error(jsonError);

  $scope.showPopup = showPopup;
  $scope.popup = {
      answer: ''
  };
});
