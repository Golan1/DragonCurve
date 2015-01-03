var renderer, scene, camera;

var isSlowDrawing = false;

var dragons = [];

var lineLen = 1;

var directions = {
    0: [0, 1],
    1: [1, 0],
    2: [0, -1],
    3: [-1, 0]
};

document.addEventListener("DOMContentLoaded", function () {

    var width = window.innerWidth;
    var height = window.innerHeight;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);

    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(45, width / height, 1, 500);

    camera.position.set(0, 0, 100);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    for (var i = 0; i < 1; i++) {
        var d = new Dragon(i, Math.random() * 0xFFFFFFFF);
        dragons.push(d);
    }

    if (isSlowDrawing) {
        scene = new THREE.Scene();
        dragons.forEach(function (dragon) {
            scene.add(new THREE.Line(dragon.getGeometry(), dragon.material));
        });
    }

    animate();

});

function render(dragons) {

    if (isSlowDrawing) {
        var allDragonsCompleted = dragons.map(function (dragon) {
            return dragon.isLevelCompleted();
        }).reduce(function (completed, me) {
            return completed && me;
        });

        if (!allDragonsCompleted) {
            scene = new THREE.Scene();
            dragons.forEach(function (dragon) {
                scene.add(new THREE.Line(dragon.getGeometry(), dragon.material));
            });
        }
    }
    else {
        scene = new THREE.Scene();
        dragons.forEach(function (dragon) {
            scene.add(new THREE.Line(dragon.getAllGeometry(), dragon.material));
        });
    }

    renderer.render(scene, camera);
}

function nextCurves() {
    dragons.forEach(function (dragon) {
        dragon.nextLevel();
    });
    animate();
    //lineLen = lineLen / 1.3;
}

function Dragon(firstDir, color) {
    this.curves = [];
    this.dir = firstDir;
    this.material = new THREE.LineBasicMaterial({color: color});
    this.vertices = [];
    this.vertices.push(new THREE.Vector3(0, 0, 0));
    this.vertices.push(new THREE.Vector3(directions[this.dir][0] * lineLen, directions[this.dir][1] * lineLen, 0));
    this.index = 0;
}

Dragon.prototype.getAllGeometry = function () {

    var X = this.vertices[this.vertices.length - 1].x;
    var Y = this.vertices[this.vertices.length - 1].y;

    for (; this.index < this.curves.length && this.curves.length; this.index++) {

        this.dir = (this.dir + this.curves[this.index] + 4) % 4;

        X += directions[this.dir][0] * lineLen;
        Y += directions[this.dir][1] * lineLen;

        this.vertices.push(new THREE.Vector3(X, Y, 0));
    }

    var geometry = new THREE.Geometry();
    geometry.vertices = this.vertices;
    return geometry;
}

Dragon.prototype.getGeometry = function () {

    var X = this.vertices[this.vertices.length - 1].x;
    var Y = this.vertices[this.vertices.length - 1].y;

    if (!this.isLevelCompleted()) {

        this.dir = (this.dir + this.curves[this.index] + 4) % 4;

        X += directions[this.dir][0] * lineLen;
        Y += directions[this.dir][1] * lineLen;

        this.vertices.push(new THREE.Vector3(X, Y, 0));

        this.index++;
    }

    var geometry = new THREE.Geometry();
    geometry.vertices = this.vertices;
    return geometry;
}

Dragon.prototype.isLevelCompleted = function () {
    return this.index == this.curves.length;
}

Dragon.prototype.nextLevel = function () {
    var newCurves = [];
    var i = 0;
    for (; i < this.curves.length; i++) {
        newCurves.push((parseInt(i % 2) * 2) - 1);
        newCurves.push(this.curves[i]);
    }
    newCurves.push((parseInt(i % 2) * 2) - 1);
    this.curves = newCurves;
}

function animate() {
    if (isSlowDrawing) {
        requestAnimationFrame(animate);
    }

    render(dragons);
}

function slowmoChanged(){
    isSlowDrawing =  document.getElementById('slowmo').checked;
}