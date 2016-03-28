/**
 * Created by Owner on 3/21/2016.
 */
var app = angular.module("myapp", ["firebase","toaster","angucomplete"]);
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
    $scope.lastId="";
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
            toaster.pop('success', "Successfully Submitted:", "Thanks " + $scope.name);
            return $scope.messages.$add({
                from: $scope.name, comment: $scope.comment,
                Question1: $scope.answer1,
                Question2: $scope.answer2,
                Question3: $scope.answer3
            }).then(function (ref) {
                //console.log(ref.name()); // console log current id
                $scope.lastId= ref.name();
                //$scope.storedId.push(recordUid);
                //$scope.messages[recordUid].id=recordUid;
                //$scope.messages.$save(recordUid);
                var keys = $scope.messages.$getIndex();
                angular.forEach(keys, function(key) {
                    $scope.q1Total = $scope.q1Total+$scope.messages[key].Question1;
                    $scope.q2Total = $scope.q2Total+$scope.messages[key].Question2;

                    //$scope.totQuestion1=$scope.q1Total;
                    //$scope.messages[key].totQuestion1=$scope.q1Total;
                    //$scope.messages.$save(key);
                    //$scope.messages[key].totQuestion1=$scope.messages[recordUid].totQuestion1;
                    //$scope.messages.$save(key);
                    //console.log(key);
                    //console.log($scope.lastId);
                    console.log(keys.length);
                });
                angular.forEach(keys, function (key) {
                    $scope.messages[key].totQuestion1=$scope.q1Total;
                    $scope.messages[key].totQuestion2=$scope.q2Total;
                    $scope.messages.$save(key);
                });
                //$scope.messages[recordUid].totQuestion1=$scope.q1Total;
                //$scope.messages.$save(recordUid);
            });

            //$scope.records.$add({'name': this.record}).then(function(ref) {
            //    var recordUid = ref.name(); <-- ref.name() is the uid of the object we've just submitted.
            //    $scope.records[recordUid].id = recordUid; <-- Adding of the uid as an id param
            //    $scope.records.$save(recordUid); <-- finally we tell it what record to save using the uid.
            $scope.comment = "";
        }
    }
}