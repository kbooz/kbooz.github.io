//Forked from
//http://codepen.io/ionic/pen/uzngt
var debug = {};
debug.myself={};
angular.module('ionic.example', ['ionic'])

.controller('MapCtrl', function($scope, $ionicLoading, $compile) {
	$scope.bizz = {};
	$scope.myself = {};
	$scope.bizz.markers = [];
	$scope.view = {}; //Debug visual
	$scope.myself.Latlng = new google.maps.LatLng(-22.962868,-43.170048);
	$scope.bizz.radius = 50;
	$scope.myself.radius = 80;

	google.maps.event.addDomListener(window, 'load', initializeMap);

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
		return checkDistance($scope.bizz.markers[i],$scope.myself.marker).toString()
	}

	function initializeMap()
	{

		// Opções do Mapa
		var mapOptions = {
			center: $scope.myself.Latlng,
			zoom: 16,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			mapTypeControl:false,
			streetViewControl: false
		};

		// Cria o Mapa
		var map = new google.maps.Map(document.getElementById("map"),
			mapOptions);

		// Define o mapa no escopo
		$scope.map = map;

		createMyself();

		createMarkers();

		$scope.$apply();
	}

	var createMyself = function()
	{
		// Cria o Marcador de Posição para o Debug
		var marker = new google.maps.Marker({
			position: $scope.myself.Latlng,
			map: $scope.map,
			label: '☺',
			title: 'Eu'
		});

		// Coloca o Marcador no mapa
		$scope.myself.marker = marker;
		debug.myself.marker = marker;

		$scope.myself.marker.circle = createCircle('#0000FF',$scope.map,$scope.myself.Latlng,$scope.myself.radius);
		debug.myself.circle = $scope.myself.marker.circle;

		//Atualiza o Debug
		$scope.view.lugar = $scope.map.getCenter().lat() +","+$scope.map.getCenter().lng();

		// Aciona a função toda vez que o centro do mapa se alterar
		google.maps.event.addDomListener($scope.map, 'center_changed', dragMyself);
		google.maps.event.addDomListener($scope.map, 'drag', dragMyself);
	}

	var dragMyself = function(){
		var center_ = $scope.map.getCenter();
		$scope.myself.marker.setPosition(center_);
		$scope.view.lugar = center_.lat() + "," + center_.lng();
		$scope.myself.marker.circle.setCenter(center_);
		// Atualiza a view
		$scope.$apply();
	}


	var createMarkers = function ()
	{
		//Lugares pré definidos
		var places = getBizz();

		for (var i = 0; i <places.length; i++) {
			$scope.bizz.markers[i] = new google.maps.Marker({
				position: new google.maps.LatLng(places[i][0],places[i][1]),
				map: $scope.map
			});
			$scope.bizz.markers[i].enabled = true;
		}
		var infowindow = new google.maps.InfoWindow({content: "creating..."});

		for (var i = 0; i <$scope.bizz.markers.length; i++) {
			var contentString = "<div>Distância em metros:<br><span ng-bind='distance("+i+")'></span></div>";
			var compiled = $compile(contentString)($scope);

			//Create infowindow
			google.maps.event.addListener($scope.bizz.markers[i], 'click', (createInfoWindow)($scope.map,$scope.bizz.markers[i],compiled[0],infowindow));

			//Create circle
			var circle = createCircle('#00FF00',$scope.map,$scope.bizz.markers[i].position,$scope.bizz.radius);

			$scope.bizz.markers[i].circle = circle;
		}
	}

	var updateMarker = function (marker)
	{
		marker.set('label','x');
		marker.enabled = false;
		marker.circle.setOptions({strokeColor:'red',fillColor:'red'});
	}

	$scope.updateBizzRadius = function ()
	{
		for (var i = $scope.bizz.markers.length - 1; i >= 0; i--) {
			$scope.bizz.markers[i].circle.set('radius',parseInt(document.getElementById('bizz-radius').value));
		}
	}
	$scope.updateMyselfRadius = function ()
	{
			$scope.myself.marker.circle.set('radius',parseInt(document.getElementById('myself-radius').value));
	}

	var getBizz = function(){
		// Demo
		return [[-22.964357,-43.177534],[-22.963381,-43.172658],[-22.963253,-43.17494],[-22.966842,-43.171528],[-22.965439,-43.172273],[-22.968099,-43.172221],[-22.969836,-43.177189],[-22.967079,-43.173814],[-22.965786,-43.173986],[-22.961722,-43.173604],[-22.967147,-43.171253],[-22.969799,-43.177486],[-22.96523,-43.173245],[-22.967918,-43.174884],[-22.967695,-43.178544],[-22.967877,-43.172252]];
	}

	var createInfoWindow = function(map,marker,content,infowindow)
	{ 
		return function() {
			infowindow.setContent(content);
			infowindow.open(map,marker);
		};
	};

	var rad = function(x){
		return x * Math.PI / 180;
	};

	var checkDistance = function(m1, m2)
	{
		var p1 = m1.position;
		var p2 = m2.position;
		var R = 6378137; // Earth’s mean radius in meter
		var dLat = rad(p2.lat() - p1.lat());
		var dLong = rad(p2.lng() - p1.lng());
		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + 		Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = R * c;
		d= ~~ d;  /// ~~ -> transforma o float no inteiro mais próximo

		//Checa se há overlap dos radius
		if((d<($scope.bizz.radius+$scope.myself.radius)) && m1.enabled)
		{
			updateMarker(m1);
		}

		return ~~d; // returns the distance in meter
	};

	var createCircle = function (color,map,center,radius)
	{
		return new google.maps.Circle({
			strokeColor: color,
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: color,
			fillOpacity: 0.35,
			map: map,
			center: center,
			radius: radius
		});
	};

});