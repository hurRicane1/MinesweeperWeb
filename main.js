function Cell() {
    this.isBomb = false;
    this.bombsAround =0;
    this.isOpen = false;
}

var minesweeper= {
    width: 9,
    height: 9,
    bombsCount: 10,
    openCount: 0,
    field: [],
    generateField:function() {
        this.field =[];
        for(var y = 0; y < this.height; y++) {
            var temp=[];
            for (var x = 0; x < this.width; x++) {
                temp.push(new Cell());
            }
            this.field.push(temp);
        }
        for (var i = 0; i<this.bombsCount;) {
            var yR = Math.floor(Math.random()*this.height);
            var xR = Math.floor(Math.random()*this.width);
            if (!(this.field[xR][yR].isBomb)) {
                this.field[xR][yR].isBomb = true;
                i++;
            }
        }
    },
    findBombsAround:function(xF,yF){
        var counter = 0;
        for (var y = yF-1; y <= yF+1; y++){
            for (var x = xF-1; x <= xF+1; x++) {
                if (x >= 0 && x < this.width && y >= 0 && y <this.height) {
                    if (this.field[x][y].isBomb && !(yF==y && xF==x)) {
                        counter++;
                    }
                }
            }
        }
        this.field[xF][yF].bombsAround = counter;
    },
    setBombsAroundToCells:function(){
        for(var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                this.findBombsAround(x,y);
            }
        }
    },
    gameBegin:function() {
        this.generateField();
        this.setBombsAroundToCells();
    }
}
var board={
    init:function(){
        this.interface.init();
        
    },
    interface:{
        table:null,
        init:function() {
            minesweeper.gameBegin();
            this.div = document.querySelector(".board");
            this.createField();
            var self = this;
            this.div.addEventListener("click", function(e){
                if (e.target.matches("td") && !(e.target.matches(".flag"))) self.cellClick(e);
            })
            this.div.addEventListener("contextmenu", function(e){
                if (e.target.matches("td")) self.putFlag(e);
            })
        },
        createField:function() {
            //this.div.innerHTML = "";
            var gameField = document.createElement("table");
            this.table = gameField;
            for (var y = 0; y < minesweeper.height; y++) {
                var row = document.createElement("tr");
                for (var x = 0; x < minesweeper.width; x++) {
                    var cell = document.createElement("td");
                    row.appendChild(cell);
                }
                gameField.appendChild(row);
            }
            this.div.appendChild(gameField);
        },
        cellClick:function(e){
            var xC = e.target.cellIndex;
            var yC = e.target.parentNode.rowIndex;
            this.openAround(xC,yC)
        },
        openAround:function(xC,yC){
            var cell = this.table.rows[yC].children[xC];
            if (minesweeper.field[xC][yC].isOpen) return;
            if (minesweeper.field[xC][yC].isBomb){
                for(var yN = 0; yN < minesweeper.height; yN++) {
                    for (var xN = 0; xN < minesweeper.width; xN++) {
                        if (minesweeper.field[xN][yN].isBomb){
                            var bomb = this.table.rows[yN].children[xN];
                            bomb.classList.add("bomb");
                        }
                    }
                }
                setTimeout(function(){
                    alert("Game over. You lost!");
                    location.reload();
                }, 1000);
                
            }else{
                if (minesweeper.field[xC][yC].bombsAround != 0){
                cell.innerHTML = minesweeper.field[xC][yC].bombsAround; 
                }
                minesweeper.field[xC][yC].isOpen = true;
                if(minesweeper.field[xC][yC].bombsAround==0){
                     for (var y = yC-1; y <= yC+1; y++){
                        for (var x = xC-1; x <= xC+1; x++) {
                            if (x >= 0 && x < minesweeper.width && y >= 0 && y <minesweeper.height) {
                                this.openAround(x,y);
                            }
                        }
                    }
                }
            }
            cell.classList.add("open");
            minesweeper.field[xC][yC].isOpen = true;
            minesweeper.openCount++;
            if (minesweeper.width*minesweeper.height - minesweeper.bombsCount == minesweeper.openCount){
                setTimeout(function(){
                    alert("Game over. You won!! Congratulations!!!");
                    location.reload();
                }, 1000);
            }
        },
        putFlag:function(e){
            var xC = e.target.cellIndex;
            var yC = e.target.parentNode.rowIndex;
            if (minesweeper.field[xC][yC].isOpen) return;
            e.target.classList.toggle("flag");
            e.preventDefault();
        }
    }
}
window.onload = function() {
    board.init();
    console.log(minesweeper.field);
}

