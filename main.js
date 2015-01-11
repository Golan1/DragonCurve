app = angular.module('app', []);

app.controller('mainCtrl', function ($scope, $window, $timeout) {
    $scope.slowmo = true;
    $scope.dragons = [];
    $scope.lineLen = 1;
    $scope.reduceLen = 1;
    $scope.dragonSeparation = 0;

    var renderer, scene, camera, controls;

    $window.addEventListener('resize', function () {
        var width = window.innerWidth;
        var height = window.innerHeight - 180;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);

    }, false);


    $scope.$watch('dragonSeparation', function (newVal) {
        $scope.dragons.forEach(function (d) {
            d.graphics.updateSeparation(newVal)
        });
    });

    $scope.reset = function () {
        $scope.dragonSeparation = 0;
        $scope.lineLen = 1;
        scene = new THREE.Scene();
        controls.reset();
        initDragons();
    };


    $scope.nextLevel = function () {
        $scope.dragons
            .filter(function (d) {
                return d.active
            })
            .forEach(function (d) {
                d.graphics.nextLevel()
            });

        $scope.lineLen /= $scope.reduceLen;

    };

    init();

    function init() {
        var width = window.innerWidth;
        var height = window.innerHeight - 180;

        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(width, height);

        document.getElementById('canvas').appendChild(renderer.domElement);

        camera = new THREE.PerspectiveCamera(45, width / height, 1, 5000);

        camera.position.set(0, 0, 100);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        controls = new THREE.TrackballControls(camera, renderer.domElement);
        controls.minDistance = 2;
        controls.maxDistance = 2000;

        scene = new THREE.Scene();

        animate();

        //in this case we can position the starting point in a different location, not sure why
        $timeout(initDragons);
    }

    function initDragons() {
        $scope.dragons = [];
        for (var i = 0; i < 4; i++) {
            var d = new Dragon(i, Math.random() * 0xFFFFFFFF, i, $scope.lineLen);
            $scope.dragons.push({active: true, graphics: d});
            scene.add(d.lines);
        }

//        var g = new THREE.Geometry();
//        g.vertices.push(new THREE.Vector3(0, 0, 0));
//        g.vertices.push(new THREE.Vector3(0, 0, 10));
//
//        scene.add(new THREE.Line(g, new THREE.LineBasicMaterial({color: 0xFFFFFFFF})))
    }

    function animate() {
        requestAnimationFrame(animate);

        controls.update();
        render();
    }


    function render() {
        $scope.dragons.forEach(function (dragon) {
            dragon.graphics.calcGeometry(!$scope.slowmo, $scope.lineLen);
        });
        renderer.render(scene, camera);
    }
});