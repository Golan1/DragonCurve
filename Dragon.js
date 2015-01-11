var directions = {
    0: [0, 1],
    1: [1, 0],
    2: [0, -1],
    3: [-1, 0]
};

function Dragon(firstDir, color, d, lineLen) {
    this.curves = [];

    this.dragonNumber = d;
    this.dir = firstDir;
    this.material = new THREE.LineBasicMaterial({color: color});

    this.x = 0;
    this.y = 0;
    this.index = -1;

    this.lines = new THREE.Object3D();


    this.vertices = [];
    this.vertices.push(new THREE.Vector3(this.x, this.y, 0));

    this.step(lineLen);
    this.calcGeometry(false, lineLen, true);
//    this.lines.position.set(0, 0, 5);
}

Dragon.maxLength = Math.pow(2,16) - 1;

Dragon.prototype.updateSeparation = function (separateLen) {
    this.lines.position.set(0, 0, separateLen * this.dragonNumber);
}

Dragon.prototype.calcGeometry = function (all, lineLen, forceRender) {
    var isRenderNeeded = forceRender;
    if (all) {
        while (!this.isLevelCompleted()) {
            this.dir = (this.dir + this.curves[this.index] + 4) % 4;
            this.step(lineLen);
            isRenderNeeded = true;
        }
    }
    else if (!this.isLevelCompleted()) {
        this.dir = (this.dir + this.curves[this.index] + 4) % 4;
        this.step(lineLen);
        isRenderNeeded = true;
    }

    if (isRenderNeeded) {
        var geometry = new THREE.Geometry();
        geometry.vertices = this.vertices;

        this.lines.children = [];
        this.lines.add(new THREE.Line(geometry, this.material));
    }
}

Dragon.prototype.step = function (lineLen) {
    this.x += directions[this.dir][0] * lineLen;
    this.y += directions[this.dir][1] * lineLen;

    this.vertices.push(new THREE.Vector3(this.x, this.y, 0));

    this.index++;
}

Dragon.prototype.isLevelCompleted = function () {
    return this.index === this.curves.length;
}

Dragon.prototype.nextLevel = function () {
    if (this.curves.length < Dragon.maxLength) {
        var newCurves = [];
        var i = 0;
        for (; i < this.curves.length; i++) {
            newCurves.push((parseInt(i % 2) * 2) - 1);
            newCurves.push(this.curves[i]);
        }
        newCurves.push((parseInt(i % 2) * 2) - 1);
        this.curves = newCurves;
    }
}