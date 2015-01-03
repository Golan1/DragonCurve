function Dragon(firstDir, color, d) {
    this.curves = [];
    this.dragonNumber = d;
    this.dir = firstDir;
    this.material = new THREE.LineBasicMaterial({color: color});
    this.vertices = [];
    this.addVertice(0,0);
    this.addVertice(directions[this.dir][0] * lineLen, directions[this.dir][1] * lineLen);
    this.index = 0;
}

Dragon.prototype.updateSeparation = function(z){
    var self = this;
    this.vertices.forEach(function(v){
        v.z = self.dragonNumber * z;
    });
}

Dragon.prototype.addVertice = function(x,y){
    this.vertices.push(new THREE.Vector3(x,y,this.dragonNumber * dragonSeparation));
}
Dragon.prototype.getGeometry = function (all) {

    var coor = {x: this.vertices[this.vertices.length - 1].x,
        y: this.vertices[this.vertices.length - 1].y}

    if (all) {
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


    this.addVertice(coor['x'], coor['y']);

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

