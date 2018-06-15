class WorldGrid {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;

        this.blockType = Object.freeze({
            ROOF: 1,
            BLOCK: 0,
            EMPTY: -1
        });

        this.styleType = Object.freeze({
            NE: 0,
            SE: 1,
            SW: 2,
            NW: 3
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
        if(this.grid[x][y+1][z] == 0) {
            return this.blockType.ROOF;
        }
        else {
            return this.blockType.BLOCK;
        }
    }

    getStyleType(x, y, z) {

    }
}