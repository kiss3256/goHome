

var CROSSOVER_RATE = 0.7
var MUTATION_RATE = 0.001
var POP_SIZE = 140
var CHROMO_LENGTH = 70
var GENE_LENGTH = 2


var randInt = function(a, b) {
  return parseInt(Math.random()*(b-a+1)+a,10)
}



function getType(obj){
   //tostring会返回对应不同的标签的构造函数
   var toString = Object.prototype.toString;
   var map = {
      '[object Boolean]'  : 'boolean', 
      '[object Number]'   : 'number', 
      '[object String]'   : 'string', 
      '[object Function]' : 'function', 
      '[object Array]'    : 'array', 
      '[object Date]'     : 'date', 
      '[object RegExp]'   : 'regExp', 
      '[object Undefined]': 'undefined',
      '[object Null]'     : 'null', 
      '[object Object]'   : 'object'
  };
  if(obj instanceof Element) {
       return 'element';
  }
  return map[toString.call(obj)];
}

function deepClone(data){
   var type = getType(data);
   var obj;
   if(type === 'array'){
       obj = [];
   } else if(type === 'object'){
       obj = {};
   } else {
       //不再具有下一层次
       return data;
   }
   if(type === 'array'){
       for(var i = 0, len = data.length; i < len; i++){
           obj.push(deepClone(data[i]));
       }
   } else if(type === 'object'){
       for(var key in data){
           obj[key] = deepClone(data[key]);
       }
   }
   return obj;
}






var Genome = function(len) {
  this.data = []
  this.fitness = 0.0


  this.clear = function() {
    this.data = []
  }

  this._init = function(len) {
    for (var i = 0; i < len; i++) {
      this.data.push(randInt(0, 1))
    }
  }

  this._init(len)

}


var App = function(crossover_rate, mutation_rate, pop_size, chromo_length) {
  this.run              = true
  this.genomes          = []
  this.generation       = 0
  this.crossover_rate   = crossover_rate
  this.mutation_rate    = mutation_rate
  this.pop_size         = pop_size
  this.chromo_length    = chromo_length

  this.createStartPopulation(this.pop_size)
}

App.prototype.createStartPopulation = function(len) {

  for (var i = 0; i < len; i++) {
    this.genomes.push(new Genome(this.chromo_length))
  }

}


App.prototype.updateFintness = function(roadMap) {

  this.totalFitness = 0.0
  this.bestFitness  = 0.0
  for (var i = 0; i < this.genomes.length; i++) {
    
    var fitness = roadMap.testRoad(this.genomes[i])
    this.genomes[i].fitness = fitness
    this.totalFitness += fitness

    if (fitness > this.bestFitness) {
      this.bestFitness = fitness
    }

    if (fitness == 1.0) {
      this.run = false
      break
    }
  }

}


App.prototype.rouletteWheelSelection = function() {

  var slice = Math.random() * (this.totalFitness - 1.0)
  var total = 0.0

  for (var i = 0; i < this.pop_size; i++) {

    total += this.genomes[i].fitness
    if (total>slice) return this.genomes[i]

  }
  
}


App.prototype.crossover = function(a, b) {
  var ad = deepClone(a)
  var bd = deepClone(b)
  if (Math.random() < this.crossover_rate) {
    var pos = parseInt(Math.random() * this.chromo_length, 10)

    var tmp = 0
    for (var i = pos; i < this.chromo_length; i++) {
      tmp = ad[i]
      ad[i] = bd[i]
      bd[i] = tmp
    }
  }

  return [ad, bd]

}


App.prototype.mutation = function(baby) {
  for (var i = 0; i < this.chromo_length; i++) {
    if (Math.random() < this.mutation_rate) {
      baby.data[i] = baby.data[i] ? 0 : 1
    }
  }

  return baby
}


App.prototype.epoch = function(roadMap) {
  this.updateFintness(roadMap)
  this.generation += 1

  var newBabies = []

  while (newBabies.length < this.genomes.length) {

    var towBabies
    var crossover = Math.random()
    if (crossover < this.crossover_rate) {
      var genomesA = this.rouletteWheelSelection()
      var genomesB = this.rouletteWheelSelection()

      if (genomesA == genomesB) {
        continue
      }

      arr = this.crossover(genomesA, genomesB)
      genomesA, genomesB = arr[0], arr[1]

      genomesA = this.mutation(genomesA)
      genomesB = this.mutation(genomesB)


      newBabies.push(genomesA)
      newBabies.push(genomesB)

    }


  }


  this.genomes = newBabies
}





window.onload = function() {
  var app = new App(CROSSOVER_RATE, MUTATION_RATE, POP_SIZE, CHROMO_LENGTH)

  var gameRun = setInterval(() => {
    if (app.run) {
      app.epoch(road)
      var info = document.getElementById('info')
      info.innerHTML = '第'+app.generation+'代 最大适应分数'+app.bestFitness
    } else {
      clearInterval(gameRun)
    }
    
  }, 1000 / 60)

}
