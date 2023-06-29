const pointsize = 1
const pointDist = 30
const adjustableScale = 0.005
const noiseScale = adjustableScale * pointDist
const seed =  Math.random() * 10000
const numLayers = 8

const PerlinNoise = new function () {

    this.noise = function (x, y, z) {

        var p = new Array(512)
        var permutation = [151, 160, 137, 91, 90, 15,
            131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23,
            190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
            88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166,
            77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244,
            102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
            135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123,
            5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
            223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
            129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228,
            251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107,
            49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
            138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180
        ];
        for (var i = 0; i < 256; i++)
            p[256 + i] = p[i] = permutation[i];

        var X = Math.floor(x) & 255,                  // FIND UNIT CUBE THAT
            Y = Math.floor(y) & 255,                  // CONTAINS POINT.
            Z = Math.floor(z) & 255;
        x -= Math.floor(x);                                // FIND RELATIVE X,Y,Z
        y -= Math.floor(y);                                // OF POINT IN CUBE.
        z -= Math.floor(z);
        var u = fade(x),                                // COMPUTE FADE CURVES
            v = fade(y),                                // FOR EACH OF X,Y,Z.
            w = fade(z);
        var A = p[X] + Y, AA = p[A] + Z, AB = p[A + 1] + Z,      // HASH COORDINATES OF
            B = p[X + 1] + Y, BA = p[B] + Z, BB = p[B + 1] + Z;      // THE 8 CUBE CORNERS,

        return scale(lerp(w, lerp(v, lerp(u, grad(p[AA], x, y, z),  // AND ADD
            grad(p[BA], x - 1, y, z)), // BLENDED
            lerp(u, grad(p[AB], x, y - 1, z),  // RESULTS
                grad(p[BB], x - 1, y - 1, z))),// FROM  8
            lerp(v, lerp(u, grad(p[AA + 1], x, y, z - 1),  // CORNERS
                grad(p[BA + 1], x - 1, y, z - 1)), // OF CUBE
                lerp(u, grad(p[AB + 1], x, y - 1, z - 1),
                    grad(p[BB + 1], x - 1, y - 1, z - 1)))));
    }
    function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
    function lerp(t, a, b) { return a + t * (b - a); }
    function grad(hash, x, y, z) {
        var h = hash & 15;                      // CONVERT LO 4 BITS OF HASH CODE
        var u = h < 8 ? x : y,                 // INTO 12 GRADIENT DIRECTIONS.
            v = h < 4 ? y : h == 12 || h == 14 ? x : z;
        return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
    }
    function scale(n) { return (1 + n) / 2; }
}

function getNoise(x, y) {
    let res = 0
    for(let i = 0; i < numLayers; i++) {
        res += PerlinNoise.noise(x * noiseScale * Math.pow(2,i), y * noiseScale * Math.pow(2,i), seed) * Math.pow(0.5, i)
        if(i > 0) {
            res -= 0.5 * Math.pow(0.5, i)
        }
    }
    return res
}

function getState(p1, p2, p3, p4) { 
    return Math.round(p1) * 8 + Math.round(p2) * 4 + Math.round(p3) * 2 + Math.round(p4) * 1
}

function drawLine(ctx, a, b) {
    ctx.save()

    ctx.beginPath()
    ctx.moveTo(a.x, a.y)
    ctx.lineTo(b.x, b.y)
    ctx.stroke()

    ctx.restore()
}

function threshhold(x) {
    return x >= 0.5 ? 1 : 0
}

function main() {
    //generate seed
    const canvas = document.getElementById("mainCanvas")
    const ctx = document.getElementById("mainCanvas").getContext("2d")

    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const pointsX = Math.floor(canvas.width / pointDist) + 1
    const pointsY = Math.floor(canvas.height / pointDist) + 1
    const points = new Array(pointsX)


    for (let i = 0; i < pointsX; i++) {
        points[i] = new Array(pointsY)
        for (let j = 0; j < pointsY; j++) {
            points[i][j] = getNoise(i, j)
        }
    }

    console.log(points)
    //draw

    //ctx.beginPath()

    for (let i = 0; i < pointsX; i++) {
        //ctx.moveTo(i * pointDist + pointsize, 0)
        for (let j = 0; j < pointsY; j++) {
            //ctx.save()

            ctx.strokeStyle = `rgb(${255 * threshhold(points[i][j])}, ${255 * threshhold(points[i][j])}, ${255 * threshhold(points[i][j])})`
            ctx.fillStyle = `rgb(${255 * threshhold(points[i][j])}, ${255 * threshhold(points[i][j])}, ${255 * threshhold(points[i][j])})`


            const x = i * pointDist
            const y = j * pointDist


            ctx.fillRect(x, y, pointsize, pointsize)
            //ctx.lineTo(x + pointsize/2, y + pointsize/2)

            ctx.restore()
        }
    }

    ctx.stroke()


    ctx.fillStyle = `rgb(0, 0, 0)`
    ctx.strokeStyle = `rgb(0, 0, 0)`



    for (let i = 0; i < pointsX - 1; i++) {
        for (let j = 0; j < pointsY - 1; j++) {
            const x = i * pointDist + pointsize/2
            const y = j * pointDist + pointsize/2

            const p1 = points[i + 1][j]
            const p2 = points[i][j]
            const p3 = points[i][j + 1]
            const p4 = points[i + 1][j + 1]

            const a = { x: x + pointDist * p1, y: y } //up
            const b = { x: x, y: y + pointDist * p3 } //left
            const c = { x: x + pointDist, y: y + pointDist * p4} //but this side would depend which one is turne don tho bc
            const d = { x: x + pointDist * p4, y: y + pointDist} //down

            const state = getState(p1, p2, p3, p4)

            switch(state) {
                case 1:
                    drawLine(ctx, c, d)
                    break
                case 2:
                    drawLine(ctx, b, d)
                    break
                case 3:
                    drawLine(ctx, b, c)
                    break
                case 4: 
                    drawLine(ctx, a, b)
                    break
                case 5:
                    drawLine(ctx, b, a)
                    drawLine(ctx, c, d)
                    break
                case 6:
                    drawLine(ctx, a, d)
                    break
                case 7:
                    drawLine(ctx, a, c)
                    break
                case 8:
                    drawLine(ctx, a, c)
                    break
                case 9:
                    drawLine(ctx, a, d)
                    break
                case 10:
                    drawLine(ctx, b, d)
                    drawLine(ctx, a, c)
                    break
                case 11:
                    drawLine(ctx, b, a)
                    break
                case 12:
                    drawLine(ctx, b, c)
                    break
                case 13:
                    drawLine(ctx, b, d)
                    break
                case 14:
                    drawLine(ctx, c, d)
                    break
            }

            /*
            switch (state) {
                case 1:
                    drawLine(ctx, c, d)
                case 2:
                    drawLine(ctx, b, c)
                case 3:
                    drawLine(ctx, b, d)
                case 4:
                    drawLine(ctx, b, a)
                case 5:
                    drawLine(ctx, b, a)
                    drawLine(ctx, c, d)
                case 6:
                    drawLine(ctx, a, c)
                case 7:
                    drawLine(ctx, a, d)
                case 8:
                    drawLine(ctx, a, d)
                case 9:
                    drawLine(ctx, a, c)
                case 10:
                    drawLine(ctx, b, c)
                    drawLine(ctx, a, d)
                case 11:
                    drawLine(ctx, b, a)
                case 12:
                    drawLine(ctx, b, d)
                case 13:
                    drawLine(ctx, b, c)
                case 14:
                    drawLine(ctx, c, d)
            } */

            ctx.restore()
        }
    }


}

window.addEventListener("load", main)