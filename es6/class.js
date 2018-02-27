class Point {
  constructor (x, y) {
    this.x = x
    this.y = y
  }

  toString () {
    return '(' + this.x + ', ' + this.y + ')'
  }
}

class A {
  constructor (name, age) {
    this.name = name
    this.age = age
  }
}
A.prototype.x = 2

class B extends A {
  constructor () {
    super()
    console.log(super.x) // 2
  }
}

let b = new B()

export { b, Point }
