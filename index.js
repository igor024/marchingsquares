function main() {
    const pointDist = 10
    const canvas = document.getElementById("canvas").getContext("2d")

    //generate seed

    //draw
    const pointsX = Math.floor(canvas.width/pointDist) + 1
    const pointsY = Math.floor(canvas.height/pointDist) + 1

    for (let i = 0; i<pointsX; i++) {
        for (let j = 0; j<pointsY; j++) {
            const x = i * pointDist
            const y = j * pointDist
            
            canvas.fillRect(x, y, 1, 1)
        }
    }

}


window.addEventListener("load", main)