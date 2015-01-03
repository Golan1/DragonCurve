var renderer, scene, camera;

var isSlowDrawing = false;

var dragons = [];

var lineLen = 0.1;

var directions = {
    0: [0, 1],
    1: [1, 0],
    2: [0, -1],
    3: [-1, 0]
};

document.addEventListener("DOMContentLoaded", function () {
    window.addEventListener( 'resize', onWindowResize, false );

    var width = window.innerWidth;
    var height = window.innerHeight;

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);

    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(45, width / height, 1, 500);

    camera.position.set(0, 0, 100);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    for (var i = 0; i < 4; i++) {
        var d = new Dragon(i, Math.random() * 0xFFFFFFFF);
        dragons.push(d);
    }

    if (isSlowDrawing) {
        scene = new THREE.Scene();
        dragons.forEach(function (dragon) {
            scene.add(new THREE.Line(dragon.getGeometry(false), dragon.material));
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
                scene.add(new THREE.Line(dragon.getGeometry(false), dragon.material));
            });
        }
    }
    else {
        scene = new THREE.Scene();
        dragons.forEach(function (dragon) {
            scene.add(new THREE.Line(dragon.getGeometry(true), dragon.material));
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

Dragon.prototype.getGeometry = function (all) {

    var coor = {x:this.vertices[this.vertices.length - 1].x,
    y: this.vertices[this.vertices.length - 1].y}

    if (all){
        while (!this.isLevelCompleted()) {
            this.step(coor);
        }
    }
    else {
        if (!this.isLevelCompleted()) {
            this.step(coor);
        }
    }

    var geometry = new THREE.Geometry();
    geometry.vertices = this.vertices;
    return geometry;
}

Dragon.prototype.step = function (coor) {
    this.dir = (this.dir + this.curves[this.index] + 4) % 4;

    coor['x'] += directions[this.dir][0] * lineLen;
    coor['y'] += directions[this.dir][1] * lineLen;

    this.vertices.push(new THREE.Vector3(coor['x'], coor['y'], 0));

    this.index++;
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

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.render(scene, camera);

}