'use strict'
{
  const field_vertical = 21  //縦
  const field_beside = 12 //横
  const block_size = 30
  const canvas_vertical = field_vertical * block_size
  const canvas_beside = field_beside * block_size
  const tetro_size = 4
    
  let canvasId = document.getElementById('canvasId')
  let conText = canvasId.getContext('2d')
  canvasId.width = canvas_beside
  canvasId.height = canvas_vertical
  canvasId.style.border = '4px solid #555'
    
  const drawBlock = (x,y,) => {
    let px = x * block_size
    let py = y * block_size
    conText.fillStyle = 'red'
    conText.fillRect(px, py, block_size, block_size)
    conText.strokeStyle = 'black'
    conText.strokeRect(px, py, block_size, block_size)
  }
    
  class Tetromino{
    constructor(x,y){
      //テトロミノの座標
      this.tetro_x = x
      this.tetro_y = y
      // this. tetroType = Math.floor(Math.random() * 2)
      this.tetroType =1
    }
    createTetroMino(){
      for (let y = 0; y < tetro_size; y++) {
        for (let x = 0; x < tetro_size; x++) {
          if (tetros[this.tetroType][y][x]) {
            drawBlock(this.tetro_x + x,this.tetro_y + y)
          }
        }
      }
    }
    moveTetroMino(){
      document.addEventListener('keydown',(e)=>{
        conText.clearRect(0,0, canvas_beside, canvas_vertical)
        switch(e.keyCode){
          case 37 : //左
          if(this.returnLeftX() >= 0){
            this.tetro_x--
          }
          this.createTetroMino()
          break
          case 38: //上
          this.tetro_y--
          this.createTetroMino()
          break
          case 39 : //右
          if(this.returnRightX() + 1 < field_beside){
            this.tetro_x++
          }
          this.createTetroMino()
          break
          case 40 :  //下
          if(this.returnBottomY() + 1 < field_vertical){
            this.tetro_y++
          }
          this.createTetroMino()
          break
        }
      })
    }

    returnBottomY(){
      for(let y = tetro_size - 1; y > 0; y--){
        for(let x = 0; x < tetro_size - 1; x++){
          if(tetros[this.tetroType][y][x]){
            return this.tetro_y + y
          }
        }
      }
      return 0
    }
    returnLeftX(){
      for(let x = 0; x < tetro_size -1; x++){
        for(let y = 0; y < tetro_size -1; y++){
          if(tetros[this.tetroType][x][y]){
            return this.tetro_x + x
          }
        }
      }
      return 0
    }
    returnRightX(){
      for(let x = tetro_size -1; x > 0; x--){
        for(let y = 0; y < tetro_size -1; y++){
          if(tetros[this.tetroType][x][y]){
            return this.tetro_x + x
          }
        }
      }
      return 0
    }
    copy() {
      return new Tetromino(this.tetro_x, this.tetro_y);
    }

  }
  
  class Field {
    constructor() {
      this.tiles = [
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      ]
    }
    draw(){
      for(let row = 0; row < field_vertical; row++){
        for(let col = 0; col < field_beside; col++){
          if(this.tiles[row][col]){
            drawBlock(col,row)
          }
        }
      }
    }
    tileAt(x,y){
      if(x < 0 && x > field_beside || y > field_vertical){
        return 1
      }
      
    }
  }
  class Board {
    constructor(){
      this.field = new Field()
      this.field.draw()
      this.tetroMino = new Tetromino(0,0)
    }
    init(){
      this.tetroMino.createTetroMino()
      this.tetroMino.moveTetroMino()
    }
    
    
    checkTetroMinoMove(){
      
    }
    
  }
  
  const tetros = [
  //テトロT
    [
      [0, 0, 0, 0],
      [1, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0],
    ],
    //テトロL
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
    ]
  ]

  let intervalID;
  const updateTetroMinoPosition = () => {
    intervalID = setInterval(() => {
      const m = board.tetroMino.copy()
      // if(m.tetro_y + 1 )
    },1000)
  }
  const board = new Board()
  board.init()
  updateTetroMinoPosition()


  const testButton = document.createElement('button')
  testButton.textContent = 'Add Tetris'
  document.querySelector('body').appendChild(testButton)
  testButton.addEventListener('click' ,() => {
    const tetro = new Tetromino(0,0)
    tetro.createTetroMino()
    tetro.moveTetroMino()
  })

}
