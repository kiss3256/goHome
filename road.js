

var road = {}
var mapWidth  = 15
var mapHeight = 10


road.roadMap = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0],
  [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
]

road.render = function(path) {
  var myCanvas = document.getElementById('my-canvas')
  var bw = 20
  myCanvas.width = (mapWidth + 1) * bw
  myCanvas.height = (mapHeight + 1) * bw
  var ctx = myCanvas.getContext('2d')

  var groundColor = '#000'
  var blankColor  = '#eee'
  var pathColor   = '#666'

  ctx.clearRect(0, 0, 300, 200)

  var pd = []
  for (var i = 0; i < path.length; i++) {
    pd.push(path[i].join(''))
  }

  for (var i = 0; i < mapWidth; i++) {
    for(var j = 0; j < mapHeight; j++) {

      var step = pd.indexOf([j, i].join(''))
      ctx.fillStyle = this.roadMap[j][i] ? groundColor : blankColor

      // path
      if (step !== -1) ctx.fillStyle = pathColor

      // end
      if (pd.indexOf([j, i].join('')) === pd.length-1 ) {
      
        ctx.fillStyle = '#f00'
      
      }
      
      ctx.fillRect(i*(bw+1), j*(bw+1), bw, bw)

      if (step !== -1) {
        ctx.fillStyle = '#fff'
        console.log(step)
        ctx.fillText(''+step, i*(bw+1.5), (j+1)*bw)
      }

    }
  }

  ctx.stroke()

}


road.testRoad = function(genome) {

  var binToInt = function(arr) {
    var val = 0
    var multiplier = 1
    for (var i = 0; i < arr.length; i++) {
      val += arr[i] * multiplier
      multiplier *= 2
    }
    return val
  }


  var decode = function(genome) {
    var gene = genome.data
    var directions = []
    for (var i = 0; i < gene.length; i+=GENE_LENGTH) {
      var thisGene = []
      for (var j = i; j < i + GENE_LENGTH; j++){
        thisGene.push(gene[j])
      }
      directions.push(binToInt(thisGene))
    }

    return directions
  }


  var getFitness = function(direct) {
    var startY = 2
    var startX = 0

    var endY = 7
    var endX = 14

    var x = startX, y = startY
    var memory = []
    var rm = road.roadMap
    for (var i = 0; i < direct.length; i++) {
      switch(direct[i]) {
        case 0:
          if (y-1 < 0) break
          if (!rm[y-1][x]) {y-=1; memory.push([y, x])}
          break
        case 1:
          if (x+1 > endX) break
          if (!rm[y][x+1]) {x+=1; memory.push([y, x])}
          break
        case 2:
          if (y+1 > endY) break
          if (!rm[y+1][x]) {y+=1; memory.push([y, x])}
          break
        case 3:
          if (x-1 < 0) break
          if (!rm[y][x-1]) {x-=1; memory.push([y, x])}
          break
      }
    }

    road.render(memory)

    return 1 / (Math.abs(endX - x) + Math.abs(endY - y) + 1)
  }


  return getFitness(decode(genome))
  
}
