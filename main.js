var renderer, scene, camera, controls;

var isSlowDrawing = true;

var dragons = [];

var lineLen = 5;
var reduceLen = 1;
var dragonSeparation = 0;

var directions = {
    0: [0, 1],
    1: [1, 0],
    2: [0, -1],
    3: [-1, 0]
};

window.addEventListener('resize', onWindowResize, false);

document.addEventListener("DOMContentLoaded", function () {

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

    init();
    animate();
});

function init() {
    for (var i = 0; i < 4; i++) {
        var d = new Dragon(i, Math.random() * 0xFFFFFFFF, i);
        dragons.push(d);
        scene.add(d.lines);
    }

    onSeparationChange();
}

function render() {
    dragons.forEach(function(dragon){
        dragon.calcGeometry(!isSlowDrawing);
    });
    renderer.render(scene, camera);
}

function nextLevel() {
    for (var i = 0; i < 4; i++) {
        if (document.getElementById(i).checked) {
            dragons[i].nextLevel();
        }
    }

    lineLen = lineLen / reduceLen;
    document.getElementById('lineLen').value = lineLen;

}

function animate() {
    requestAnimationFrame(animate);

    controls.update();
    render();
}

function slowmoChanged() {
    isSlowDrawing = document.getElementById('slowmo').checked;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function reset() {
    dragons = [];
    scene = new THREE.Scene();
    controls.reset();
    init();
}

function onLineLengthChanged() {
    lineLen = parseFloat(document.getElementById('lineLen').value);
}

function onReduceLengthChanged() {
    reduceLen = parseFloat(document.getElementById('reduceLen').value);
}

function onSeparationChange(){
    dragonSeparation = parseFloat(document.getElementById('dragonSeparation').value);
    dragons.forEach(function(dragon){
        dragon.updateSeparation(dragonSeparation);
    })
}