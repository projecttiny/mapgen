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
        for(var x = 0; x < this.x; ++x) {
            this.grid[x] = new Array();
            this.types[x] = new Array();
            for(var y = 0; y < this.y; ++y) {
                this.grid[x][y] = new Array();
                this.types[x][y] = new Array();
                for(var z = 0; z < this.z; ++z)
                {
                    this.grid[x][y][z] = 0;
                    this.types[x][y][z] = this.blockType.EMPTY;
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
            type = this.blockType.TRIPLE;
            if(!n) {
                rotation = 3*Math.PI/2;
            }
            else if(!e) {
                rotation = 0;
            }
            else if(!w) {
                rotation = Math.PI;
            }
            else {
                rotation = Math.PI/2;
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

    getStyleType(x, y, z) {

    }
}