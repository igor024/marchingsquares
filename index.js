import { PerlinNoise } from "./noise"

function variation(p1, p2, p3, p4) {
    switch (Math.round(p1)*1+Math.round(p2)*2+Math.round(p3)*4+Math.round(p4)*8) {
        default:
            return npc  
    }
}

function main() {
    //generate seed
    const pointDist = 10
    const ctx = document.getElementById("canvas").getContext("2d")
    const pointsX = Math.floor(canvas.width/pointDist) + 1
    const pointsY = Math.floor(canvas.height/pointDist) + 1
    const points = new Array(pointsX)
    
    for(let i = 0; i < pointsX; i++) {
        points[i] = new Array(pointsY)
        for(let j = 0; j < pointsY; j++) {
            points[i][j] = PerlinNoise(i, j, .8)
        }
    }

    
    //draw
    

    for (let i = 0; i<pointsX; i++) {
        for (let j = 0; j<pointsY; j++) {
            ctx.save()

            ctx.strokeStyle = `rgba(255, 0, 0,  ${points[i][j]})`;
            ctx.fillStyle = `rgba(255, 0, 0, ${points[i][j]})`;


            const x = i * pointDist
            const y = j * pointDist
            
            canvas.fillRect(x, y, 1, 1)

            ctx.restore()
        }
    }

}


window.addEventListener("load", main)