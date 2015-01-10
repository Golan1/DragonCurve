app = angular.module('app', []);

app.controller('mainCtrl', function($scope, $window){
    $scope.slowmo = true;
    $scope.dragons = [];
    $scope.lineLen = 5;
    $scope.reduceLen = 1;
    $scope.dragonSeparation = 0;

    var renderer, scene, camera, controls;

    $window.addEventListener('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

    }, false);
    init();

    $scope.$watch('dragonSeparation', function(newVal){
        $scope.dragons.forEach(function(d){d.graphics.updateSeparation(newVal)});
    });

    $scope.reset = function(){
        scene = new THREE.Scene();
        controls.reset();
        initDragons();
    };


    $scope.nextLevel = function() {
        $scope.dragons
            .filter(function(d){return d.active})
            .forEach(function(d){d.graphics.nextLevel()});

        $scope.lineLen /= $scope.reduceLen;

    }


    function init () {
        var width = window.innerWidth;
        var height = window.innerHeight;

        renderer = new THREE.WebGLRenderer({antialias: true });
        renderer.setSize(width, height);

        document.body.appendChild(renderer.domElement);

        camera = new THREE.PerspectiveCamera(45, width / height, 1, 500);

        camera.position.set(0, 0, 100);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        controls = new THREE.TrackballControls(camera, renderer.domElement);
        controls.minDistance = 200;
        controls.maxDistance = 500;

        scene = new THREE.Scene();

//        var g = new THREE.Geometry();
//        g.vertices.push(new THREE.Vector3(0,0,0));
//        g.vertices.push(new THREE.Vector3(0,0,10));
//
//        scene.add(new THREE.Line(g, new THREE.LineBasicMaterial({color: 0xFFFFFFFF})))

        initDragons();
        animate();
    }

    function initDragons() {
        $scope.dragons = [];
        for (var i = 0; i < 4; i++) {
            var d = new Dragon(i, Math.random() * 0xFFFFFFFF, i, $scope.lineLen);
            $scope.dragons.push({active: true, graphics: d});
            scene.add(d.lines);
        }

        //onSeparationChange();
    }

    function animate() {
        requestAnimationFrame(animate);

        controls.update();
        render();
    }


    function render() {
        $scope.dragons.forEach(function(dragon){
            dragon.graphics.calcGeometry(!$scope.slowmo, $scope.lineLen);
        });
        renderer.render(scene, camera);
    }
});








