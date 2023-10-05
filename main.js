"use strict"
{
  const field_vertical = 21 //縦方向にブロックを格納できる個数
  const field_beside = 12 //横方向にブロックを格納できる個数
  const block_size = 30
  const canvas_vertical = field_vertical * block_size //ボードの縦方向の長さ
  const canvas_beside = field_beside * block_size //ボードの横方向の長さ

  let canvasId = document.getElementById("canvasId")
  let conText = canvasId.getContext("2d")
  canvasId.width = canvas_beside
  canvasId.height = canvas_vertical
  canvasId.style.border = "4px solid #555"

  const drawBlock = (x, y) => {
    let px = x * block_size
    let py = y * block_size
    conText.fillStyle = "red"
    conText.fillRect(px, py, block_size, block_size)
    conText.strokeStyle = "black"
    conText.strokeRect(px, py, block_size, block_size)
  }

  class Tetromino {
    constructor(_x, _y) {
      this.x = _x
      this.y = _y
      // this. tetroType = Math.floor(Math.random() * 2)
      this.tetroType = 1
    }
    draw() {
      for (let block of this.getBlocks()) {
        drawBlock(block.x, block.y)
      }
    }
    copy() {
      return new Tetromino(this.x, this.y)
    }
    getBlocks() {
      let blocks = [
        new Block(-1, 0),
        new Block(0, 0),
        new Block(0, -1),
        new Block(1, 0),
      ]
      return blocks.map((block) => {
        return new Block(this.x + block.x, this.y + block.y)
      })
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
    draw() {
      for (let row = 0; row < field_vertical; row++) {
        for (let col = 0; col < field_beside; col++) {
          if (this.tiles[row][col]) {
            drawBlock(col, row)
          }
        }
      }
    }
    tileAt(x, y) {
      if ((x < 0 && x > field_beside) || (y < 0 && y > field_vertical)) {
        return 1
      }
      return this.tiles[y][x]
    }
    putBlock(x, y) {
      //下方向に移動できないとき、fieldの座標を埋める
      //field.tiles[y][x] = 1
    }
  }

  class Board {
    constructor() {
      this.field = new Field()
      this.field.draw()
      this.tetroMino = new Tetromino(5, 1)
    }
    init() {
      this.tetroMino.draw()
      this.moveTetroMino()
    }
    checkMove(copy, field) {
      const blocks = copy.getBlocks()
      return blocks.every((block) => field.tileAt(block.x, block.y) == 0)
    }
    moveTetroMino() {
      document.addEventListener("keydown", (e) => {
        conText.clearRect(0, 0, canvas_beside, canvas_vertical)
        this.field.draw()
        const copy = this.tetroMino.copy()
        switch (e.keyCode) {
          case 37: //左
            copy.x--
            if (this.checkMove(copy, this.field) == true) {
              this.tetroMino.x--
            }
            break
          case 38: //上
            copy.y--
            if (this.checkMove(copy, this.field) == true) {
              this.tetroMino.y--
            }
            break
          case 39: //右
            copy.x++
            if (this.checkMove(copy, this.field) == true) {
              this.tetroMino.x++
            }
            break
          case 40: //下
            copy.y++
            if (this.checkMove(copy, this.field) == true) {
              this.tetroMino.y++
            }
            //else {//底についた条件を書いて、条件を満たすときに
            //filed.putBlock(ブロックスのブロックのx座標,ブロックスのブロックのy座標)
            // }
            break
        }
        this.tetroMino.draw()
      })
    }
  }

  class Block {
    constructor(x, y) {
      this.x = x
      this.y = y
    }
  }
  let intervalID
  const updateTetroMinoPosition = () => {
    intervalID = setInterval(() => {
      const m = board.tetroMino.copy()
    }, 1000)
  }
  const board = new Board()
  board.init()

  const testButton = document.createElement("button")
  testButton.textContent = "Add Tetris"
  document.querySelector("body").appendChild(testButton)
  testButton.addEventListener("click", () => {
    const tetro = new Tetromino(5, 1)
    tetro.draw()
  })
}
