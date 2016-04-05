//Forked from
//http://codepen.io/ionic/pen/uzngt
var debug = {};
angular.module('ionic.example', ['ionic'])

.controller('MapCtrl', function($scope, $ionicLoading, $compile) {
	$scope.markers = [];
	$scope.view = {}; //Debug visual

	google.maps.event.addDomListener(window, 'load', initialize);

	$scope.centerOnMe = function() {
		if(!$scope.map) {
			return;
		}

		$scope.loading = $ionicLoading.show({
			content: 'Pegando a localização',
			showBackdrop: false
		});

		navigator.geolocation.getCurrentPosition(function(pos) {
			$scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
			$ionicLoading.hide();
		}, function(error) {
			alert('Erro ao tentar localizar: ' + error.message);
		});
	};

	$scope.distance = function(i) {
		return getDistance($scope.markers[i].position,$scope.myselfMarker.position).toString()
	}

	function initialize()
	{
		
		// Define a posição
		var myLatlng = new google.maps.LatLng(-22.962868,-43.170048);
		
		// Opções do Mapa
		var mapOptions = {
			center: myLatlng,
			zoom: 16,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			mapTypeControl:false,
			streetViewControl: false
		};

		// Cria o Mapa
		var map = new google.maps.Map(document.getElementById("map"),
			mapOptions);

		// Cria o Marcador de Posição para o Debug
		var myselfMarker = new google.maps.Marker({
			position: myLatlng,
			map: map,
			label: '☺',
			title: 'Eu'
		});

		// Coloca o Marcador no mapa
		$scope.myselfMarker = myselfMarker;
		debug.myselfMarker = myselfMarker;

		// Define o mapa no escopo
		$scope.map = map;

		//Atualiza o Debug
		$scope.view.lugar = $scope.map.getCenter().lat() +","+$scope.map.getCenter().lng();

		// Aciona a função toda vez que o centro do mapa se alterar
		google.maps.event.addDomListener($scope.map, 'center_changed', function(){
			var center_ = $scope.map.getCenter();
			$scope.myselfMarker.setPosition(center_);
			$scope.view.lugar = center_.lat() + "," + center_.lng();

			// Atualiza a view
			$scope.$apply();
		});

		createMarkes();
		$scope.$apply();
	}

	function createMarkes()
	{
		//Lugares pré definidos
		var places = [[-22.964357,-43.177534],[-22.963381,-43.172658],[-22.963253,-43.17494],[-22.966842,-43.171528],[-22.965439,-43.172273],[-22.968099,-43.172221],[-22.969836,-43.177189],[-22.967079,-43.173814],[-22.965786,-43.173986],[-22.961722,-43.173604],[-22.967147,-43.171253],[-22.969799,-43.177486],[-22.96523,-43.173245],[-22.967918,-43.174884],[-22.967695,-43.178544],[-22.967877,-43.172252]];


		for (var i = 0; i <places.length; i++) {
			$scope.markers[i] = new google.maps.Marker({
				position: new google.maps.LatLng(places[i][0],places[i][1]),
				map: $scope.map
			});
		}

		var infowindow = new google.maps.InfoWindow({content: "creating..."});

		for (var i = 0; i <$scope.markers.length; i++) {
			var contentString = "<div>Distância em metros:<br><span ng-bind='distance("+i+")'></span></div>";
			var compiled = $compile(contentString)($scope);
			google.maps.event.addListener($scope.markers[i], 'click', (function(map,marker,content,infowindow){ 
				return function() {
					infowindow.setContent(content);
					infowindow.open(map,marker);
				};
			})($scope.map,$scope.markers[i],compiled[0],infowindow));
		}

		/*
				//Marker + infowindow + angularjs compiled ng-click
		var contentString = "<div><a ng-click='clickTest()'>Clique em mim!</a></div>";
		var compiled = $compile(contentString)($scope);

		var infowindow = new google.maps.InfoWindow({
			content: compiled[0]
		});

		google.maps.event.addListener(myselfMarker, 'click', function() {
			infowindow.open(map,myselfMarker);
		});
		*/
	}

	var rad = function(x){
		return x * Math.PI / 180;
	};

	var getDistance = function(p1, p2) {
		var R = 6378137; // Earth’s mean radius in meter
		var dLat = rad(p2.lat() - p1.lat());
		var dLong = rad(p2.lng() - p1.lng());
		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
		Math.sin(dLong / 2) * Math.sin(dLong / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = R * c;
		return ~~d; // returns the distance in meter /// ~~ -> transforma o float no inteiro mais próximo
	};

});
