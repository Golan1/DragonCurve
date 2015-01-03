function Dragon(firstDir, color, d) {
    this.curves = [];
    this.dragonNumber = d;
    this.dir = firstDir;
    this.x = 0;
    this.y = 0;
    this.material = new THREE.LineBasicMaterial({color: color});
    this.index = -1;
    this.lines = new THREE.Object3D();
    this.vertices = [];
    this.vertices.push(new THREE.Vector3(this.x, this.y, 0));
    this.step();
    this.lines.position.set(0, 0, 0);
    this.calcGeometry(false);
}

Dragon.prototype.updateSeparation = function(seperateLen){
    this.lines.position.set(0,0,seperateLen * this.dragonNumber);
}

Dragon.prototype.calcGeometry = function (all) {
    var geometry = new THREE.Geometry();


    if (all) {
        while (!this.isLevelCompleted()) {
            this.dir = (this.dir + this.curves[this.index] + 4) % 4;
            this.step();
        }
    }
    else if (!this.isLevelCompleted()) {
        this.dir = (this.dir + this.curves[this.index] + 4) % 4;
        this.step();
    }

    geometry.vertices = this.vertices;

    this.lines.children = [];
    this.lines.children.push(new THREE.Line(geometry, this.material));

}

Dragon.prototype.step = function () {
    this.x += directions[this.dir][0] * lineLen;
    this.y += directions[this.dir][1] * lineLen;

    this.vertices.push(new THREE.Vector3(this.x, this.y, 0));

    this.index++;
}

Dragon.prototype.isLevelCompleted = function () {
    return this.index === this.curves.length;
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