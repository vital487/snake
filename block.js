/**
 * Represents a snake block.
 */
class Block{
    constructor(x, y, width, height, color) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
    }

    set(block) {
        this.x = block.x
        this.y = block.y
        this.width = block.width
        this.height = block.height
        this.color = block.color
    }

    paint(context) {
        context.fillStyle = this.color
        context.fillRect(x, y, width, height)  
    }
}