class WorldGrid {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;

        this.blockType = Object.freeze({
            FLAT: 0, // 4 neighbors
            TRIPLE: 1, // 3 neighbors
            CORNER: 2, // 2 neighbors, corner
            LINE: 3, // 2 neighbors, line
            ONE: 4, // 1 neighbor
            SOLO: 5, // 0 neighbors
            EMPTY: -1
        });

        this.styleType = Object.freeze({
            NORMAL: 0,
            FAT: 1 // Block on top
        });

        this.grid = new Array();
        this.types = new Array();
        this.initGrid();
    }

    initGrid() {
        var heightData = this.generateCliffs();
        for(var x = 0; x < this.x; ++x) {
            this.grid[x] = new Array();
            this.types[x] = new Array();
            for(var y = 0; y < this.y; ++y) {
                this.grid[x][y] = new Array();
                this.types[x][y] = new Array();
                for(var z = 0; z < this.z; ++z) {
                    this.grid[x][y][z] = heightData[y][x][z];
                }
            }
        }
    }

    getBlockType(x, y, z) {
        var type = this.blockType.EMPTY;
        var style = this.styleType.NORMAL;
        var neighbors = 0; // The number of adjacent neighbors
        var rotation = 0;
        var n = false, s = false, e = false, w = false; // Used to calculate orientation
        // Calculate the value of n
        if(x+1 < this.x) { // +x neighbors
            if(this.grid[x+1][y][z] == 1) {
                neighbors++;
                e = true;
            }
        }
        if(x-1 >= 0) {
            if(this.grid[x-1][y][z] == 1) {
                neighbors++;
                w = true;
            }
        }
        if(z+1 < this.z) { // +x neighbors
            if(this.grid[x][y][z+1] == 1) {
                neighbors++;
                n = true;
            }
        }
        if(z-1 >= 0) {
            if(this.grid[x][y][z-1] == 1) {
                neighbors++;
                s = true;
            }
        }
        // Determine what type of block this is
        if(neighbors == 0 || neighbors == 1) {
            type = this.blockType.FLAT; // TODO: MAKE THIS SOLO
        }
        else if(neighbors == 2) {
            type = this.blockType.CORNER;
            if(n && e) {
                rotation = Math.PI/2;
            }
            else if(s && e) {
                rotation = Math.PI;
            }
            else if(s && w) {
                rotation = 3*Math.PI/2;
            }
            else if(n && w) {
                rotation = 0;
            }
            else {
                type = this.blockType.FLAT;
            }
        }
        else if(neighbors == 3) {
            if(Math.round(Math.random()) == 1) {
                type = this.blockType.TRIPLE; // TRIPLE
            }
            else {
                type = this.blockType.FLAT;
            }
            if(!n) {
                rotation = 3*Math.PI/2;
            }
            else if(!e) {
                rotation = 0;
            }
            else if(!s) {
                rotation = Math.PI/2;
            }
            else {
                rotation = Math.PI;
            }
        }
        else {
            type = this.blockType.FLAT;
        }
        // Determine what style of block this is
        if(y < this.y - 1) {
            if(this.grid[x][y+1][z] == 0) {
                style = this.styleType.NORMAL; // ROOF
            }
            else if(this.grid[x][y+1][z] == 1) {
                style = this.styleType.FAT;
            }
            else {
                style = this.styleType.NORMAL;
            }
        }
        else {
            style = this.styleType.NORMAL; // ROOF
        }

        var tile = {
            'type': type,
            'style': style,
            'rot': rotation
        };
        return tile;
    }

    random(x, y) {
        var n = new THREE.Vector2(x,y);
        var dummy = new THREE.Vector2(12.9898, 4.1414);
        var dot = n.dot(dummy);
        return Math.floor(Math.sin(dot) * 43758.5453);
    }

    noise(x, y) {
        var nums = new THREE.Vector2(Math.floor(x), Math.floor(y)).multiplyScalar(100);
        var decs = new THREE.Vector2(x - Math.floor(x), y - Math.floor(y));

        var a = this.random(nums.x, nums.y);
        var b = this.random(nums.x + 1, nums.y);
        var c = this.random(nums.x, nums.y + 1);
        var d = this.random(nums.x + 1, nums.y + 1);

        var v = new THREE.Vector2(3.0 - 2.0 * decs.x, 3.0 - decs.multiplyScalar(2));
        var u = (decs.multiply(decs)).multiply(v);

        return (a*(1.0-u.x)+b*u.x + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y);
    }

    fbm(x, y) {
        var val = 0.0;
        var amp = .2;
        var octaves = 20;

        for(var i = 0; i < octaves; i++) {
            val += amp * this.noise(120 * x, 120 * y);
            x *= .5;
            y *= .5;
            amp *= 0.5;
        }
        console.log(val);
        return (val / 10000 + 1) / 3;
    }

    generateCliffs() {
        var iter = Math.round(Math.random() * this.y); // Random int [0, this.y]
        var ret = new Array();
        var dummy = new Array(); // Used for first iteration
        // Initialize 3D arrays
        for(var x = 0; x < this.x; x++) {
            ret[x] = new Array();
            dummy[x] = new Array();
            for(var y = 0; y < this.y; y++) {
                ret[x][y] = new Array();
                dummy[x][y] = 1;
                for(var z = 0; z < this.z; z++) {
                    ret[x][y][z] = 0;
                }
            }
        }
        // For {iter} iterations, generate a rock shape, and mask it with the previous layer
        for(var i = 0; i < iter; i++) {
            if(i == 0) {
                ret[i] = this.generateLayer(dummy);
            }
            else {
                ret[i] = this.generateLayer(ret[i-1]);
            }
        }
        return ret;
    }

    generateLayer(prevLayer) {
        var n = 3; // Number of times to place a random-sized cluster
        var layer = new Array();
        // Initialize {layer}
        for(var x = 0; x < this.x; x++) {
            layer[x] = new Array();
            for(var z = 0; z < this.z; z++) {
                layer[x][z] = 0;
            }
        }
        // Place a random-sized cluster on this layer n times
        for(var i = 0; i < n; i++) {
            var size = Math.round(Math.random() * 2) + 2; // Random int [2,5]
            // x- and z-origin of the cluster
            var xstart = Math.round(Math.random() * this.x) - Math.round(size/2);
            var zstart = Math.round(Math.random() * this.z) - Math.round(size/2);
            // Clip mask the cluster to the world size, and then to {prevLayer}
            for(var x = Math.round(-size/2); x < Math.round(size/2); x++) {
                for(var z = 0; z < size; z++) {
                    var boundsX = Math.max(Math.min(x + xstart, this.x - 1), 0);
                    var boundsZ = Math.max(Math.min(z + zstart, this.z - 1), 0);
                    if(prevLayer[boundsX][boundsZ] == 1) {
                        layer[boundsX][boundsZ] = 1;
                    }
                }
            }
        }
        return layer;
    }
}
