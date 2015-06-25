var frutas = ["laranja","pimentao","morango"];

var app = angular.module("organica",['ngRoute','chart.js'])
.config(['$routeProvider',
function($routeProvider) {
	$routeProvider.
		when('/', {
			templateUrl: 'content.html',
			controller: 'vazioCtrl'
		}).
		when('/fruta/:frutaId', {
			templateUrl: 'content.html',
			controller: 'cheioCtrl'
		}).
		otherwise({
			redirectTo: '/'
		});
}])
.controller("vazioCtrl",['$scope',function($scope){
	$scope.fruta = randomFruit();
	console.log($scope.fruta);
}])
.controller("cheioCtrl",['$scope','$routeParams',function($scope,$routeParams){
	$scope.fruta = pickFruit($routeParams.frutaId);
	console.log($scope.fruta);
}]);

function randomFruit()
{
	var num = Math.floor((Math.random() * frutas.length));
	return frutas[num];
}

function pickFruit(fruta)
{
	if (isFruit(fruta))
		return fruta;
	else
		return randomFruit();
}

function isFruit(fruta)
{
	for (var i = 0; i < frutas.length; i++) {
		if (frutas[i] == fruta)
			return true;
	}
	return false;
}
