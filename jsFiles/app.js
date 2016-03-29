/**
 * Created by Owner on 3/21/2016.
 */
var app = angular.module("myapp", ["firebase","toaster","angucomplete","kendo.directives"]);
app.factory("myData", [function(){
    var  names = [
        {firstName: "Edgar", surname: "Rowland"},
        {firstName: "Alan", surname: "Partridge"},
        {firstName: "Annie", surname: "Rowland"}
    ];
    return {
        getNames: names
    };
}]);

app.controller("MyController", MyController);
MyController.$inject = ['$scope','$firebase','toaster','myData','$timeout'];

function MyController($scope, $firebase, toaster, myData, $timeout) {
    $scope.people = myData.getNames;
    $scope.showSend=false;
    $scope.showCommentsBtn=false;
    $scope.showComments=false;
    $scope.hideCommentsBtn=false;
    $scope.q1Total=0;
    $scope.q2Total=0;
    $scope.q3Total=0;
    $scope.keyLength=0;
    $scope.lastId="";
    $scope.averageQuestion1=0;
    $scope.averageQuestion2=0;
    $scope.averageQuestion3=0;
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
        else if($scope.answer1==undefined)
        {
            toaster.pop('warning', "Question 1 is not valid", "Scale is from 1-10");
        }
        else if($scope.answer2==undefined)
        {
            toaster.pop('warning', "Question 2 is not valid", "Scale is from 1-10");
        }
        else if($scope.answer3==undefined)
        {
            toaster.pop('warning', "Question 3 is not valid", "Scale is from 1-10");
        }
        else {
            $scope.showSend=true;
            $scope.showCommentsBtn=true;
            toaster.pop('success', "Successfully Submitted:", "Thanks " + $scope.name);
            return $scope.messages.$add({
                from: $scope.name, comment: $scope.comment,
                Question1: $scope.answer1,
                Question2: $scope.answer2,
                Question3: $scope.answer3
            }).then(function (ref) {
                //console.log(ref.name()); // console log current id
                $scope.lastId= ref.name();
                var keys = $scope.messages.$getIndex();
                angular.forEach(keys, function(key) {
                    $scope.q1Total = $scope.q1Total+$scope.messages[key].Question1;
                    $scope.q2Total = $scope.q2Total+$scope.messages[key].Question2;
                    $scope.q3Total = $scope.q3Total+$scope.messages[key].Question3;
                    $scope.keyLength=keys.length;
                });
                angular.forEach(keys, function (key) {
                    //console.log(keys.length);
                    $scope.messages[key].totQuestion1=$scope.q1Total;
                    $scope.messages[key].totQuestion2=$scope.q2Total;
                    $scope.messages[key].totQuestion3=$scope.q3Total;
                    $scope.messages[key].CurrLength=$scope.keyLength;
                    $scope.messages.$save(key);
                });
                angular.forEach(keys,function (key){
                    $scope.messages[key].Q1Avg=$scope.messages[key].totQuestion1/$scope.messages[key].CurrLength;
                    $scope.messages[key].Q2Avg=$scope.messages[key].totQuestion2/$scope.messages[key].CurrLength;
                    $scope.messages[key].Q3Avg=$scope.messages[key].totQuestion3/$scope.messages[key].CurrLength;
                    $scope.messages.$save(key);
                });
            });
        }
    };
}