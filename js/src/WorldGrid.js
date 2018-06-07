class WorldGrid {
    constructor(x, y, z) { 
        this.x = x;
        this.y = y;
        this.z = z;

        this.grid = new Array();        
        this.initGrid();        
    }

    initGrid() {
        for(var x = 0; x < this.x; ++x) {
            this.grid[x] = new Array();
            for(var y = 0; y < this.y; ++y) {
                this.grid[x][y] = new Array();
                for(var z = 0; z < this.z; ++z)
                {
                    this.grid[x][y][z] = Math.round(Math.random());                    
                }
            }
        }      
    }
}