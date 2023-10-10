"use strict"
{
  const field_vertical = 22 //縦方向にブロックを格納できる個数
  const field_beside = 12 //横方向にブロックを格納できる個数
  const block_size = 30
  const canvas_vertical = field_vertical * block_size //ボードの縦方向の長さ
  const canvas_beside = field_beside * block_size //ボードの横方向の長さ

  let canvasId = document.getElementById("canvasId")
  let conText = canvasId.getContext("2d")
  canvasId.width = canvas_beside
  canvasId.height = canvas_vertical
  canvasId.style.border = "4px solid #555"

  const tetroColors = ["red", "blue", "green", "brown", "orange", "#FF367F"]

  const drawBlock = (x, y, colorType) => {
    let px = x * block_size
    let py = y * block_size
    conText.fillStyle = tetroColors[colorType]
    conText.fillRect(px, py, block_size, block_size)
    conText.strokeStyle = "black"
    conText.strokeRect(px, py, block_size, block_size)
  }

  class Tetromino {
    constructor(_x, _y, _tetroType, _countUp) {
      this.x = _x
      this.y = _y
      this.tetroType = _tetroType
      this.countUp = _countUp
    }
    draw() {
      for (let block of this.getBlocks()) {
        drawBlock(block.x, block.y, this.tetroType + 1)
      }
    }
    copy() {
      return new Tetromino(this.x, this.y, this.tetroType, this.countUp)
    }
    getBlocks() {
      const BLOCKS = [
        //T型
        [new Block(-1, 0), new Block(0, 0), new Block(0, -1), new Block(1, 0)],
        //L型
        [new Block(0, 0), new Block(1, 0), new Block(0, -1), new Block(0, -2)],
        //四角型
        [new Block(0, 0), new Block(1, 0), new Block(0, -1), new Block(1, -1)],
        //I型
        [new Block(-2, 0), new Block(-1, 0), new Block(0, 0), new Block(1, 0)],
        //Z型
        [new Block(0, 0), new Block(0, -1), new Block(1, 0), new Block(1, 1)],
      ]
      let blocks = BLOCKS[this.tetroType]
      //回転処理
      if (this.countUp >= 1) {
        for (let i = 0; i < this.countUp; i++) {
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
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      ]
    }
    draw() {
      for (let row = 0; row < field_vertical; row++) {
        for (let col = 0; col < field_beside; col++) {
          if (this.tiles[row][col]) {
            drawBlock(col, row, this.tiles[row][col])
          }
        }
      }
    }
    tileStatus(x, y) {
      if ((x < 0 && x > field_beside) || (y < 0 && y > field_vertical)) {
        return 1
      }
      return this.tiles[y][x]
    }
    putBlock(x, y, colorType) {
      //下方向に移動できないとき、fieldの座標を埋める
      this.tiles[y][x] = colorType
    }
    findLineFilled() {
      for (let i = 0; i < field_vertical - 1; i++) {
        if (this.tiles[i].every((tile) => tile !== 0) == true) {
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
      this.tetroMino = new Tetromino(6, 3, Math.floor(Math.random() * 5), 0)
      this.intervalID
      this.gameOver = false
      this.score = 0
    }
    init() {
      this.field = new Field()
      this.field.draw()
      this.tetroMino.draw()
      this.moveTetroMino()
      this.gameOver = false
      this.score = 0
      this.intervalID = setInterval(() => {
        this.fallDown()
        this.tetroMino.draw()
      }, 1000)
    }
    checkMove(tetro, field) {
      const blocks = tetro.getBlocks()
      return blocks.every((block) => field.tileStatus(block.x, block.y) == 0)
    }
    fallDown() {
      conText.clearRect(0, 0, canvas_beside, canvas_vertical)
      this.field.draw()
      const futureMino = this.tetroMino.copy()
      futureMino.y++
      if (this.checkMove(futureMino, this.field) == true) {
        this.tetroMino.y++
      } else {
        //ブロックをフィールドに固定する
        this.tetroMino.getBlocks().forEach((block) => {
          this.field.putBlock(block.x, block.y, this.tetroMino.tetroType + 1)
        })
        //ブロックが横一列に揃ったら、ラインを消す
        let line = -1
        while ((line = this.field.findLineFilled()) !== -1) {
          this.field.cutLine(line)
          this.score++
        }
        this.field.draw()
        this.tetroMino = new Tetromino(6, 3, Math.floor(Math.random() * 5), 0)
        this.tetroMino.draw()
        //ゲームオーバーの判定
        if (this.checkMove(this.tetroMino, this.field) == false) {
          this.gameOver = true
          clearInterval(this.intervalID)
          this.drawScore()
        }
      }
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
            this.fallDown()
            break
          case 32: //スペースキー
            futureMino.countUp++
            if (this.checkMove(futureMino, this.field) == true) {
              this.tetroMino.countUp++
            }
            break
        }
        this.tetroMino.draw()
      })
    }
    drawScore() {
      conText.font = "40px serif"
      conText.fillStyle = "black"
      conText.fillText("GAME OVER", 40, canvas_vertical / 2)
      conText.fillText(
        `YOUR SCORE ${this.score}!`,
        10,
        canvas_vertical / 2 + 90
      )
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
