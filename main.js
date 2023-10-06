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
    constructor(_x, _y, _tetroType) {
      this.x = _x
      this.y = _y
      this.tetroType = _tetroType
    }
    draw() {
      for (let block of this.getBlocks()) {
        drawBlock(block.x, block.y)
      }
    }
    copy() {
      return new Tetromino(this.x, this.y, this.tetroType)
    }
    getBlocks() {
      const BLOCKS = [
        [new Block(-1, 0), new Block(0, 0), new Block(0, -1), new Block(1, 0)],
        [new Block(0, 0), new Block(1, 0), new Block(0, -1), new Block(0, -2)],
        [new Block(0, 0), new Block(1, 0), new Block(0, -1), new Block(1, -1)],
        [new Block(-2, 0), new Block(-1, 0), new Block(0, 0), new Block(1, 0)],
        [new Block(0, 0), new Block(0, -1), new Block(1, 0), new Block(1, 1)],
      ]
      let blocks = BLOCKS[this.tetroType]
      //回転処理
      if (board.countUp >= 1) {
        for (let i = 0; i < board.countUp; i++) {
          blocks = blocks.map((block) => {
            return new Block(-block.y, block.x)
          })
        }
      }
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
      this.tiles[y][x] = 1
    }
    findLineFilled() {
      for (let i = 0; i < 20; i++) {
        if (this.tiles[i].every((tile) => tile == 1) == true) {
          return i
        }
      }
      return -1
    }
    cutLine(y) {
      if (y == -1) {
        return
      }
      this.tiles.splice(y, 1)
      this.tiles.unshift([1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1])
    }
  }

  class Board {
    constructor() {
      this.tetroMino = new Tetromino(6, 3, Math.floor(Math.random() * 5))
      this.intervalID
      this.gameOver = false
    }
    init() {
      this.field = new Field()
      this.field.draw()
      this.tetroMino.draw()
      this.moveTetroMino()
      this.gameOver = false
      this.countUp = 0

      this.intervalID = setInterval(() => {
        const futureMino = this.tetroMino.copy()
        futureMino.y++
        conText.clearRect(0, 0, canvas_beside, canvas_vertical)
        this.field.draw()
        if (this.checkMove(futureMino, this.field) == true) {
          this.tetroMino.y++
        } else {
          this.tetroMino.getBlocks().forEach((block) => {
            this.field.putBlock(block.x, block.y)
          })
          let line = -1
          while ((line = this.field.findLineFilled()) !== -1) {
            this.field.cutLine(line)
          }
          this.countUp = 0
          this.field.draw()
          this.tetroMino = new Tetromino(6, 3, Math.floor(Math.random() * 5))
          this.tetroMino.draw()
          //ゲームオーバーの判定
          if (this.checkMove(this.tetroMino, this.field) == false) {
            this.gameOver = true
            clearInterval(this.intervalID)
            confirm("Game Over")
          }
        }
        this.tetroMino.draw()
      }, 1000)
    }
    checkMove(tetro, field) {
      const blocks = tetro.getBlocks()
      return blocks.every((block) => field.tileAt(block.x, block.y) == 0)
    }
    moveTetroMino() {
      document.addEventListener("keydown", (e) => {
        conText.clearRect(0, 0, canvas_beside, canvas_vertical)
        this.field.draw()
        const futureMino = this.tetroMino.copy()
        switch (e.keyCode) {
          case 37: //左
            futureMino.x--
            if (this.checkMove(futureMino, this.field) == true) {
              this.tetroMino.x--
            }
            break
          case 38:
            if (this.gameOver !== true) {
              return
            }
            this.init()
            break
          case 39: //右
            futureMino.x++
            if (this.checkMove(futureMino, this.field) == true) {
              this.tetroMino.x++
            }
            break
          case 40: //下
            futureMino.y++
            if (this.checkMove(futureMino, this.field) == true) {
              this.tetroMino.y++
            } else {
              this.tetroMino.getBlocks().forEach((block) => {
                this.field.putBlock(block.x, block.y)
              })
              this.field.cutLine(this.field.findLineFilled())
              this.field.draw()
              this.tetroMino = new Tetromino(
                6,
                3,
                Math.floor(Math.random() * 5)
              )
              this.tetroMino.draw()
              this.countUp = 0
              //ゲームオーバーの判定
              if (this.checkMove(this.tetroMino, this.field) == false) {
                this.gameOver = true
                clearInterval(this.intervalID)
                confirm("Game Over")
              }
            }
            break

          case 32: //スペースキー
            this.countUp++
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

  const board = new Board()
  board.init()
}
