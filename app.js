/**
 * Created by Owner on 3/21/2016.
 */
var app = angular.module("myapp", ["firebase","toaster"]);


app.controller("MyController", MyController);
MyController.$inject = ['$scope','$firebase','toaster'];

function MyController($scope, $firebase, toaster) {
    $scope.showSend=false;
    $scope.showCommentsBtn=false;
    $scope.showComments=false;
    $scope.hideCommentsBtn=false;

    $scope.viewComments= function () {
        $scope.showComments=true;
        $scope.hideCommentsBtn=true;
        $scope.showCommentsBtn=false;
    };
    $scope.hideComments= function () {
        $scope.hideCommentsBtn=false;
        $scope.showCommentsBtn=true;
        $scope.showComments=false;

    };
    var ref = new Firebase("https://mediapic.firebaseio.com/");

    $scope.messages = $firebase(ref);

    $scope.addMessage = function() {
        if($scope.name== undefined || $scope.name=="")
        {
            toaster.pop('warning', "No name given", "Please enter your name");
        }
        else if($scope.comment== undefined || $scope.comment=="")
        {
            toaster.pop('warning', "Comment area is blank.", "Please type a comment");
        }
        else {
            $scope.showSend=true;
            $scope.showCommentsBtn=true;
            toaster.pop('success', "Succesfully Submitted:", "Thanks " + $scope.name);
            return $scope.messages.$add({
                from: $scope.name, comment: $scope.comment,
                Question1: $scope.answer1,
                Question2: $scope.answer2,
                Question3: $scope.answer3
            });
            $scope.comment = "";
        }
    }
}