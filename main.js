app = angular.module('app', []);

app.controller('mainCtrl', function ($scope, $window, $timeout) {
    $scope.slowmo = true;
    $scope.dragons = [];
    $scope.lineLen = 1;
    $scope.reduceLen = 1;
    $scope.dragonSeparation = 0;
    $scope.numDragons = 4;

    var z;
    var y;

    var renderer, scene, camera, controls;

    $window.addEventListener('resize', function () {
        var width = window.innerWidth;
        var height = window.innerHeight - 180;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);

    }, false);


    $scope.$watch('dragonSeparation', function (newVal) {
        updateSeperation(newVal);
    });

    function updateSeperation(val) {
        $scope.dragons.forEach(function (d) {
            d.graphics.updateSeparation(val)
        });
    }

    $scope.reset = function () {
        reset();
        initDragons();
    };

    function reset() {
        $scope.dragonSeparation = 0;
        $scope.lineLen = 1;
        scene = new THREE.Scene();
        controls.reset();
    }


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

    $scope.learnMode = function () {
        z = 500;
        y = 0;
        $scope.numDragons = 15;
        reset();

        $scope.slowmo = false;
        $scope.lineLen = 1;
        $scope.reduceLen = 1;
        $scope.dragonSeparation = 20;

        $scope.dragons = [];
        for (var i = 0; i < $scope.numDragons; i++) {
            addNewDragon(i, 0, true);
            $scope.nextLevel();
        }

        updateSeperation($scope.dragonSeparation);

        disableControls();
        moveLearnMode();
    }

    //TODO: move to the controler
    function disableControls() {
        controls.noRotate = true;
        controls.noZoom = true;
        controls.noPan = true;
        controls.noRoll = true;
    }

    function enableControls() {
        controls.noRotate = false;
        controls.noZoom = false;
        controls.noPan = false;
        controls.noRoll = false;
    }

    //TODO: run on animate not with $timeout!
    function moveLearnMode() {
        //TODO: find the right way
        camera.position.set(0, y, z);
        //TODO: use zoom function instead?
        z--;
        //TODO: use exponential function to calculate y and z
        y -= Math.pow(2, y / 10);
        if (z > 0) {
            $timeout(moveLearnMode, 10);
        }
        else {
            camera.position.set(0, 0, 500);
            enableControls();
        }

    }

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
        for (var i = 0; i < $scope.numDragons; i++) {
            addNewDragon(i, i % 4, true);
        }

//        var g = new THREE.Geometry();
//        g.vertices.push(new THREE.Vector3(0, 0, 0));
//        g.vertices.push(new THREE.Vector3(0, 0, 10));
//
//        scene.add(new THREE.Line(g, new THREE.LineBasicMaterial({color: 0xFFFFFFFF})))
    }

    function addNewDragon(index, direction, active) {
        var d = new Dragon(direction, Math.random() * 0xFFFFFFFF, index, $scope.lineLen);
        $scope.dragons.push({active: active, graphics: d});
        scene.add(d.lines);
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