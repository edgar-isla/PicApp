/**
 * Created by Owner on 3/22/2016.
 */
/**
 * Created by Owner on 3/21/2016.
 */
var app = angular.module("myapp", ["firebase","angucomplete"]);
app.factory("myData", [function(){
    var  names = [
        {firstName: "Daryl", surname: "Rowland"},
        {firstName: "Alan", surname: "Partridge"},
        {firstName: "Annie", surname: "Rowland"}
    ];
    return {
        getNames: names
    };
}]);
app.controller('MainController', ['$scope', '$http', 'myData', function MyController($scope, $firebase, myData) {
    $scope.people = myData.getNames;
    $scope.showComments=false;
    $scope.viewComments= function () {
        $scope.showComments=true;
    };
    $scope.hideComments= function () {
        $scope.showComments=false;
    };
    var ref = new Firebase("https://mediapic.firebaseio.com/");

    $scope.messages = $firebase(ref);

    $scope.addMessage = function(e) {
        if (e.keyCode != 13) return;
        //if($scope.q1=""|| $scope.name="")
        $scope.messages.$add({from: $scope.name, comment: $scope.q1,
            Question1 : $scope.answer1,
            Question2 : $scope.answer2
        });
        $scope.q1 = "";
    }
} ]);