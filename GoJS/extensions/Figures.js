'use strict'
/*
*  Copyright (C) 1998-2017 by Northwoods Software Corporation. All Rights Reserved.
*/

// This file holds definitions of all standard shape figures -- string values for Shape.figure.

// The following functions and variables are used throughout this file:

/**
* @constructor
* @param {string} name
* @param {number} def
* @param {number=} min defaults to zero
* @param {number=} max defaults to Infinity
* @class
* This FigureParamter class describes various properties each parameter uses in figures.
*/
function FigureParameter (name, def, min, max) {
  if (min === undefined/* notpresent */) min = 0.0
  if (max === undefined/* notpresent */) max = Infinity
  /** @type {string} */
  this._name = name
  /** @type {number} */
  this._defaultValue = def
  /** @type {number} */
  this._minimum = min
  /** @type {number} */
  this._maximum = max
};

// Public properties

/**
* Gets or sets the name of the figure.
* @name FigureParamater#name
* @function.
* @return {string}
*/
Object.defineProperty(FigureParameter.prototype, 'name', {
  get: function () { return this._name },
  set: function (val) {
    if (typeof val !== 'string' || val === '') throw new Error('Shape name must be a valid string.')
    this._name = val
  }
})

/**
* Gets or sets the default value for the parameter.
* @name FigureParameter#defaultValue
* @function
* @return {number}
*/
Object.defineProperty(FigureParameter.prototype, 'defaultValue', {
  get: function () { return this._defaultValue },
  set: function (val) {
    if (typeof val !== 'number' || isNaN(val)) throw new Error('The default value must be a real number, not: ' + val)
    this._defaultValue = val
  }
})

/**
* Gets or sets the minimum value allowed for the figure parameter.
* @name FigureParameter#minimum
* @function.
* @return {number}
*/
Object.defineProperty(FigureParameter.prototype, 'minimum', {
  get: function () { return this._minimum },
  set: function (val) {
    if (typeof val !== 'number' || isNaN(val)) throw new Error('Minimum must be a real number, not: ' + val)
    this._minimum = val
  }
})

/**
* Gets or sets the maximum value allowed for the figure parameter.
* @name FigureParameter#maximum
* @function.
* @return {number}
*/
Object.defineProperty(FigureParameter.prototype, 'maximum', {
  get: function () { return this._maximum },
  set: function (val) {
    if (typeof val !== 'number' || isNaN(val)) throw new Error('Maximum must be a real number, not: ' + val)
    this._maximum = val
  }
})

go.Shape._FigureParameters = {}

/*
* This static function gets a FigureParameter for a particular figure name.
* @param {String} figurename
* @param {number} index, currently must be either 0 or 1
* @return {FigureParameter}
*/
go.Shape.getFigureParameter = function (figurename, index) {
  var arr = go.Shape._FigureParameters[figurename]
  if (!arr) return null
  return /** @type {FigureParmeter} */ (arr[index])
}

/*
* This static function sets a FigureParameter for a particular figure name.
* @param {String} figurename
* @param {number} index, currently must be either 0 or 1
* @param {FigureParameter} figparam
*/
go.Shape.setFigureParameter = function (figurename, index, figparam) {
  if (!(figparam instanceof FigureParameter)) throw new Error('Third argument to Shape.setFigureParameter is not FigureParameter: ' + figparam)
  if (figparam.defaultValue < figparam.minimum || figparam.defaultValue > figparam.maximum) throw new Error('defaultValue must be between minimum and maximum, not: ' + figparam.defaultValue)
  var arr = go.Shape._FigureParameters[figurename]
  if (!arr) {
    arr = []
    go.Shape._FigureParameters[figurename] = arr
  }
  arr[index] = figparam
}

/** @ignore */
var _CachedPoints = []

/**
* @ignore
* @param {number} x
* @param {number} y
* @return {Point}
*/
function tempPointAt (x, y) {
  var temp = _CachedPoints.pop()
  if (temp === undefined) return new go.Point(x, y)
  temp.x = x
  temp.y = y
  return temp
};

/**
* @ignore
* @return {Point}
*/
function tempPoint () {
  var temp = _CachedPoints.pop()
  if (temp === undefined) return new go.Point()
  return temp
};

/**
  * @ignore
  * @param {Point} temp
  */
function freePoint (temp) {
  _CachedPoints.push(temp)
};

/**
* @ignore
* @param {number} p1x
* @param {number} p1y
* @param {number} p2x
* @param {number} p2y
* @param {number} q1x
* @param {number} q1y
* @param {number} q2x
* @param {number} q2y
* @param {Point} result
* @return {Point}
*/
function getIntersection (p1x, p1y, p2x, p2y, q1x, q1y, q2x, q2y, result) {
  var dx1 = p1x - p2x
  var dx2 = q1x - q2x
  var x
  var y

  if (dx1 === 0 || dx2 === 0) {
    if (dx1 === 0) {
      var m2 = (q1y - q2y) / dx2
      var b2 = q1y - m2 * q1x
      x = p1x
      y = m2 * x + b2
    } else {
      var m1 = (p1y - p2y) / dx1
      var b1 = p1y - m1 * p1x
      x = q1x
      y = m1 * x + b1
    }
  } else {
    var m1 = (p1y - p2y) / dx1
    var m2 = (q1y - q2y) / dx2
    var b1 = p1y - m1 * p1x
    var b2 = q1y - m2 * q1x

    x = (b2 - b1) / (m1 - m2)
    y = m1 * x + b1
  }

  result.x = x
  result.y = y
  return result
};

/**
* @ignore
* @param {number} startx
* @param {number} starty
* @param {number} c1x
* @param {number} c1y
* @param {number} c2x
* @param {number} c2y
* @param {number} endx
* @param {number} endy
* @pararm {number} fraction
* @param {Point} curve1cp1  // modified result control point
* @param {Point} curve1cp2  // modified result control point
* @param {Point} midpoint  // modified result
* @param {Point} curve2cp1  // modified result control point
* @param {Point} curve2cp2  // modified result control point
*/
function breakUpBezier (startx, starty, c1x, c1y, c2x, c2y, endx, endy, fraction,
                       curve1cp1, curve1cp2, midpoint, curve2cp1, curve2cp2) {
  var fo = 1 - fraction
  var so = fraction
  var m1x = (startx * fo + c1x * so)
  var m1y = (starty * fo + c1y * so)
  var m2x = (c1x * fo + c2x * so)
  var m2y = (c1y * fo + c2y * so)
  var m3x = (c2x * fo + endx * so)
  var m3y = (c2y * fo + endy * so)
  var m12x = (m1x * fo + m2x * so)
  var m12y = (m1y * fo + m2y * so)
  var m23x = (m2x * fo + m3x * so)
  var m23y = (m2y * fo + m3y * so)
  var m123x = (m12x * fo + m23x * so)
  var m123y = (m12y * fo + m23y * so)

  curve1cp1.x = m1x
  curve1cp1.y = m1y

  curve1cp2.x = m12x
  curve1cp2.y = m12y

  midpoint.x = m123x
  midpoint.y = m123y

  curve2cp1.x = m23x
  curve2cp1.y = m23y

  curve2cp2.x = m3x
  curve2cp2.y = m3y
};

var GeneratorEllipseSpot1 = new go.Spot(0.156, 0.156)

var GeneratorEllipseSpot2 = new go.Spot(0.844, 0.844)

var KAPPA = 4 * ((Math.sqrt(2) - 1) / 3)

// PREDEFINED figures, built into the v2.0 library:

go.Shape.defineFigureGenerator('Rectangle', function (shape, w, h) {  // predefined in 2.0
  var geo = new go.Geometry(go.Geometry.Rectangle)
  geo.startX = 0
  geo.startY = 0
  geo.endX = w
  geo.endY = h
  return geo
})

go.Shape.defineFigureGenerator('Square', function (shape, w, h) {  // predefined in 2.0
  var geo = new go.Geometry(go.Geometry.Rectangle)
  geo.startX = 0
  geo.startY = 0
  geo.endX = w
  geo.endY = h
  geo.defaultStretch = go.GraphObject.Uniform
  return geo
})

go.Shape.setFigureParameter('RoundedRectangle', 0, new FigureParameter('CornerRounding', 5))
go.Shape.defineFigureGenerator('RoundedRectangle', function (shape, w, h) {  // predefined in 2.0
  var param1 = shape ? shape.parameter1 : NaN
  if (isNaN(param1) || param1 < 0) param1 = 5  // default corner
  param1 = Math.min(param1, w / 3)
  param1 = Math.min(param1, h / 3)

  var cpOffset = param1 * KAPPA
  var geo = new go.Geometry()
         .add(new go.PathFigure(param1, 0, true)
              .add(new go.PathSegment(go.PathSegment.Line, w - param1, 0))
              .add(new go.PathSegment(go.PathSegment.Bezier, w, param1, w - cpOffset, 0, w, cpOffset))
              .add(new go.PathSegment(go.PathSegment.Line, w, h - param1))
              .add(new go.PathSegment(go.PathSegment.Bezier, w - param1, h, w, h - cpOffset, w - cpOffset, h))
              .add(new go.PathSegment(go.PathSegment.Line, param1, h))
              .add(new go.PathSegment(go.PathSegment.Bezier, 0, h - param1, cpOffset, h, 0, h - cpOffset))
              .add(new go.PathSegment(go.PathSegment.Line, 0, param1))
              .add(new go.PathSegment(go.PathSegment.Bezier, param1, 0, 0, cpOffset, cpOffset, 0).close()))
  if (cpOffset > 1) {
    geo.spot1 = new go.Spot(0, 0, cpOffset, cpOffset)
    geo.spot2 = new go.Spot(1, 1, -cpOffset, -cpOffset)
  }
  return geo
})

go.Shape.defineFigureGenerator('Border', 'RoundedRectangle')  // predefined in 2.0

go.Shape.defineFigureGenerator('Ellipse', function (shape, w, h) {  // predefined in 2.0
  var geo = new go.Geometry(go.Geometry.Ellipse)
  geo.startX = 0
  geo.startY = 0
  geo.endX = w
  geo.endY = h
  geo.spot1 = GeneratorEllipseSpot1
  geo.spot2 = GeneratorEllipseSpot2
  return geo
})

go.Shape.defineFigureGenerator('Circle', function (shape, w, h) {  // predefined in 2.0
  var geo = new go.Geometry(go.Geometry.Ellipse)
  geo.startX = 0
  geo.startY = 0
  geo.endX = w
  geo.endY = h
  geo.spot1 = GeneratorEllipseSpot1
  geo.spot2 = GeneratorEllipseSpot2
  geo.defaultStretch = go.GraphObject.Uniform
  return geo
})

go.Shape.defineFigureGenerator('TriangleRight', function (shape, w, h) {  // predefined in 2.0
  return new go.Geometry()
         .add(new go.PathFigure(0, 0)
              .add(new go.PathSegment(go.PathSegment.Line, w, 0.5 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0, h).close()))
         .setSpots(0, 0.25, 0.5, 0.75)
})

go.Shape.defineFigureGenerator('TriangleDown', function (shape, w, h) {  // predefined in 2.0
  return new go.Geometry()
         .add(new go.PathFigure(0, 0)
              .add(new go.PathSegment(go.PathSegment.Line, w, 0))
              .add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, h).close()))
         .setSpots(0.25, 0, 0.75, 0.5)
})

go.Shape.defineFigureGenerator('TriangleLeft', function (shape, w, h) {  // predefined in 2.0
  return new go.Geometry()
         .add(new go.PathFigure(w, h)
              .add(new go.PathSegment(go.PathSegment.Line, 0, 0.5 * h))
              .add(new go.PathSegment(go.PathSegment.Line, w, 0).close()))
         .setSpots(0.5, 0.25, 1, 0.75)
})

go.Shape.defineFigureGenerator('TriangleUp', function (shape, w, h) {  // predefined in 2.0
  return new go.Geometry()
         .add(new go.PathFigure(w, h)
              .add(new go.PathSegment(go.PathSegment.Line, 0, h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0).close()))
         .setSpots(0.25, 0.5, 0.75, 1)
})

go.Shape.defineFigureGenerator('Triangle', 'TriangleUp')  // predefined in 2.0

go.Shape.defineFigureGenerator('Diamond', function (shape, w, h) {  // predefined in 2.0
  return new go.Geometry()
         .add(new go.PathFigure(0.5 * w, 0)
              .add(new go.PathSegment(go.PathSegment.Line, 0, 0.5 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, h))
              .add(new go.PathSegment(go.PathSegment.Line, w, 0.5 * h).close()))
         .setSpots(0.25, 0.25, 0.75, 0.75)
})

go.Shape.defineFigureGenerator('LineH', function (shape, w, h) {  // predefined in 2.0
  var geo = new go.Geometry(go.Geometry.Line)
  geo.startX = 0
  geo.startY = h / 2
  geo.endX = w
  geo.endY = h / 2
  return geo
})

go.Shape.defineFigureGenerator('LineV', function (shape, w, h) {  // predefined in 2.0
  var geo = new go.Geometry(go.Geometry.Line)
  geo.startX = w / 2
  geo.startY = 0
  geo.endX = w / 2
  geo.endY = h
  return geo
})

go.Shape.defineFigureGenerator('BarH', 'Rectangle')  // predefined in 2.0
go.Shape.defineFigureGenerator('BarV', 'Rectangle')  // predefined in 2.0
go.Shape.defineFigureGenerator('MinusLine', 'LineH')  // predefined in 2.0

go.Shape.defineFigureGenerator('PlusLine', function (shape, w, h) {  // predefined in 2.0
  return new go.Geometry()
         .add(new go.PathFigure(0, h / 2, false)
              .add(new go.PathSegment(go.PathSegment.Line, w, h / 2))
              .add(new go.PathSegment(go.PathSegment.Move, w / 2, 0))
              .add(new go.PathSegment(go.PathSegment.Line, w / 2, h)))
})

go.Shape.defineFigureGenerator('XLine', function (shape, w, h) {  // predefined in 2.0
  return new go.Geometry()
         .add(new go.PathFigure(0, h, false)
              .add(new go.PathSegment(go.PathSegment.Line, w, 0))
              .add(new go.PathSegment(go.PathSegment.Move, 0, 0))
              .add(new go.PathSegment(go.PathSegment.Line, w, h)))
})

// OPTIONAL figures, not predefined in the v2.0 library:

go.Shape.defineFigureGenerator('AsteriskLine', function (shape, w, h) {
  var offset = 0.2 / Math.SQRT2
  return new go.Geometry()
         .add(new go.PathFigure(offset * w, (1 - offset) * h, false)
              .add(new go.PathSegment(go.PathSegment.Line, (1 - offset) * w, offset * h))
              .add(new go.PathSegment(go.PathSegment.Move, offset * w, offset * h))
              .add(new go.PathSegment(go.PathSegment.Line, (1 - offset) * w, (1 - offset) * h))
              .add(new go.PathSegment(go.PathSegment.Move, 0, h / 2))
              .add(new go.PathSegment(go.PathSegment.Line, w, h / 2))
              .add(new go.PathSegment(go.PathSegment.Move, w / 2, 0))
              .add(new go.PathSegment(go.PathSegment.Line, w / 2, h)))
})

go.Shape.defineFigureGenerator('CircleLine', function (shape, w, h) {
  var rad = w / 2
  var geo = new go.Geometry()
         .add(new go.PathFigure(w, w / 2, false)  // clockwise
              .add(new go.PathSegment(go.PathSegment.Arc, 0, 360, rad, rad, rad, rad).close()))
  geo.spot1 = GeneratorEllipseSpot1
  geo.spot2 = GeneratorEllipseSpot2
  geo.defaultStretch = go.GraphObject.Uniform
  return geo
})

go.Shape.defineFigureGenerator('Line1', function (shape, w, h) {
  var geo = new go.Geometry(go.Geometry.Line)
  geo.startX = 0
  geo.startY = 0
  geo.endX = w
  geo.endY = h
  return geo
})

go.Shape.defineFigureGenerator('Line2', function (shape, w, h) {
  var geo = new go.Geometry(go.Geometry.Line)
  geo.startX = w
  geo.startY = 0
  geo.endX = 0
  geo.endY = h
  return geo
})

go.Shape.defineFigureGenerator('Curve1', function (shape, w, h) {
  return new go.Geometry()
         .add(new go.PathFigure(0, 0, false)
              .add(new go.PathSegment(go.PathSegment.Bezier, w, h, KAPPA * w, 0, w, (1 - KAPPA) * h)))
})

go.Shape.defineFigureGenerator('Curve2', function (shape, w, h) {
  return new go.Geometry()
         .add(new go.PathFigure(0, 0, false)
              .add(new go.PathSegment(go.PathSegment.Bezier, w, h, 0, KAPPA * h, (1 - KAPPA) * w, h)))
})

go.Shape.defineFigureGenerator('Curve3', function (shape, w, h) {
  return new go.Geometry()
         .add(new go.PathFigure(w, 0, false)
              .add(new go.PathSegment(go.PathSegment.Bezier, 0, h, w, KAPPA * h, KAPPA * w, h)))
})

go.Shape.defineFigureGenerator('Curve4', function (shape, w, h) {
  return new go.Geometry()
         .add(new go.PathFigure(w, 0, false)
              .add(new go.PathSegment(go.PathSegment.Bezier, 0, h, (1 - KAPPA) * w, 0, 0, (1 - KAPPA) * h)))
})

go.Shape.defineFigureGenerator('TriangleDownLeft', function (shape, w, h) {
  return new go.Geometry()
         .add(new go.PathFigure(0, 0, true)
              .add(new go.PathSegment(go.PathSegment.Line, w, h))
              .add(new go.PathSegment(go.PathSegment.Line, 0, h).close()))
         .setSpots(0, 0.5, 0.5, 1)
})

go.Shape.defineFigureGenerator('TriangleDownRight', function (shape, w, h) {
  return new go.Geometry()
         .add(new go.PathFigure(w, 0, true)
              .add(new go.PathSegment(go.PathSegment.Line, w, h))
              .add(new go.PathSegment(go.PathSegment.Line, 0, h).close()))
         .setSpots(0.5, 0.5, 1, 1)
})

go.Shape.defineFigureGenerator('TriangleUpLeft', function (shape, w, h) {
  return new go.Geometry()
         .add(new go.PathFigure(0, 0, true)
              .add(new go.PathSegment(go.PathSegment.Line, w, 0))
              .add(new go.PathSegment(go.PathSegment.Line, 0, h).close()))
         .setSpots(0, 0, 0.5, 0.5)
})

go.Shape.defineFigureGenerator('TriangleUpRight', function (shape, w, h) {
  return new go.Geometry()
         .add(new go.PathFigure(0, 0, true)
              .add(new go.PathSegment(go.PathSegment.Line, w, 0))
              .add(new go.PathSegment(go.PathSegment.Line, w, h).close()))
         .setSpots(0.5, 0, 1, 0.5)
})

go.Shape.defineFigureGenerator('RightTriangle', 'TriangleDownLeft')

go.Shape.setFigureParameter('Parallelogram1', 0, new FigureParameter('Indent', 10, -Infinity, Infinity))
go.Shape.defineFigureGenerator('Parallelogram1', function (shape, w, h) {
  var param1 = shape ? shape.parameter1 : NaN
  // Topleft corner's x distance from leftmost point
  if (isNaN(param1)) param1 = 10 // default value
  else if (param1 < -w) param1 = -w
  else if (param1 > w) param1 = w
  var indent = Math.abs(param1)

  if (param1 === 0) {
    var geo = new go.Geometry(go.Geometry.Rectangle)
    geo.startX = 0
    geo.startY = 0
    geo.endX = w
    geo.endY = h
    return geo
  } else {
    var geo = new go.Geometry()
    if (param1 > 0) {
      geo.add(new go.PathFigure(indent, 0)
                  .add(new go.PathSegment(go.PathSegment.Line, w, 0))
                  .add(new go.PathSegment(go.PathSegment.Line, w - indent, h))
                  .add(new go.PathSegment(go.PathSegment.Line, 0, h).close()))
    } else {  // param1 < 0
      geo.add(new go.PathFigure(0, 0)
                  .add(new go.PathSegment(go.PathSegment.Line, w - indent, 0))
                  .add(new go.PathSegment(go.PathSegment.Line, w, h))
                  .add(new go.PathSegment(go.PathSegment.Line, indent, h).close()))
    }
    if (indent < w / 2) {
      geo.setSpots(indent / w, 0, (w - indent) / w, 1)
    }
    return geo
  }
})

go.Shape.setFigureParameter('Parallelogram2', 0, new FigureParameter('IndentFraction', 0.2, -0.999, 0.999))
go.Shape.defineFigureGenerator('Parallelogram2', function (shape, w, h) {
  var param1 = shape ? shape.parameter1 : NaN
  // Topleft corner's x distance from leftmost point
  if (isNaN(param1)) param1 = 0.1 // default value
  else if (param1 < -1) param1 = -1
  else if (param1 > 1) param1 = 1
  var indent = Math.abs(param1) * w

  if (param1 === 0) {
    var geo = new go.Geometry(go.Geometry.Rectangle)
    geo.startX = 0
    geo.startY = 0
    geo.endX = w
    geo.endY = h
    return geo
  } else {
    var geo = new go.Geometry()
    if (param1 > 0) {
      geo.add(new go.PathFigure(indent, 0)
                  .add(new go.PathSegment(go.PathSegment.Line, w, 0))
                  .add(new go.PathSegment(go.PathSegment.Line, w - indent, h))
                  .add(new go.PathSegment(go.PathSegment.Line, 0, h).close()))
    } else {  // param1 < 0
      geo.add(new go.PathFigure(0, 0)
                  .add(new go.PathSegment(go.PathSegment.Line, w - indent, 0))
                  .add(new go.PathSegment(go.PathSegment.Line, w, h))
                  .add(new go.PathSegment(go.PathSegment.Line, indent, h).close()))
    }
    if (indent < w / 2) {
      geo.setSpots(indent / w, 0, (w - indent) / w, 1)
    }
    return geo
  }
})

go.Shape.defineFigureGenerator('Parallelogram', 'Parallelogram1')

go.Shape.setFigureParameter('Trapezoid1', 0, new FigureParameter('Indent', 10, -Infinity, Infinity))
go.Shape.defineFigureGenerator('Trapezoid1', function (shape, w, h) {
  var param1 = shape ? shape.parameter1 : NaN
  // Distance from topleft of bounding rectangle,
  // in % of the total width, of the topleft corner
  if (isNaN(param1)) param1 = 10 // default value
  else if (param1 < -w) param1 = -w / 2
  else if (param1 > w) param1 = w / 2
  var indent = Math.abs(param1)

  if (param1 === 0) {
    var geo = new go.Geometry(go.Geometry.Rectangle)
    geo.startX = 0
    geo.startY = 0
    geo.endX = w
    geo.endY = h
    return geo
  } else {
    var geo = new go.Geometry()
    if (param1 > 0) {
      geo.add(new go.PathFigure(indent, 0)
                  .add(new go.PathSegment(go.PathSegment.Line, w - indent, 0))
                  .add(new go.PathSegment(go.PathSegment.Line, w, h))
                  .add(new go.PathSegment(go.PathSegment.Line, 0, h).close()))
    } else {  // param1 < 0
      geo.add(new go.PathFigure(0, 0)
                  .add(new go.PathSegment(go.PathSegment.Line, w, 0))
                  .add(new go.PathSegment(go.PathSegment.Line, w - indent, h))
                  .add(new go.PathSegment(go.PathSegment.Line, indent, h).close()))
    }
    if (indent < w / 2) {
      geo.setSpots(indent / w, 0, (w - indent) / w, 1)
    }
    return geo
  }
})

go.Shape.setFigureParameter('Trapezoid2', 0, new FigureParameter('IndentFraction', 0.2, -0.999, 0.999))
go.Shape.defineFigureGenerator('Trapezoid2', function (shape, w, h) {
  var param1 = shape ? shape.parameter1 : NaN
  // Distance from topleft of bounding rectangle,
  // in % of the total width, of the topleft corner
  if (isNaN(param1)) param1 = 0.2 // default value
  else if (param1 < 0.5) param1 = -0.5
  else if (param1 > 0.5) param1 = 0.5
  var indent = Math.abs(param1) * w

  if (param1 === 0) {
    var geo = new go.Geometry(go.Geometry.Rectangle)
    geo.startX = 0
    geo.startY = 0
    geo.endX = w
    geo.endY = h
    return geo
  } else {
    var geo = new go.Geometry()
    if (param1 > 0) {
      geo.add(new go.PathFigure(indent, 0)
                  .add(new go.PathSegment(go.PathSegment.Line, w - indent, 0))
                  .add(new go.PathSegment(go.PathSegment.Line, w, h))
                  .add(new go.PathSegment(go.PathSegment.Line, 0, h).close()))
    } else {  // param1 < 0
      geo.add(new go.PathFigure(0, 0)
                  .add(new go.PathSegment(go.PathSegment.Line, w, 0))
                  .add(new go.PathSegment(go.PathSegment.Line, w - indent, h))
                  .add(new go.PathSegment(go.PathSegment.Line, indent, h).close()))
    }
    if (indent < w / 2) {
      geo.setSpots(indent / w, 0, (w - indent) / w, 1)
    }
    return geo
  }
})

go.Shape.setFigureParameter('ManualOperation', 0, new FigureParameter('Indent', 10, -Infinity, Infinity))
go.Shape.defineFigureGenerator('ManualOperation', function (shape, w, h) {
  var param1 = shape ? shape.parameter1 : NaN
  // Distance from topleft of bounding rectangle,
  // in % of the total width, of the topleft corner
  if (isNaN(param1)) param1 = 10 // default value
  else if (param1 < -w) param1 = -w / 2
  else if (param1 > w) param1 = w / 2
  var indent = Math.abs(param1)

  if (param1 === 0) {
    var geo = new go.Geometry(go.Geometry.Rectangle)
    geo.startX = 0
    geo.startY = 0
    geo.endX = w
    geo.endY = h
    return geo
  } else {
    var geo = new go.Geometry()
    if (param1 > 0) {
      geo.add(new go.PathFigure(0, 0)
                  .add(new go.PathSegment(go.PathSegment.Line, w, 0))
                  .add(new go.PathSegment(go.PathSegment.Line, w - indent, h))
                  .add(new go.PathSegment(go.PathSegment.Line, indent, h).close()))
    } else {  // param1 < 0
      geo.add(new go.PathFigure(indent, 0)
                  .add(new go.PathSegment(go.PathSegment.Line, w - indent, 0))
                  .add(new go.PathSegment(go.PathSegment.Line, w, h))
                  .add(new go.PathSegment(go.PathSegment.Line, 0, h).close()))
    }
    if (indent < w / 2) {
      geo.setSpots(indent / w, 0, (w - indent) / w, 1)
    }
    return geo
  }
})

go.Shape.defineFigureGenerator('Trapezoid', 'Trapezoid1')

// The following functions are used by a group of regular figures that are defined below:

/** @ignore */
var _CachedArrays = []

/**
  * @ignore
  * @return {Array}
  */
function tempArray () {
  var temp = _CachedArrays.pop()
  if (temp === undefined) return []
  return temp
};

/**
  * @ignore
  * @param {Array} a
  */
function freeArray (a) {
  a.length = 0  // clear any references to objects
  _CachedArrays.push(a)
};

/**
* @ignore
* This allocates a temporary Array that should be freeArray()'ed by the caller.
* @param {number} sides
* @return {Array}
*/
function createPolygon (sides) {
  // Point[] points = new Point[sides + 1];
  var points = tempArray()
  var radius = 0.5
  var center = 0.5
  var offsetAngle = Math.PI * 1.5
  var angle = 0

  // Loop through each side of the polygon
  for (var i = 0; i < sides; i++) {
    angle = 2 * Math.PI / sides * i + offsetAngle
    points[i] = new go.Point((center + radius * Math.cos(angle)), (center + radius * Math.sin(angle)))
  }

  // Add the last line
  // points[points.length - 1] = points[0];
  points.push(points[0])
  return points
};

/**
* @ignore
* This allocates a temporary Array that should be freeArray()'ed by the caller.
* @param {number} points
* @return {Array}
*/
function createBurst (points) {
  var star = createStar(points)
  var pts = tempArray() // new Point[points * 3 + 1];

  pts[0] = star[0]
  for (var i = 1, count = 1; i < star.length; i += 2, count += 3) {
    pts[count] = star[i]
    pts[count + 1] = star[i]
    pts[count + 2] = star[i + 1]
  }

  freeArray(star)
  return pts
};

/**
* @ignore
* This allocates a temporary Array that should be freeArray()'ed by the caller.
* @param {number} points
* @return {Array}
*/
function createStar (points) {
  // First, create a regular polygon
  var polygon = createPolygon(points)
  // Calculate the points inbetween
  var pts = tempArray() // new Point[points * 2 + 1];

  var half = Math.floor(polygon.length / 2)
  var count = polygon.length - 1
  var offset = (points % 2 === 0) ? 2 : 1

  for (var i = 0; i < count; i++) {
    // Get the intersection of two lines
    var p0 = polygon[i]
    var p1 = polygon[i + 1]
    var q21 = polygon[(half + i - 1) % count]
    var q2off = polygon[(half + i + offset) % count]
    pts[i * 2] = p0
    pts[i * 2 + 1] = getIntersection(p0.x, p0.y,
      q21.x, q21.y,
      p1.x, p1.y,
      q2off.x, q2off.y, new go.Point())  // ?? not currently managed
  }

  pts[pts.length] = pts[0]

  freeArray(polygon)
  return pts
};

go.Shape.defineFigureGenerator('Pentagon', function (shape, w, h) {
  var points = createPolygon(5)
  var geo = new go.Geometry()
  var fig = new go.PathFigure(points[0].x * w, points[0].y * h, true)
  geo.add(fig)

  for (var i = 1; i < 5; i++) {
    fig.add(new go.PathSegment(go.PathSegment.Line, points[i].x * w, points[i].y * h))
  }
  fig.add(new go.PathSegment(go.PathSegment.Line, points[0].x * w, points[0].y * h).close())
  freeArray(points)
  geo.spot1 = new go.Spot(0.2, 0.22)
  geo.spot2 = new go.Spot(0.8, 0.9)
  return geo
})

go.Shape.defineFigureGenerator('Hexagon', function (shape, w, h) {
  var points = createPolygon(6)
  var geo = new go.Geometry()
  var fig = new go.PathFigure(points[0].x * w, points[0].y * h, true)
  geo.add(fig)

  for (var i = 1; i < 6; i++) {
    fig.add(new go.PathSegment(go.PathSegment.Line, points[i].x * w, points[i].y * h))
  }
  fig.add(new go.PathSegment(go.PathSegment.Line, points[0].x * w, points[0].y * h).close())
  freeArray(points)
  geo.spot1 = new go.Spot(0.07, 0.25)
  geo.spot2 = new go.Spot(0.93, 0.75)
  return geo
})

go.Shape.defineFigureGenerator('Heptagon', function (shape, w, h) {
  var points = createPolygon(7)
  var geo = new go.Geometry()
  var fig = new go.PathFigure(points[0].x * w, points[0].y * h, true)
  geo.add(fig)

  for (var i = 1; i < 7; i++) {
    fig.add(new go.PathSegment(go.PathSegment.Line, points[i].x * w, points[i].y * h))
  }
  fig.add(new go.PathSegment(go.PathSegment.Line, points[0].x * w, points[0].y * h).close())
  freeArray(points)
  geo.spot1 = new go.Spot(0.2, 0.15)
  geo.spot2 = new go.Spot(0.8, 0.85)
  return geo
})

go.Shape.defineFigureGenerator('Octagon', function (shape, w, h) {
  var points = createPolygon(8)
  var geo = new go.Geometry()
  var fig = new go.PathFigure(points[0].x * w, points[0].y * h, true)
  geo.add(fig)

  for (var i = 1; i < 8; i++) {
    fig.add(new go.PathSegment(go.PathSegment.Line, points[i].x * w, points[i].y * h))
  }
  fig.add(new go.PathSegment(go.PathSegment.Line, points[0].x * w, points[0].y * h).close())
  freeArray(points)
  geo.spot1 = new go.Spot(0.15, 0.15)
  geo.spot2 = new go.Spot(0.85, 0.85)
  return geo
})

go.Shape.defineFigureGenerator('Nonagon', function (shape, w, h) {
  var points = createPolygon(9)
  var geo = new go.Geometry()
  var fig = new go.PathFigure(points[0].x * w, points[0].y * h, true)
  geo.add(fig)

  for (var i = 1; i < 9; i++) {
    fig.add(new go.PathSegment(go.PathSegment.Line, points[i].x * w, points[i].y * h))
  }
  fig.add(new go.PathSegment(go.PathSegment.Line, points[0].x * w, points[0].y * h).close())
  freeArray(points)
  geo.spot1 = new go.Spot(0.17, 0.13)
  geo.spot2 = new go.Spot(0.82, 0.82)
  return geo
})

go.Shape.defineFigureGenerator('Decagon', function (shape, w, h) {
  var points = createPolygon(10)
  var geo = new go.Geometry()
  var fig = new go.PathFigure(points[0].x * w, points[0].y * h, true)
  geo.add(fig)

  for (var i = 1; i < 10; i++) {
    fig.add(new go.PathSegment(go.PathSegment.Line, points[i].x * w, points[i].y * h))
  }
  fig.add(new go.PathSegment(go.PathSegment.Line, points[0].x * w, points[0].y * h).close())
  freeArray(points)
  geo.spot1 = new go.Spot(0.16, 0.16)
  geo.spot2 = new go.Spot(0.84, 0.84)
  return geo
})

go.Shape.defineFigureGenerator('Dodecagon', function (shape, w, h) {
  var points = createPolygon(12)
  var geo = new go.Geometry()
  var fig = new go.PathFigure(points[0].x * w, points[0].y * h, true)
  geo.add(fig)

  for (var i = 1; i < 12; i++) {
    fig.add(new go.PathSegment(go.PathSegment.Line, points[i].x * w, points[i].y * h))
  }
  fig.add(new go.PathSegment(go.PathSegment.Line, points[0].x * w, points[0].y * h).close())
  freeArray(points)
  geo.spot1 = new go.Spot(0.16, 0.16)
  geo.spot2 = new go.Spot(0.84, 0.84)
  return geo
})

go.Shape.defineFigureGenerator('FivePointedStar', function (shape, w, h) {
  var starPoints = createStar(5)
  var geo = new go.Geometry()
  var fig = new go.PathFigure(starPoints[0].x * w, starPoints[0].y * h, true)
  geo.add(fig)

  for (var i = 1; i < 10; i++) {
    fig.add(new go.PathSegment(go.PathSegment.Line, starPoints[i].x * w, starPoints[i].y * h))
  }
  fig.add(new go.PathSegment(go.PathSegment.Line, starPoints[0].x * w, starPoints[0].y * h).close())
  freeArray(starPoints)
  geo.spot1 = new go.Spot(0.266, 0.333)
  geo.spot2 = new go.Spot(0.733, 0.733)
  return geo
})

go.Shape.defineFigureGenerator('SixPointedStar', function (shape, w, h) {
  var starPoints = createStar(6)
  var geo = new go.Geometry()
  var fig = new go.PathFigure(starPoints[0].x * w, starPoints[0].y * h, true)
  geo.add(fig)

  for (var i = 1; i < 12; i++) {
    fig.add(new go.PathSegment(go.PathSegment.Line, starPoints[i].x * w, starPoints[i].y * h))
  }
  fig.add(new go.PathSegment(go.PathSegment.Line, starPoints[0].x * w, starPoints[0].y * h).close())
  freeArray(starPoints)
  geo.spot1 = new go.Spot(0.17, 0.25)
  geo.spot2 = new go.Spot(0.83, 0.75)
  return geo
})

go.Shape.defineFigureGenerator('SevenPointedStar', function (shape, w, h) {
  var starPoints = createStar(7)
  var geo = new go.Geometry()
  var fig = new go.PathFigure(starPoints[0].x * w, starPoints[0].y * h, true)
  geo.add(fig)

  for (var i = 1; i < 14; i++) {
    fig.add(new go.PathSegment(go.PathSegment.Line, starPoints[i].x * w, starPoints[i].y * h))
  }
  fig.add(new go.PathSegment(go.PathSegment.Line, starPoints[0].x * w, starPoints[0].y * h).close())
  freeArray(starPoints)
  geo.spot1 = new go.Spot(0.222, 0.277)
  geo.spot2 = new go.Spot(0.777, 0.666)
  return geo
})

go.Shape.defineFigureGenerator('EightPointedStar', function (shape, w, h) {
  var starPoints = createStar(8)
  var geo = new go.Geometry()
  var fig = new go.PathFigure(starPoints[0].x * w, starPoints[0].y * h, true)
  geo.add(fig)

  for (var i = 1; i < 16; i++) {
    fig.add(new go.PathSegment(go.PathSegment.Line, starPoints[i].x * w, starPoints[i].y * h))
  }
  fig.add(new go.PathSegment(go.PathSegment.Line, starPoints[0].x * w, starPoints[0].y * h).close())
  freeArray(starPoints)
  geo.spot1 = new go.Spot(0.25, 0.25)
  geo.spot2 = new go.Spot(0.75, 0.75)
  return geo
})

go.Shape.defineFigureGenerator('NinePointedStar', function (shape, w, h) {
  var starPoints = createStar(9)
  var geo = new go.Geometry()
  var fig = new go.PathFigure(starPoints[0].x * w, starPoints[0].y * h, true)
  geo.add(fig)

  for (var i = 1; i < 18; i++) {
    fig.add(new go.PathSegment(go.PathSegment.Line, starPoints[i].x * w, starPoints[i].y * h))
  }
  fig.add(new go.PathSegment(go.PathSegment.Line, starPoints[0].x * w, starPoints[0].y * h).close())
  freeArray(starPoints)
  geo.spot1 = new go.Spot(0.222, 0.277)
  geo.spot2 = new go.Spot(0.777, 0.666)
  return geo
})

go.Shape.defineFigureGenerator('TenPointedStar', function (shape, w, h) {
  var starPoints = createStar(10)
  var geo = new go.Geometry()
  var fig = new go.PathFigure(starPoints[0].x * w, starPoints[0].y * h, true)
  geo.add(fig)

  for (var i = 1; i < 20; i++) {
    fig.add(new go.PathSegment(go.PathSegment.Line, starPoints[i].x * w, starPoints[i].y * h))
  }
  fig.add(new go.PathSegment(go.PathSegment.Line, starPoints[0].x * w, starPoints[0].y * h).close())
  freeArray(starPoints)
  geo.spot1 = new go.Spot(0.281, 0.261)
  geo.spot2 = new go.Spot(0.723, 0.748)
  return geo
})

go.Shape.defineFigureGenerator('FivePointedBurst', function (shape, w, h) {
  var burstPoints = createBurst(5)
  var geo = new go.Geometry()
  var fig = new go.PathFigure(burstPoints[0].x * w, burstPoints[0].y * h, true)
  geo.add(fig)

  for (var i = 1; i < burstPoints.length; i += 3) {
    fig.add(new go.PathSegment(go.PathSegment.Bezier, burstPoints[i + 2].x * w,
      burstPoints[i + 2].y * h, burstPoints[i].x * w,
      burstPoints[i].y * h, burstPoints[i + 1].x * w,
      burstPoints[i + 1].y * h))
  }
  fig.segments.last().close()
  freeArray(burstPoints)
  geo.spot1 = new go.Spot(0.222, 0.277)
  geo.spot2 = new go.Spot(0.777, 0.777)
  return geo
})

go.Shape.defineFigureGenerator('SixPointedBurst', function (shape, w, h) {
  var burstPoints = createBurst(6)
  var geo = new go.Geometry()
  var fig = new go.PathFigure(burstPoints[0].x * w, burstPoints[0].y * h, true)
  geo.add(fig)

  for (var i = 1; i < burstPoints.length; i += 3) {
    fig.add(new go.PathSegment(go.PathSegment.Bezier, burstPoints[i + 2].x * w,
      burstPoints[i + 2].y * h, burstPoints[i].x * w,
      burstPoints[i].y * h, burstPoints[i + 1].x * w,
      burstPoints[i + 1].y * h))
  }
  fig.segments.last().close()
  freeArray(burstPoints)
  geo.spot1 = new go.Spot(0.170, 0.222)
  geo.spot2 = new go.Spot(0.833, 0.777)
  return geo
})

go.Shape.defineFigureGenerator('SevenPointedBurst', function (shape, w, h) {
  var burstPoints = createBurst(7)
  var geo = new go.Geometry()
  var fig = new go.PathFigure(burstPoints[0].x * w, burstPoints[0].y * h, true)
  geo.add(fig)

  for (var i = 1; i < burstPoints.length; i += 3) {
    fig.add(new go.PathSegment(go.PathSegment.Bezier, burstPoints[i + 2].x * w,
      burstPoints[i + 2].y * h, burstPoints[i].x * w,
      burstPoints[i].y * h, burstPoints[i + 1].x * w,
      burstPoints[i + 1].y * h))
  }
  fig.segments.last().close()
  freeArray(burstPoints)
  geo.spot1 = new go.Spot(0.222, 0.222)
  geo.spot2 = new go.Spot(0.777, 0.777)
  return geo
})

go.Shape.defineFigureGenerator('EightPointedBurst', function (shape, w, h) {
  var burstPoints = createBurst(8)
  var geo = new go.Geometry()
  var fig = new go.PathFigure(burstPoints[0].x * w, burstPoints[0].y * h, true)
  geo.add(fig)

  for (var i = 1; i < burstPoints.length; i += 3) {
    fig.add(new go.PathSegment(go.PathSegment.Bezier, burstPoints[i + 2].x * w,
      burstPoints[i + 2].y * h, burstPoints[i].x * w,
      burstPoints[i].y * h, burstPoints[i + 1].x * w,
      burstPoints[i + 1].y * h))
  }
  fig.segments.last().close()
  freeArray(burstPoints)
  geo.spot1 = new go.Spot(0.222, 0.222)
  geo.spot2 = new go.Spot(0.777, 0.777)
  return geo
})

go.Shape.defineFigureGenerator('NinePointedBurst', function (shape, w, h) {
  var burstPoints = createBurst(9)
  var geo = new go.Geometry()
  var fig = new go.PathFigure(burstPoints[0].x * w, burstPoints[0].y * h, true)
  geo.add(fig)

  for (var i = 1; i < burstPoints.length; i += 3) {
    fig.add(new go.PathSegment(go.PathSegment.Bezier, burstPoints[i + 2].x * w,
      burstPoints[i + 2].y * h, burstPoints[i].x * w,
      burstPoints[i].y * h, burstPoints[i + 1].x * w,
      burstPoints[i + 1].y * h))
  }
  fig.segments.last().close()
  freeArray(burstPoints)
  geo.spot1 = new go.Spot(0.222, 0.222)
  geo.spot2 = new go.Spot(0.777, 0.777)
  return geo
})

go.Shape.defineFigureGenerator('TenPointedBurst', function (shape, w, h) {
  var burstPoints = createBurst(10)
  var geo = new go.Geometry()
  var fig = new go.PathFigure(burstPoints[0].x * w, burstPoints[0].y * h, true)
  geo.add(fig)

  for (var i = 1; i < burstPoints.length; i += 3) {
    fig.add(new go.PathSegment(go.PathSegment.Bezier, burstPoints[i + 2].x * w,
      burstPoints[i + 2].y * h, burstPoints[i].x * w,
      burstPoints[i].y * h, burstPoints[i + 1].x * w,
      burstPoints[i + 1].y * h))
  }
  fig.segments.last().close()
  freeArray(burstPoints)
  geo.spot1 = new go.Spot(0.222, 0.222)
  geo.spot2 = new go.Spot(0.777, 0.777)
  return geo
})

go.Shape.setFigureParameter('FramedRectangle', 0, new FigureParameter('ThicknessX', 8))
go.Shape.setFigureParameter('FramedRectangle', 1, new FigureParameter('ThicknessY', 8))
go.Shape.defineFigureGenerator('FramedRectangle', function (shape, w, h) {
  var param1 = shape ? shape.parameter1 : NaN
  var param2 = shape ? shape.parameter2 : NaN
  if (isNaN(param1)) param1 = 8 // default values PARAMETER 1 is for WIDTH
  if (isNaN(param2)) param2 = 8 // default values PARAMETER 2 is for HEIGHT

  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, 0, true)
  geo.add(fig)
  // outer rectangle, clockwise
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close())
  if (param1 < w / 2 && param2 < h / 2) {
    // inner rectangle, counter-clockwise
    fig.add(new go.PathSegment(go.PathSegment.Move, param1, param2))  // subpath
    fig.add(new go.PathSegment(go.PathSegment.Line, param1, h - param2))
    fig.add(new go.PathSegment(go.PathSegment.Line, w - param1, h - param2))
    fig.add(new go.PathSegment(go.PathSegment.Line, w - param1, param2).close())
  }
  geo.setSpots(0, 0, 1, 1, param1, param2, -param1, -param2)
  return geo
})

go.Shape.setFigureParameter('Ring', 0, new FigureParameter('Thickness', 8))
go.Shape.defineFigureGenerator('Ring', function (shape, w, h) {
  var param1 = shape ? shape.parameter1 : NaN
  if (isNaN(param1) || param1 < 0) param1 = 8

  var rad = w / 2
  var geo = new go.Geometry()
  var fig = new go.PathFigure(w, w / 2, true)  // clockwise
  geo.add(fig)
  fig.add(new go.PathSegment(go.PathSegment.Arc, 0, 360, rad, rad, rad, rad).close())

  var rad2 = Math.max(rad - param1, 0)
  if (rad2 > 0) {  // counter-clockwise
    fig.add(new go.PathSegment(go.PathSegment.Move, w / 2 + rad2, w / 2))
    fig.add(new go.PathSegment(go.PathSegment.Arc, 0, -360, rad, rad, rad2, rad2).close())
  }
  geo.spot1 = GeneratorEllipseSpot1
  geo.spot2 = GeneratorEllipseSpot2
  geo.defaultStretch = go.GraphObject.Uniform
  return geo
})

go.Shape.defineFigureGenerator('Cloud', function (shape, w, h) {
  return new go.Geometry()
         .add(new go.PathFigure(0.08034461 * w, 0.1944299 * h, true)
              .add(new go.PathSegment(go.PathSegment.Bezier,
                                      0.2008615 * w, 0.05349299 * h, -0.09239631 * w, 0.07836421 * h, 0.1406031 * w, -0.0542823 * h))
              .add(new go.PathSegment(go.PathSegment.Bezier,
                                      0.4338609 * w, 0.074219 * h, 0.2450511 * w, -0.00697547 * h, 0.3776197 * w, -0.01112067 * h))
              .add(new go.PathSegment(go.PathSegment.Bezier,
                                      0.6558228 * w, 0.07004196 * h, 0.4539471 * w, 0, 0.6066018 * w, -0.02526587 * h))
              .add(new go.PathSegment(go.PathSegment.Bezier,
                                      0.8921095 * w, 0.08370865 * h, 0.6914277 * w, -0.01904177 * h, 0.8921095 * w, -0.01220843 * h))
              .add(new go.PathSegment(go.PathSegment.Bezier,
                                      0.9147671 * w, 0.3194596 * h, 1.036446 * w, 0.04105738 * h, 1.020377 * w, 0.3022052 * h))
              .add(new go.PathSegment(go.PathSegment.Bezier,
                                      0.9082935 * w, 0.562044 * h, 1.04448 * w, 0.360238 * h, 0.992256 * w, 0.5219009 * h))
              .add(new go.PathSegment(go.PathSegment.Bezier,
                                      0.9212406 * w, 0.8217117 * h, 1.032337 * w, 0.5771781 * h, 1.018411 * w, 0.8120651 * h))
              .add(new go.PathSegment(go.PathSegment.Bezier,
                                      0.7592566 * w, 0.9156953 * h, 1.028411 * w, 0.9571472 * h, 0.8556702 * w, 1.052487 * h))
              .add(new go.PathSegment(go.PathSegment.Bezier,
                                      0.5101666 * w, 0.9310455 * h, 0.7431877 * w, 1.009325 * h, 0.5624123 * w, 1.021761 * h))
              .add(new go.PathSegment(go.PathSegment.Bezier,
                                      0.2609328 * w, 0.9344623 * h, 0.4820677 * w, 1.031761 * h, 0.3030112 * w, 1.002796 * h))
              .add(new go.PathSegment(go.PathSegment.Bezier,
                                      0.08034461 * w, 0.870098 * h, 0.2329994 * w, 1.01518 * h, 0.03213784 * w, 1.01518 * h))
              .add(new go.PathSegment(go.PathSegment.Bezier,
                                      0.06829292 * w, 0.6545475 * h, -0.02812061 * w, 0.9032597 * h, -0.01205169 * w, 0.6835638 * h))
              .add(new go.PathSegment(go.PathSegment.Bezier,
                                      0.06427569 * w, 0.4265613 * h, -0.01812061 * w, 0.6089503 * h, -0.00606892 * w, 0.4555777 * h))
              .add(new go.PathSegment(go.PathSegment.Bezier,
                                      0.08034461 * w, 0.1944299 * h, -0.01606892 * w, 0.3892545 * h, -0.01205169 * w, 0.1944299 * h)))
         .setSpots(0.1, 0.1, 0.9, 0.9)
})

go.Shape.defineFigureGenerator('StopSign', function (shape, w, h) {
  var part = 1 / (Math.SQRT2 + 2)
  return new go.Geometry()
         .add(new go.PathFigure(part * w, 0, true)
              .add(new go.PathSegment(go.PathSegment.Line, (1 - part) * w, 0))
              .add(new go.PathSegment(go.PathSegment.Line, w, part * h))
              .add(new go.PathSegment(go.PathSegment.Line, w, (1 - part) * h))
              .add(new go.PathSegment(go.PathSegment.Line, (1 - part) * w, h))
              .add(new go.PathSegment(go.PathSegment.Line, part * w, h))
              .add(new go.PathSegment(go.PathSegment.Line, 0, (1 - part) * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0, part * h).close()))
         .setSpots(part / 2, part / 2, 1 - part / 2, 1 - part / 2)
})

go.Shape.setFigureParameter('Pie', 0, new FigureParameter('Start', 0, -360, 360))
go.Shape.setFigureParameter('Pie', 1, new FigureParameter('Sweep', 315, -360, 360))
go.Shape.defineFigureGenerator('Pie', function (shape, w, h) {
  var param1 = shape ? shape.parameter1 : NaN
  var param2 = shape ? shape.parameter2 : NaN
  if (isNaN(param1)) param1 = 0 // default values PARAMETER 1 is for Start Angle
  if (isNaN(param2)) param2 = 315 // default values PARAMETER 2 is for Sweep Angle

  var start = param1 % 360
  if (start < 0) start += 360
  var sweep = param2 % 360
  var rad = Math.min(w, h) / 2

  return new go.Geometry()
        .add(new go.PathFigure(rad, rad)  // start point
             .add(new go.PathSegment(go.PathSegment.Arc,
                                     start, sweep,  // angles
                                     rad, rad,  // center
                                     rad, rad)  // radius
                  .close()))
})

go.Shape.setFigureParameter('ThickCross', 0, new FigureParameter('Thickness', 30))
go.Shape.defineFigureGenerator('ThickCross', function (shape, w, h) {
  var param1 = shape ? shape.parameter1 : NaN
  if (isNaN(param1) || param1 < 0) param1 = 30

  var t = Math.min(param1, w) / 2
  var mx = w / 2
  var my = h / 2

  return new go.Geometry()
         .add(new go.PathFigure(mx - t, 0, true)
              .add(new go.PathSegment(go.PathSegment.Line, mx + t, 0))
              .add(new go.PathSegment(go.PathSegment.Line, mx + t, my - t))

              .add(new go.PathSegment(go.PathSegment.Line, w, my - t))
              .add(new go.PathSegment(go.PathSegment.Line, w, my + t))
              .add(new go.PathSegment(go.PathSegment.Line, mx + t, my + t))

              .add(new go.PathSegment(go.PathSegment.Line, mx + t, h))
              .add(new go.PathSegment(go.PathSegment.Line, mx - t, h))
              .add(new go.PathSegment(go.PathSegment.Line, mx - t, my + t))

              .add(new go.PathSegment(go.PathSegment.Line, 0, my + t))
              .add(new go.PathSegment(go.PathSegment.Line, 0, my - t))
              .add(new go.PathSegment(go.PathSegment.Line, mx - t, my - t).close()))
})

go.Shape.setFigureParameter('ThinCross', 0, new FigureParameter('Thickness', 10))
go.Shape.defineFigureGenerator('ThinCross', function (shape, w, h) {
  var param1 = shape ? shape.parameter1 : NaN
  if (isNaN(param1) || param1 < 0) param1 = 10

  var t = Math.min(param1, w) / 2
  var mx = w / 2
  var my = h / 2

  return new go.Geometry()
         .add(new go.PathFigure(mx - t, 0, true)
              .add(new go.PathSegment(go.PathSegment.Line, mx + t, 0))
              .add(new go.PathSegment(go.PathSegment.Line, mx + t, my - t))

              .add(new go.PathSegment(go.PathSegment.Line, w, my - t))
              .add(new go.PathSegment(go.PathSegment.Line, w, my + t))
              .add(new go.PathSegment(go.PathSegment.Line, mx + t, my + t))

              .add(new go.PathSegment(go.PathSegment.Line, mx + t, h))
              .add(new go.PathSegment(go.PathSegment.Line, mx - t, h))
              .add(new go.PathSegment(go.PathSegment.Line, mx - t, my + t))

              .add(new go.PathSegment(go.PathSegment.Line, 0, my + t))
              .add(new go.PathSegment(go.PathSegment.Line, 0, my - t))
              .add(new go.PathSegment(go.PathSegment.Line, mx - t, my - t).close()))
})

go.Shape.setFigureParameter('ThickX', 0, new FigureParameter('Thickness', 30))
go.Shape.defineFigureGenerator('ThickX', function (shape, w, h) {
  var param1 = shape ? shape.parameter1 : NaN
  if (isNaN(param1) || param1 < 0) param1 = 30
  if (w === 0 || h === 0) {
    var geo = new go.Geometry(go.Geometry.Rectangle)
    geo.startX = 0
    geo.startY = 0
    geo.endX = w
    geo.endY = h
    return geo
  } else {
    var w2 = w / 2
    var h2 = h / 2
    var a2 = Math.atan2(h, w)
    var dx = param1 - Math.min(Math.cos(a2) * param1 / 2, w2)
    var dy = param1 - Math.min(Math.sin(a2) * param1 / 2, h2)
    var geo = new go.Geometry()
    var fig = new go.PathFigure(dx, 0, true)
    geo.add(fig)

    fig.add(new go.PathSegment(go.PathSegment.Line, w2, 0.2 * h))
    fig.add(new go.PathSegment(go.PathSegment.Line, w - dx, 0))
    fig.add(new go.PathSegment(go.PathSegment.Line, w, dy))
    fig.add(new go.PathSegment(go.PathSegment.Line, 0.8 * w, h2))
    fig.add(new go.PathSegment(go.PathSegment.Line, w, h - dy))
    fig.add(new go.PathSegment(go.PathSegment.Line, w - dx, h))
    fig.add(new go.PathSegment(go.PathSegment.Line, w2, 0.8 * h))
    fig.add(new go.PathSegment(go.PathSegment.Line, dx, h))
    fig.add(new go.PathSegment(go.PathSegment.Line, 0, h - dy))
    fig.add(new go.PathSegment(go.PathSegment.Line, 0.2 * w, h2))
    fig.add(new go.PathSegment(go.PathSegment.Line, 0, dy).close())
    return geo
  }
})

go.Shape.setFigureParameter('ThinX', 0, new FigureParameter('Thickness', 10))
go.Shape.defineFigureGenerator('ThinX', function (shape, w, h) {
  var param1 = shape ? shape.parameter1 : NaN
  if (isNaN(param1) || param1 < 0) param1 = 10
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0.1 * w, 0, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0.4 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.9 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.1 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.6 * w, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.9 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.9 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0.6 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.1 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.9 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.4 * w, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.1 * h).close())
  return geo
})

// adjust the width of the vertical beam
go.Shape.setFigureParameter('SquareIBeam', 0, new FigureParameter('BeamWidth', 0.2, 0.1, 0.9))
go.Shape.defineFigureGenerator('SquareIBeam', function (shape, w, h) {
  var geo = new go.Geometry()
  var param1 = shape ? shape.parameter1 : NaN
  // Width of the ibeam in % of the total width
  if (isNaN(param1)) param1 = 0.2
  var fig = new go.PathFigure(0, 0, true)
  geo.add(fig)

  var fig = new go.PathFigure(0, 0, true)
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, param1 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, (0.5 + param1 / 2) * w, param1 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, (0.5 + param1 / 2) * w, (1 - param1) * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, (1 - param1) * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, (1 - param1) * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, (0.5 - param1 / 2) * w, (1 - param1) * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, (0.5 - param1 / 2) * w, param1 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, param1 * h).close())
  return geo
})

// parameter allows it easy to adjust the roundness of the curves that cut inward
go.Shape.setFigureParameter('RoundedIBeam', 0, new FigureParameter('SideCurved', 0.5, 0.05, 0.65))
go.Shape.defineFigureGenerator('RoundedIBeam', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, 0, true)
  geo.add(fig)

  var param1 = shape ? shape.parameter1 : NaN
  if (isNaN(param1)) param1 = 0.5 // default value of Parameter1
  // Parameter 1 is based off of the width
  // I guess I will call it "curved"
  // param=.5 = 50% curved
  // .65 has to be the max
  // .05 has to be min, starts to loose roundesss after that
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0)) // top bar
  fig.add(new go.PathSegment(go.PathSegment.Bezier, w, h, Math.abs((1 - param1)) * w, 0.25 * h,
  Math.abs((1 - param1)) * w, 0.75 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, 0, param1 * w, 0.75 * h,
  param1 * w, 0.25 * h).close())
  return geo
})

go.Shape.defineFigureGenerator('HalfEllipse', function (shape, w, h) {
  return new go.Geometry()
         .add(new go.PathFigure(0, 0, true)
              .add(new go.PathSegment(go.PathSegment.Bezier, w, 0.5 * h, KAPPA * w, 0, w, (0.5 - KAPPA / 2) * h))
              .add(new go.PathSegment(go.PathSegment.Bezier, 0, h, w, (0.5 + KAPPA / 2) * h, KAPPA * w, h).close()))
         .setSpots(0, 0.156, 0.844, 0.844)
})

go.Shape.defineFigureGenerator('Crescent', function (shape, w, h) {
  return new go.Geometry()
         .add(new go.PathFigure(0, 0, true)
              .add(new go.PathSegment(go.PathSegment.Bezier,
                                      0, h, w, 0, w, h))
              .add(new go.PathSegment(go.PathSegment.Bezier,
                                      0, 0, 0.5 * w, 0.75 * h, 0.5 * w, 0.25 * h).close()))
         .setSpots(0.311, 0.266, 0.744, 0.744)
})

go.Shape.defineFigureGenerator('Heart', function (shape, w, h) {
  return new go.Geometry()
         .add(new go.PathFigure(0.5 * w, h, true)
              .add(new go.PathSegment(go.PathSegment.Bezier, 0, 0.3 * h, 0.1 * w, 0.8 * h, 0, 0.5 * h))
              .add(new go.PathSegment(go.PathSegment.Bezier, 0.5 * w, 0.3 * h, 0, 0, 0.45 * w, 0))
              .add(new go.PathSegment(go.PathSegment.Bezier, w, 0.3 * h, 0.55 * w, 0, w, 0))
              .add(new go.PathSegment(go.PathSegment.Bezier, 0.5 * w, h, w, 0.5 * h, 0.9 * w, 0.8 * h).close()))
         .setSpots(0.14, 0.29, 0.86, 0.78)
})

go.Shape.defineFigureGenerator('Spade', function (shape, w, h) {
  return new go.Geometry()
         .add(new go.PathFigure(0.5 * w, 0, true)
              .add(new go.PathSegment(go.PathSegment.Line, 0.51 * w, 0.01 * h))
              .add(new go.PathSegment(go.PathSegment.Bezier, w, 0.5 * h, 0.6 * w, 0.2 * h, w, 0.25 * h))
              .add(new go.PathSegment(go.PathSegment.Bezier, 0.55 * w, 0.7 * h, w, 0.8 * h, 0.6 * w, 0.8 * h))
              .add(new go.PathSegment(go.PathSegment.Bezier, 0.75 * w, h, 0.5 * w, 0.75 * h, 0.55 * w, 0.95 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.25 * w, h))
              .add(new go.PathSegment(go.PathSegment.Bezier, 0.45 * w, 0.7 * h, 0.45 * w, 0.95 * h, 0.5 * w, 0.75 * h))
              .add(new go.PathSegment(go.PathSegment.Bezier, 0, 0.5 * h, 0.4 * w, 0.8 * h, 0, 0.8 * h))
              .add(new go.PathSegment(go.PathSegment.Bezier, 0.49 * w, 0.01 * h, 0, 0.25 * h, 0.4 * w, 0.2 * h).close()))
         .setSpots(0.14, 0.26, 0.86, 0.78)
})

go.Shape.defineFigureGenerator('Club', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0.4 * w, 0.6 * h, true)
  geo.add(fig)
  // Start the base
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.15 * w, h, 0.5 * w, 0.75 * h, 0.45 * w, 0.95 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.85 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.6 * w, 0.6 * h, 0.55 * w, 0.95 * h, 0.5 * w, 0.75 * h))
  // First circle:
  var r = 0.2 // radius
  var cx = 0.3 // offset from Center x
  var cy = 0 // offset from Center y
  var d = r * KAPPA
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (0.5 + cx) * w, (0.5 + r + cy) * h,
    (0.5 - r + cx) * w, (0.5 + d + cy) * h,
    (0.5 - d + cx) * w, (0.5 + r + cy) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (1 - 0.5 + r + cx) * w, (0.5 + cy) * h,
    (0.5 + d + cx) * w, (0.5 + r + cy) * h,
    (0.5 + r + cx) * w, (0.5 + d + cy) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (0.5 + cx) * w, (0.5 - r + cy) * h,
    (1 - 0.5 + r + cx) * w, (0.5 - d + cy) * h,
    (0.5 + d + cx) * w, (0.5 - r + cy) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (0.65) * w, (0.36771243) * h,
    (0.5 - d + cx) * w, (0.5 - r + cy) * h,
    (0.5 - r + cx + 0.05) * w, (0.5 - d + cy - 0.02) * h))
  r = 0.2 // radius
  cx = 0 // offset from Center x
  cy = -0.3 // offset from Center y
  d = r * KAPPA
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (1 - 0.5 + r + cx) * w, (0.5 + cy) * h,
    (0.5 + d + cx) * w, (0.5 + r + cy) * h,
    (0.5 + r + cx) * w, (0.5 + d + cy) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (0.5 + cx) * w, (0.5 - r + cy) * h,
    (1 - 0.5 + r + cx) * w, (0.5 - d + cy) * h,
    (0.5 + d + cx) * w, (0.5 - r + cy) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (0.5 - r + cx) * w, (0.5 + cy) * h,
    (0.5 - d + cx) * w, (0.5 - r + cy) * h,
    (0.5 - r + cx) * w, (0.5 - d + cy) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (0.5 - d + cx) * w, (0.5 + r + cy) * h,
    (0.5 - r + cx) * w, (0.5 + d + cy) * h,
    (0.5 - d + cx) * w, (0.5 + r + cy) * h))
  r = 0.2 // radius
  cx = -0.3 // offset from Center x
  cy = 0 // offset from Center y
  d = r * KAPPA
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (0.5 + cx) * w, (0.5 - r + cy) * h,
    (1 - 0.5 + r + cx - 0.05) * w, (0.5 - d + cy - 0.02) * h,
    (0.5 + d + cx) * w, (0.5 - r + cy) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (0.5 - r + cx) * w, (0.5 + cy) * h,
    (0.5 - d + cx) * w, (0.5 - r + cy) * h,
    (0.5 - r + cx) * w, (0.5 - d + cy) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (0.5 + cx) * w, (0.5 + r + cy) * h,
    (0.5 - r + cx) * w, (0.5 + d + cy) * h,
    (0.5 - d + cx) * w, (0.5 + r + cy) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.4 * w, 0.6 * h,
    (0.5 + d + cx) * w, (0.5 + r + cy) * h,
    (0.5 + r + cx) * w, (0.5 + d + cy) * h).close())
  geo.setSpots(0.06, 0.33, 0.93, 0.68)
  return geo
})

go.Shape.defineFigureGenerator('YinYang', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(w * 0.5, 0, true)
  geo.add(fig)
  // Right semi-circle
  fig.add(new go.PathSegment(go.PathSegment.Arc, 270, 180, w * 0.5, w * 0.5, w * 0.5, w * 0.5))
  // bottom semi-circle
  fig.add(new go.PathSegment(go.PathSegment.Arc, 90, -180, w * 0.5, w * 0.75, w * 0.25, w * 0.25))
  // top semi-circle
  fig.add(new go.PathSegment(go.PathSegment.Arc, 90, 180, w * 0.5, w * 0.25, w * 0.25, w * 0.25))
  var radius = 0.1  // of the small circles
  var centerx = 0.5
  var centery = 0.25
  // Top small circle, goes counter-clockwise
  fig.add(new go.PathSegment(go.PathSegment.Move, (centerx + radius) * w, (centery) * h))
  fig.add(new go.PathSegment(go.PathSegment.Arc, 0, -360, w * centerx, h * centery, radius * w, radius * w).close()) // Right semi-circle
  // Left semi-circle
  fig = new go.PathFigure(w * 0.5, 0, false)
  geo.add(fig)
  fig.add(new go.PathSegment(go.PathSegment.Arc, 270, -180, w * 0.5, w * 0.5, w * 0.5, w * 0.5))
  centery = 0.75
  // Bottom small circle
  fig = new go.PathFigure((centerx + radius) * w, (centery) * h, true) // Not a subpath
  geo.add(fig)
  fig.add(new go.PathSegment(go.PathSegment.Arc, 0, 360, w * centerx, h * centery, radius * w, radius * w).close()) // Right semi-circle
  geo.defaultStretch = go.GraphObject.Uniform
  return geo
})

go.Shape.defineFigureGenerator('Peace', function (shape, w, h) {
  var a = 1.0 - 0.1464466094067262  // at 45 degrees
  var w2 = 0.5 * w
  var h2 = 0.5 * h
  return new go.Geometry()
         .add(new go.PathFigure(w2, 0, true)
              .add(new go.PathSegment(go.PathSegment.Arc, 270, 360, w2, h2, w2, h2))
              .add(new go.PathSegment(go.PathSegment.Line, w2, h))
              .add(new go.PathSegment(go.PathSegment.Move, w2, h2))
              .add(new go.PathSegment(go.PathSegment.Line, (1.0 - a) * w, a * h))
              .add(new go.PathSegment(go.PathSegment.Move, w2, h2))
              .add(new go.PathSegment(go.PathSegment.Line, a * w, a * h)))
})

go.Shape.defineFigureGenerator('NotAllowed', function (shape, w, h) {
  var geo = new go.Geometry()
  var cpOffset = KAPPA * 0.5
  var radius = 0.5
  var centerx = 0.5
  var centery = 0.5
  var fig = new go.PathFigure(centerx * w, (centery - radius) * h)
  geo.add(fig)
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (centerx - radius) * w, centery * h, (centerx - cpOffset) * w, (centery - radius) * h,
      (centerx - radius) * w, (centery - cpOffset) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery + radius) * h, (centerx - radius) * w, (centery + cpOffset) * h,
      (centerx - cpOffset) * w, (centery + radius) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + radius) * w, centery * h, (centerx + cpOffset) * w, (centery + radius) * h,
      (centerx + radius) * w, (centery + cpOffset) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery - radius) * h, (centerx + radius) * w, (centery - cpOffset) * h,
      (centerx + cpOffset) * w, (centery - radius) * h))
  // Inner circle, composed of two parts, separated by
  // a beam across going from top-right to bottom-left.
  radius = 0.40
  cpOffset = KAPPA * 0.40
  // First we cut up the top right 90 degree curve into two smaller
  // curves.
  // Since its clockwise, StartOfArrow is the first of the two points
  // on the circle. EndOfArrow is the other one.
  var startOfArrowc1 = tempPoint()
  var startOfArrowc2 = tempPoint()
  var startOfArrow = tempPoint()
  var unused = tempPoint()
  breakUpBezier(centerx, centery - radius,
      centerx + cpOffset, centery - radius,
      centerx + radius, centery - cpOffset,
      centerx + radius, centery, 0.42, startOfArrowc1,
      startOfArrowc2, startOfArrow, unused, unused)
  var endOfArrowc1 = tempPoint()
  var endOfArrowc2 = tempPoint()
  var endOfArrow = tempPoint()
  breakUpBezier(centerx, centery - radius,
      centerx + cpOffset, centery - radius,
      centerx + radius, centery - cpOffset,
      centerx + radius, centery, 0.58, unused,
      unused, endOfArrow, endOfArrowc1, endOfArrowc2)
  // Cut up the bottom left 90 degree curve into two smaller curves.
  var startOfArrow2c1 = tempPoint()
  var startOfArrow2c2 = tempPoint()
  var startOfArrow2 = tempPoint()
  breakUpBezier(centerx, centery + radius,
      centerx - cpOffset, centery + radius,
      centerx - radius, centery + cpOffset,
      centerx - radius, centery, 0.42, startOfArrow2c1,
      startOfArrow2c2, startOfArrow2, unused, unused)
  var endOfArrow2c1 = tempPoint()
  var endOfArrow2c2 = tempPoint()
  var endOfArrow2 = tempPoint()
  breakUpBezier(centerx, centery + radius,
      centerx - cpOffset, centery + radius,
      centerx - radius, centery + cpOffset,
      centerx - radius, centery, 0.58, unused,
      unused, endOfArrow2, endOfArrow2c1, endOfArrow2c2)
  fig.add(new go.PathSegment(go.PathSegment.Move, endOfArrow2.x * w, endOfArrow2.y * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (centerx - radius) * w, centery * h, endOfArrow2c1.x * w, endOfArrow2c1.y * h,
      endOfArrow2c2.x * w, endOfArrow2c2.y * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery - radius) * h, (centerx - radius) * w, (centery - cpOffset) * h,
      (centerx - cpOffset) * w, (centery - radius) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, startOfArrow.x * w, startOfArrow.y * h, startOfArrowc1.x * w, startOfArrowc1.y * h,
      startOfArrowc2.x * w, startOfArrowc2.y * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, endOfArrow2.x * w, endOfArrow2.y * h).close())
  fig.add(new go.PathSegment(go.PathSegment.Move, startOfArrow2.x * w, startOfArrow2.y * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, endOfArrow.x * w, endOfArrow.y * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + radius) * w, centery * h, endOfArrowc1.x * w, endOfArrowc1.y * h,
      endOfArrowc2.x * w, endOfArrowc2.y * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery + radius) * h, (centerx + radius) * w, (centery + cpOffset) * h,
      (centerx + cpOffset) * w, (centery + radius) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, startOfArrow2.x * w, startOfArrow2.y * h, startOfArrow2c1.x * w, startOfArrow2c1.y * h,
      startOfArrow2c2.x * w, startOfArrow2c2.y * h).close())
  freePoint(startOfArrowc1)
  freePoint(startOfArrowc2)
  freePoint(startOfArrow)
  freePoint(unused)
  freePoint(endOfArrowc1)
  freePoint(endOfArrowc2)
  freePoint(endOfArrow)
  freePoint(startOfArrow2c1)
  freePoint(startOfArrow2c2)
  freePoint(startOfArrow2)
  freePoint(endOfArrow2c1)
  freePoint(endOfArrow2c2)
  freePoint(endOfArrow2)
  geo.defaultStretch = go.GraphObject.Uniform
  return geo
})

go.Shape.defineFigureGenerator('Fragile', function (shape, w, h) {
  return new go.Geometry()
         .add(new go.PathFigure(0, 0, true)
              .add(new go.PathSegment(go.PathSegment.Line, 0.25 * w, 0))
              .add(new go.PathSegment(go.PathSegment.Line, 0.2 * w, 0.15 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.3 * w, 0.25 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.29 * w, 0.33 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.35 * w, 0.25 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.3 * w, 0.15 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.4 * w, 0))
              .add(new go.PathSegment(go.PathSegment.Line, w, 0))
              // Left Side
              .add(new go.PathSegment(go.PathSegment.Bezier, 0.55 * w, 0.5 * h, w, 0.25 * h, 0.75 * w, 0.5 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.55 * w, 0.9 * h))
              // The base
              .add(new go.PathSegment(go.PathSegment.Line, 0.7 * w, 0.9 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.7 * w, h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.3 * w, h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.3 * w, 0.9 * h))
              // Right side
              .add(new go.PathSegment(go.PathSegment.Line, 0.45 * w, 0.9 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.45 * w, 0.5 * h))
              .add(new go.PathSegment(go.PathSegment.Bezier, 0, 0, 0.25 * w, 0.5 * h, 0, 0.25 * h).close()))
})

go.Shape.setFigureParameter('HourGlass', 0, new FigureParameter('Thickness', 20))
go.Shape.defineFigureGenerator('HourGlass', function (shape, w, h) {
  var param1 = shape ? shape.parameter1 : NaN
  if (isNaN(param1) || param1 < 0) param1 = 30 // default value for param1
  var line1 = ((w - param1) / 2) + param1 // 35 + 30 = 65
  var line2 = ((w - param1) / 2) // 100 - 30 = 70/2 = 35
  return new go.Geometry()
         .add(new go.PathFigure(line1, 0.5 * h)  // This is the right side, this equals 65, (1 - param1) * w
              .add(new go.PathSegment(go.PathSegment.Line, w, h))
              .add(new go.PathSegment(go.PathSegment.Line, 0, h))
              .add(new go.PathSegment(go.PathSegment.Line, line2, 0.5 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0, 0))
              .add(new go.PathSegment(go.PathSegment.Line, w, 0).close()))
})

go.Shape.defineFigureGenerator('Lightning', function (shape, w, h) {
  return new go.Geometry()
         .add(new go.PathFigure(0, 0.65 * h)
              .add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0))
              .add(new go.PathSegment(go.PathSegment.Line, 0.25 * w, 0.55 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.9 * w, 0.40 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.4 * w, h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.65 * w, 0.50 * h).close()))
})

go.Shape.defineFigureGenerator('GenderMale', function (shape, w, h) {
  var geo = new go.Geometry()
  var cpOffset = KAPPA * 0.4
  var radius = 0.4
  var centerx = 0.5
  var centery = 0.5
  var unused = tempPoint()
  var mid = tempPoint()
  var c1 = tempPoint()
  var c2 = tempPoint()
  var fig = new go.PathFigure((centerx - radius) * w, centery * h, false)
  geo.add(fig)

  // Outer circle
  fig.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery - radius) * h, (centerx - radius) * w, (centery - cpOffset) * h,
    (centerx - cpOffset) * w, (centery - radius) * h))
  breakUpBezier(centerx, centery - radius,
       centerx + cpOffset, centery - radius,
       centerx + radius, centery - cpOffset,
       centerx + radius, centery, 0.44, c1,
       c2, mid, unused, unused)
  fig.add(new go.PathSegment(go.PathSegment.Bezier, mid.x * w, mid.y * h, c1.x * w, c1.y * h, c2.x * w, c2.y * h))
  var startOfArrow = tempPointAt(mid.x, mid.y)
  breakUpBezier(centerx, centery - radius,
      centerx + cpOffset, centery - radius,
      centerx + radius, centery - cpOffset,
      centerx + radius, centery, 0.56, unused,
      unused, mid, c1, c2)
  var endOfArrow = tempPointAt(mid.x, mid.y)
  fig.add(new go.PathSegment(go.PathSegment.Line, (startOfArrow.x * 0.1 + 0.95 * 0.9) * w,
    (startOfArrow.y * 0.1) * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.85 * w, (startOfArrow.y * 0.1) * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.85 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.15 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, (endOfArrow.x * 0.1 + 0.9) * w, 0.15 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, (endOfArrow.x * 0.1 + 0.9) * w,
    (endOfArrow.y * 0.1 + 0.05 * 0.9) * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, endOfArrow.x * w, endOfArrow.y * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + radius) * w, centery * h, c1.x * w, c1.y * h, c2.x * w, c2.y * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery + radius) * h, (centerx + radius) * w, (centery + cpOffset) * h,
    (centerx + cpOffset) * w, (centery + radius) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (centerx - radius) * w, centery * h, (centerx - cpOffset) * w, (centery + radius) * h,
    (centerx - radius) * w, (centery + cpOffset) * h))
  // Inner circle
  radius = 0.35
  cpOffset = KAPPA * 0.35
  var fig2 = new go.PathFigure(centerx * w, (centery - radius) * h, false)
  geo.add(fig2)
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, (centerx - radius) * w, centery * h, (centerx - cpOffset) * w, (centery - radius) * h,
    (centerx - radius) * w, (centery - cpOffset) * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery + radius) * h, (centerx - radius) * w, (centery + cpOffset) * h,
    (centerx - cpOffset) * w, (centery + radius) * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + radius) * w, centery * h, (centerx + cpOffset) * w, (centery + radius) * h,
    (centerx + radius) * w, (centery + cpOffset) * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery - radius) * h, (centerx + radius) * w, (centery - cpOffset) * h,
    (centerx + cpOffset) * w, (centery - radius) * h))
  var fig3 = new go.PathFigure((centerx - radius) * w, centery * h, false)
  geo.add(fig3)
  freePoint(unused)
  freePoint(mid)
  freePoint(c1)
  freePoint(c2)
  freePoint(startOfArrow)
  freePoint(endOfArrow)
  geo.spot1 = new go.Spot(0.202, 0.257)
  geo.spot2 = new go.Spot(0.792, 0.739)
  geo.defaultStretch = go.GraphObject.Uniform
  return geo
})

go.Shape.defineFigureGenerator('GenderFemale', function (shape, w, h) {
  var geo = new go.Geometry()
  // Outer Circle
  var r = 0.375 // radius
  var cx = 0 // offset from Center x
  var cy = -0.125 // offset from Center y
  var d = r * KAPPA
  var fig = new go.PathFigure((0.525 + cx) * w, (0.5 + r + cy) * h, false)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Bezier, (1 - 0.5 + r + cx) * w, (0.5 + cy) * h, (0.5 + d + cx) * w, (0.5 + r + cy) * h,
    (0.5 + r + cx) * w, (0.5 + d + cy) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (0.5 + cx) * w, (0.5 - r + cy) * h, (1 - 0.5 + r + cx) * w, (0.5 - d + cy) * h,
    (0.5 + d + cx) * w, (0.5 - r + cy) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (0.5 - r + cx) * w, (0.5 + cy) * h, (0.5 - d + cx) * w, (0.5 - r + cy) * h,
    (0.5 - r + cx) * w, (0.5 - d + cy) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (0.475 + cx) * w, (0.5 + r + cy) * h, (0.5 - r + cx) * w, (0.5 + d + cy) * h,
    (0.5 - d + cx) * w, (0.5 + r + cy) * h))
  // Legs
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.475 * w, 0.85 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.425 * w, 0.85 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.425 * w, 0.9 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.475 * w, 0.9 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.475 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.525 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.525 * w, 0.9 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.575 * w, 0.9 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.575 * w, 0.85 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.525 * w, 0.85 * h).close())
  // Inner circle
  r = 0.325 // radius
  cx = 0 // offset from Center x
  cy = -0.125 // offset from Center y
  d = r * KAPPA
  var fig = new go.PathFigure((1 - 0.5 + r + cx) * w, (0.5 + cy) * h, false)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Bezier, (0.5 + cx) * w, (0.5 + r + cy) * h, (0.5 + r + cx) * w, (0.5 + d + cy) * h,
    (0.5 + d + cx) * w, (0.5 + r + cy) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (0.5 - r + cx) * w, (0.5 + cy) * h, (0.5 - d + cx) * w, (0.5 + r + cy) * h,
    (0.5 - r + cx) * w, (0.5 + d + cy) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (0.5 + cx) * w, (0.5 - r + cy) * h, (0.5 - r + cx) * w, (0.5 - d + cy) * h,
    (0.5 - d + cx) * w, (0.5 - r + cy) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (1 - 0.5 + r + cx) * w, (0.5 + cy) * h, (0.5 + d + cx) * w, (0.5 - r + cy) * h,
    (1 - 0.5 + r + cx) * w, (0.5 - d + cy) * h))
  var fig = new go.PathFigure((0.525 + cx) * w, (0.5 + r + cy) * h, false)
  geo.add(fig)
  geo.spot1 = new go.Spot(0.232, 0.136)
  geo.spot2 = new go.Spot(0.682, 0.611)
  geo.defaultStretch = go.GraphObject.Uniform
  return geo
})

go.Shape.defineFigureGenerator('LogicImplies', function (shape, w, h) {
  var param1 = shape ? shape.parameter1 : NaN
  if (isNaN(param1)) param1 = 0.2  // Distance the arrow folds from the right
  return new go.Geometry()
         .add(new go.PathFigure((1 - param1) * w, 0, false)
              .add(new go.PathSegment(go.PathSegment.Line, w, 0.5 * h))
              .add(new go.PathSegment(go.PathSegment.Line, (1 - param1) * w, h))
              .add(new go.PathSegment(go.PathSegment.Move, 0, 0.5 * h))
              .add(new go.PathSegment(go.PathSegment.Line, w, 0.5 * h)))
         .setSpots(0, 0, 0.8, 0.5)
})

go.Shape.defineFigureGenerator('LogicIff', function (shape, w, h) {
  var param1 = shape ? shape.parameter1 : NaN
  if (isNaN(param1)) param1 = 0.2 // Distance the arrow folds from the right
  return new go.Geometry()
         .add(new go.PathFigure((1 - param1) * w, 0, false)
              .add(new go.PathSegment(go.PathSegment.Line, w, 0.5 * h))
              .add(new go.PathSegment(go.PathSegment.Line, (1 - param1) * w, h))
              .add(new go.PathSegment(go.PathSegment.Move, 0, 0.5 * h))
              .add(new go.PathSegment(go.PathSegment.Line, w, 0.5 * h))
              .add(new go.PathSegment(go.PathSegment.Move, param1 * w, 0))
              .add(new go.PathSegment(go.PathSegment.Line, 0, 0.5 * h))
              .add(new go.PathSegment(go.PathSegment.Line, param1 * w, h)))
         .setSpots(0.2, 0, 0.8, 0.5)
})

go.Shape.defineFigureGenerator('LogicNot', function (shape, w, h) {
  return new go.Geometry()
         .add(new go.PathFigure(0, 0, false)
              .add(new go.PathSegment(go.PathSegment.Line, w, 0))
              .add(new go.PathSegment(go.PathSegment.Line, w, h)))
})

go.Shape.defineFigureGenerator('LogicAnd', function (shape, w, h) {
  return new go.Geometry()
         .add(new go.PathFigure(0, h, false)
              .add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0))
              .add(new go.PathSegment(go.PathSegment.Line, w, h)))
         .setSpots(0.25, 0.5, 0.75, 1)
})

go.Shape.defineFigureGenerator('LogicOr', function (shape, w, h) {
  return new go.Geometry()
         .add(new go.PathFigure(0, 0, false)
              .add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, h))
              .add(new go.PathSegment(go.PathSegment.Line, w, 0)))
         .setSpots(0.219, 0, 0.78, 0.409)
})

go.Shape.defineFigureGenerator('LogicXor', function (shape, w, h) {
  var geo = new go.Geometry()
         .add(new go.PathFigure(0.5 * w, 0, false)
              .add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, h))
              .add(new go.PathSegment(go.PathSegment.Move, 0, 0.5 * h))
              .add(new go.PathSegment(go.PathSegment.Line, w, 0.5 * h))
              .add(new go.PathSegment(go.PathSegment.Arc, 0, 360, 0.5 * w, 0.5 * h, 0.5 * w, 0.5 * h)))
  geo.defaultStretch = go.GraphObject.Uniform
  return geo
})

go.Shape.defineFigureGenerator('LogicTruth', function (shape, w, h) {
  return new go.Geometry()
         .add(new go.PathFigure(0, 0, false)
              .add(new go.PathSegment(go.PathSegment.Line, w, 0))
              .add(new go.PathSegment(go.PathSegment.Move, 0.5 * w, 0))
              .add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, h)))
})

go.Shape.defineFigureGenerator('LogicFalsity', function (shape, w, h) {
  return new go.Geometry()
         .add(new go.PathFigure(0, h, false)
              .add(new go.PathSegment(go.PathSegment.Line, w, h))
              .add(new go.PathSegment(go.PathSegment.Move, 0.5 * w, h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0)))
})

go.Shape.defineFigureGenerator('LogicThereExists', function (shape, w, h) {
  return new go.Geometry()
         .add(new go.PathFigure(0, 0, false)
              .add(new go.PathSegment(go.PathSegment.Line, w, 0))
              .add(new go.PathSegment(go.PathSegment.Line, w, 0.5 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0, 0.5 * h))
              .add(new go.PathSegment(go.PathSegment.Move, w, 0.5 * h))
              .add(new go.PathSegment(go.PathSegment.Line, w, h))
              .add(new go.PathSegment(go.PathSegment.Line, 0, h)))
})

go.Shape.defineFigureGenerator('LogicForAll', function (shape, w, h) {
  return new go.Geometry()
         .add(new go.PathFigure(0, 0, false)
              .add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, h))
              .add(new go.PathSegment(go.PathSegment.Line, w, 0))
              .add(new go.PathSegment(go.PathSegment.Move, 0.25 * w, 0.5 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0.5 * h)))
         .setSpots(0.25, 0, 0.75, 0.5)
})

go.Shape.defineFigureGenerator('LogicIsDefinedAs', function (shape, w, h) {
  return new go.Geometry()
         .add(new go.PathFigure(0, 0, false)
              .add(new go.PathSegment(go.PathSegment.Line, w, 0))
              .add(new go.PathSegment(go.PathSegment.Move, 0, 0.5 * h))
              .add(new go.PathSegment(go.PathSegment.Line, w, 0.5 * h))
              .add(new go.PathSegment(go.PathSegment.Move, 0, h))
              .add(new go.PathSegment(go.PathSegment.Line, w, h)))
         .setSpots(0.01, 0.01, 0.99, 0.49)
})

go.Shape.defineFigureGenerator('LogicIntersect', function (shape, w, h) {
  var radius = 0.5
  return new go.Geometry()
         .add(new go.PathFigure(0, h, false)
              .add(new go.PathSegment(go.PathSegment.Line, 0, radius * h))
              .add(new go.PathSegment(go.PathSegment.Arc, 180, 180, radius * w, radius * h, radius * w, radius * h))
              .add(new go.PathSegment(go.PathSegment.Line, w, h)))
         .setSpots(0, 0.5, 1, 1)
})

go.Shape.defineFigureGenerator('LogicUnion', function (shape, w, h) {
  var radius = 0.5
  return new go.Geometry()
         .add(new go.PathFigure(w, 0, false)
              .add(new go.PathSegment(go.PathSegment.Line, w, radius * h))
              .add(new go.PathSegment(go.PathSegment.Arc, 0, 180, radius * w, radius * h, radius * w, radius * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0, 0)))
         .setSpots(0, 0, 1, 0.5)
})

go.Shape.defineFigureGenerator('Arrow', function (shape, w, h) {
  var geo = new go.Geometry()
  var param1 = shape ? shape.parameter1 : NaN
  var param2 = shape ? shape.parameter2 : NaN
  // % from the edge the ends of the arrow are
  if (isNaN(param1)) param1 = 0.3
  // Arrow width
  if (isNaN(param2)) param2 = 0.3
  var fig = new go.PathFigure(0, (0.5 - param2 / 2) * h, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, (1 - param1) * w, (0.5 - param2 / 2) * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, (1 - param1) * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, (1 - param1) * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, (1 - param1) * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, (1 - param1) * w, (0.5 + param2 / 2) * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, (0.5 + param2 / 2) * h).close())
  geo.spot1 = new go.Spot(0, 0.5 - param2 / 2)
  var temp = getIntersection(0, 0.5 + param2 / 2,
      1, 0.5 + param2 / 2,
      1 - param1, 1,
      1, 0.5,
      tempPoint())
  geo.spot2 = new go.Spot(temp.x, temp.y)
  freePoint(temp)
  return geo
})

go.Shape.setFigureParameter('Arrow2', 0, new FigureParameter('LongHeight', 30))
go.Shape.defineFigureGenerator('Arrow2', function (shape, w, h) {
  var geo = new go.Geometry()
  var param1 = shape ? shape.parameter1 : NaN
  var param2 = shape ? shape.parameter2 : NaN
  // % from the edge the ends of the arrow are
  if (isNaN(param1)) param1 = 0.3
  // Arrow width
  if (isNaN(param2)) param2 = 30 // 30 is the default value
  param2 = Math.min(param2, h / 2)
  var lineWidth = 25
  var line1 = ((h - param2) / 2) + param2 // 60
  var line2 = ((h - param2) / 2) // 100 - 24
  // 100 - 25 = 75
  // 75/2 = 37.5
  var fig = new go.PathFigure(0, line2, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, (1 - param1) * w, line2)) // ends at 56,28
  fig.add(new go.PathSegment(go.PathSegment.Line, (1 - param1) * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, (1 - param1) * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, (1 - param1) * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, (1 - param1) * w, line1)) // height here matters
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, line1).close())

  return geo
})

go.Shape.defineFigureGenerator('Chevron', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, 0, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0.5 * h).close())
  return geo
})

go.Shape.defineFigureGenerator('DoubleArrow', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, 0, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0.3 * w, 0.214 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.3 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 1.0 * w, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.3 * w, 1.0 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.3 * w, 0.786 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 1.0 * h).close())
  return geo
})

// JC
// added a new parameter to allow to adjust the connecter piece height
// might need to do something about the parameter min and max and make it more accesible
go.Shape.setFigureParameter('DoubleEndArrow', 0, new FigureParameter('ConnecterHeight', 0.7, 0.5, 1))
go.Shape.defineFigureGenerator('DoubleEndArrow', function (shape, w, h) {
  var geo = new go.Geometry()
  var param1 = shape ? shape.parameter1 : NaN
  if (isNaN(param1)) param1 = 0.7 // default value for param1
  var fig = new go.PathFigure(w, 0.5 * h, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0.7 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.7 * w, param1 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.3 * w, param1 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.3 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.3 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.3 * w, (1 - param1) * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.7 * w, (1 - param1) * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.7 * w, 0).close())
  var temp = getIntersection(0, 0.5, 0.3, 0, 0, 0.3, 0.3, 0.3, tempPoint())  // ?? constant
  geo.spot1 = new go.Spot(temp.x, temp.y)
  temp = getIntersection(0.7, 1, 1, 0.5, 0.7, 0.7, 1, 0.7, temp)  // ?? constant
  geo.spot2 = new go.Spot(temp.x, temp.y)
  freePoint(temp)
  return geo
})

// JC
// this file is the same version as the one above only it uses absolute values
// ABSOLUTEValues
// this allows the user to set exact values
// set it to an exact value that willl NOT scale
// also allowing the user to edit the height of those two arrows
// JC Allowing to modify adjustment too
go.Shape.setFigureParameter('DoubleEndArrow2', 0, new FigureParameter('ConnecterHeight', 40))
go.Shape.setFigureParameter('DoubleEndArrow2', 1, new FigureParameter('ArrowPointerHeight', 70))
go.Shape.defineFigureGenerator('DoubleEndArrow2', function (shape, w, h) {
  // This is absolute
  var geo = new go.Geometry()
  var param1 = shape ? shape.parameter1 : NaN
  if (isNaN(param1)) param1 = 70 // default value for param1
  var param2 = shape ? shape.parameter2 : NaN
  if (isNaN(param2)) param2 = 90 // default value for param2
  var fig = new go.PathFigure(w, 0.5 * h, true)
  geo.add(fig)

  // everything is based off of having things be 100 w and 100 h
  var lineThickness = 40
  // param1 will represent the line thickness
  // lets say H = 100, w = 100
  // h - 40 = 60
  // 60/2 = 30. each length needs to be 30
  var line1 = ((h - param1) / 2) + param1 // 70
  var line2 = ((h - param1) / 2) // 30
  // With abolute value
  if (param1 > h) {
    // in attempts to leave the shape with the same proportions
    var newParamValue = h / param1 // this will be the proportion we try to recreate
    // h - newParamValue =
    var newMiddle = h * newParamValue // calculates how big the middle will be now
    // Using the same formula above, we recalculate with the value for the newMiddle instead of Param1
    line1 = ((h - newMiddle) / 2) + newMiddle
    line2 = ((h - newMiddle) / 2)
  } else {
    var line1 = ((h - param1) / 2) + param1
    var line2 = ((h - param1) / 2)
  };
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.7 * w, h)) // 70, 100
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.7 * w, line1))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.3 * w, line1))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.3 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.3 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.3 * w, line2))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.7 * w, line2))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.7 * w, 0).close())
  var temp = getIntersection(0, 0.5, 0.3, 0, 0, 0.3, 0.3, 0.3, tempPoint())  // ?? constant
  geo.spot1 = new go.Spot(temp.x, temp.y)
  temp = getIntersection(0.7, 1, 1, 0.5, 0.7, 0.7, 1, 0.7, temp)  // ?? constant
  geo.spot2 = new go.Spot(temp.x, temp.y)
  freePoint(temp)
  /*
  Backup in case i mess up
  var line1 = ((h - param1) /2) + param1;
  var line2 = ((h - param1) /2);
  fig.add(new go.PathSegment(go.PathSegment.Line, .7 * w, h));
  fig.add(new go.PathSegment(go.PathSegment.Line, .7 * w, line1));
  fig.add(new go.PathSegment(go.PathSegment.Line, .3 * w, line1));
  fig.add(new go.PathSegment(go.PathSegment.Line, .3 * w, h));
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, .5 * h));
  fig.add(new go.PathSegment(go.PathSegment.Line, .3 * w, 0));
  fig.add(new go.PathSegment(go.PathSegment.Line, .3 * w, line2));
  fig.add(new go.PathSegment(go.PathSegment.Line, .7 * w, line2));
  fig.add(new go.PathSegment(go.PathSegment.Line, .7 * w, 0).close());
  var temp = getIntersection(0, .5, .3, 0, 0, .3, .3, .3, tempPoint());  // ?? constant
  geo.spot1 = new go.Spot(temp.x, temp.y);
  temp = getIntersection(.7, 1, 1, .5, .7, .7, 1, .7, temp);  // ?? constant
  geo.spot2 = new go.Spot(temp.x, temp.y);
  freePoint(temp);
  */
  return geo
})

// JC
// this parameter makes it possible for the user to set a width for a long edge of the IBeamArrow
// allows the user to adjust the vertical width of the long section, i might have to draw a diagram
go.Shape.setFigureParameter('IBeamArrow', 0, new FigureParameter('ArrowLengthWidth', 0.7, 0.51, 0.97))
// go.Shape.setFigureParameter("IBeamArrow", 1, new FigureParameter("ArrowBackSection"))
go.Shape.defineFigureGenerator('IBeamArrow', function (shape, w, h) {
  var geo = new go.Geometry()
  var param1 = shape ? shape.parameter1 : NaN
  if (isNaN(param1)) param1 = 0.7 // default value is 0 for parameter
  var fig = new go.PathFigure(w, 0.5 * h, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0.7 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.7 * w, param1 * h)) // 70
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.2 * w, param1 * h)) // bottom horizontal line
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.2 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.2 * w, 0))
  // above value is .7
  // below value is .3
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.2 * w, (1 - param1) * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.7 * w, (1 - param1) * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.7 * w, 0).close())
  geo.spot1 = new go.Spot(0, 0.3)
  var temp = getIntersection(0.7, 1, 1, 0.5, 0.7, 0.7, 1, 0.7, tempPoint())  // ?? constant
  geo.spot2 = new go.Spot(temp.x, temp.y)
  freePoint(temp)
  return geo
})

// JC
// recreating the same thing above only using absolute values to figure out the size of the long side
go.Shape.setFigureParameter('IBeamArrow2', 0, new FigureParameter('ArrowLengthWidth', 40))
// go.Shape.setFigureParameter("IBeamArrow2", 1, new FigureParameter("ArrowBackSection"))
go.Shape.defineFigureGenerator('IBeamArrow2', function (shape, w, h) {
  var geo = new go.Geometry()
  var param1 = shape ? shape.parameter1 : NaN
  if (isNaN(param1)) param1 = 40 // default value is 0 for parameter
  var fig = new go.PathFigure(w, 0.5 * h, true)
  geo.add(fig)

  var line1 = ((h - param1) / 2) + param1 // 100 - 40 = 60/2 = 30 + 40 = 70
  var line2 = ((h - param1) / 2)
  if (param1 >= h) {
    // in attempts to leave the shape with the same proportions
    var newParamValue = h / param1 // this will be the proportion we try to recreate
    // h - newParamValue =
    var newMiddle = h * newParamValue // calculates how big the middle will be now
    // Using the same formula above, we recalculate with the value for the newMiddle instead of Param1
    line1 = ((h - newMiddle) / 2) + newMiddle
    line2 = ((h - newMiddle) / 2)
  } else {
    var line1 = ((h - param1) / 2) + param1
    var line2 = ((h - param1) / 2)
  };
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.7 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.7 * w, line1))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.2 * w, line1)) // bottom horizontal line
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.2 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.2 * w, 0))
  // above value is .7
  // below value is .3
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.2 * w, line2))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.7 * w, line2))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.7 * w, 0).close())
  geo.spot1 = new go.Spot(0, 0.3)
  var temp = getIntersection(0.7, 1, 1, 0.5, 0.7, 0.7, 1, 0.7, tempPoint())  // ?? constant
  geo.spot2 = new go.Spot(temp.x, temp.y)
  freePoint(temp)
  return geo
})

// JC
// go.Shape.setFigureParameter("Pointer", 0, new FigureParameter("BackPoint", 0.25, 0.1, 0.65));
// back point that cuts into the pointer
go.Shape.setFigureParameter('Pointer', 0, new FigureParameter('BackPoint', 0.2, 0, 0.2))
go.Shape.defineFigureGenerator('Pointer', function (shape, w, h) {
  var param1 = shape ? shape.parameter1 : NaN
  if (isNaN(param1)) param1 = 0.1 // BackPoint Default Value
  // var param1 shape ? shape.parameter1 : NaN;
  // if (isNaN(param1)) param1 = .5;
  var geo = new go.Geometry()
  var fig = new go.PathFigure(w, 0.5 * h, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.2 * w, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0).close())
  geo.spot1 = new go.Spot(0.2, 0.35)
  var temp = getIntersection(0.2, 0.65, 1, 0.65, 0, 1, 1, 0.5, tempPoint())  // ?? constant
  geo.spot2 = new go.Spot(temp.x, temp.y)
  freePoint(temp)
  return geo
})

// JC - FigureParameter the steepness of the rounded edge
// go.Shape.setFigureParameter("RoundedPointer", 0 new FigureParameter("RoundedEdged", 0, 0, 0));// ???
go.Shape.defineFigureGenerator('RoundedPointer', function (shape, w, h) {
  // var param1 = shape ? shape.parameter1 : NaN;
  // if (isNaN(param1)) param1 = 5; // default value, this represents the roundness of the back arrow and how "steep" it is
  var geo = new go.Geometry()
  var fig = new go.PathFigure(w, 0.5 * h, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, 0, 0.5 * w, 0.75 * h,
      0.5 * w, 0.25 * h).close())
  geo.spot1 = new go.Spot(0.4, 0.35)
  var temp = getIntersection(0.2, 0.65, 1, 0.65, 0, 1, 1, 0.5, tempPoint())  // ?? constant
  geo.spot2 = new go.Spot(temp.x, temp.y)
  freePoint(temp)
  return geo
})

// JC Adding soem parameters to this
// add param to make long part adjustable
go.Shape.setFigureParameter('SplitEndArrow', 0, new FigureParameter('LengthThickness', 0.7, 0.52, 0.9))
go.Shape.defineFigureGenerator('SplitEndArrow', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(w, 0.5 * h, true)
  geo.add(fig)

  var param1 = shape ? shape.parameter1 : NaN
  if (isNaN(param1)) param1 = 0.7 // default value if user has not set one
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.7 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.7 * w, param1 * h)) // line 1 need to add a param to this
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, param1 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.2 * w, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, (1 - param1) * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.7 * w, (1 - param1) * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.7 * w, 0).close())
  geo.spot1 = new go.Spot(0.2, 0.3)
  var temp = getIntersection(0.7, 1, 1, 0.5, 0.7, 0.7, 1, 0.7, tempPoint())  // ?? constant
  geo.spot2 = new go.Spot(temp.x, temp.y)
  freePoint(temp)
  return geo
})

// JC
// the same thing as splitendarrow except with the ability to edit the line was absolute value
go.Shape.setFigureParameter('SplitEndArrow2', 0, new FigureParameter('LengthThickness', 50))
go.Shape.defineFigureGenerator('SplitEndArrow2', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(w, 0.5 * h, true)
  geo.add(fig)

  var param1 = shape ? shape.parameter1 : NaN
  if (isNaN(param1)) param1 = 50 // default value if user has not set one
  if (param1 >= h) {
    // in attempts to leave the shape with the same proportions
    var newParamValue = h / param1 // this will be the proportion we try to recreate
    // h - newParamValue =
    var newMiddle = h * newParamValue // calculates how big the middle will be now
    // Using the same formula above, we recalculate with the value for the newMiddle instead of Param1
    line1 = ((h - newMiddle) / 2) + newMiddle
    line2 = ((h - newMiddle) / 2)
  } else {
    var line1 = ((h - param1) / 2) + param1
    var line2 = ((h - param1) / 2)
  };
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.7 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.7 * w, line1)) // line 1 need to add a param to this
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, line1))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.2 * w, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, line2))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.7 * w, line2))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.7 * w, 0).close())
  geo.spot1 = new go.Spot(0.2, 0.3)
  var temp = getIntersection(0.7, 1, 1, 0.5, 0.7, 0.7, 1, 0.7, tempPoint())  // ?? constant
  geo.spot2 = new go.Spot(temp.x, temp.y)
  freePoint(temp)
  return geo
})

// JC
// Adding perameter to allow user to edit the pointyness of this arrow
// parameter would allow you to edit the pointness of the arrow if nesscary
// this is kinda tedious not sure if any user would be interested in it
go.Shape.setFigureParameter('SquareArrow', 0, new FigureParameter('ArrowPoint', 0.7, 0.2, 0.9))
go.Shape.defineFigureGenerator('SquareArrow', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(w, 0.5 * h, true)
  geo.add(fig)

  var param1 = shape ? shape.parameter1 : NaN
  if (isNaN(param1)) param1 = 0.7
  fig.add(new go.PathSegment(go.PathSegment.Line, param1 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, param1 * w, 0).close())
  geo.spot1 = go.Spot.TopLeft
  geo.spot2 = new go.Spot(0.7, 1)
  return geo
})

go.Shape.defineFigureGenerator('Cone1', function (shape, w, h) {
  var geo = new go.Geometry()
  var cpxOffset = KAPPA * 0.5
  var cpyOffset = KAPPA * 0.1
  var fig = new go.PathFigure(0, 0.9 * h, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.9 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.5 * w, h, w, (0.9 + cpyOffset) * h,
    (0.5 + cpxOffset) * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, 0.9 * h, (0.5 - cpxOffset) * w, h,
    0, (0.9 + cpyOffset) * h).close())
  geo.spot1 = new go.Spot(0.25, 0.5)
  geo.spot2 = new go.Spot(0.75, 0.97)
  return geo
})

go.Shape.defineFigureGenerator('Cone2', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, 0.9 * h, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Bezier, w, 0.9 * h, (1 - 0.85 / 0.9) * w, h,
    (0.85 / 0.9) * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.9 * h).close())
  var fig2 = new go.PathFigure(0, 0.9 * h, false)
  geo.add(fig2)
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, w, 0.9 * h, (1 - 0.85 / 0.9) * w, 0.8 * h,
    (0.85 / 0.9) * w, 0.8 * h))
  geo.spot1 = new go.Spot(0.25, 0.5)
  geo.spot2 = new go.Spot(0.75, 0.82)
  return geo
})

go.Shape.defineFigureGenerator('Cube1', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0.5 * w, h, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.85 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.15 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.15 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.85 * h).close())
  var fig2 = new go.PathFigure(0.5 * w, h, false)
  geo.add(fig2)
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0.3 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0, 0.15 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Move, 0.5 * w, 0.3 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, w, 0.15 * h))
  geo.spot1 = new go.Spot(0, 0.3)
  geo.spot2 = new go.Spot(0.5, 0.85)
  return geo
})

go.Shape.defineFigureGenerator('Cube2', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, 0.3 * h, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.7 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.7 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.3 * w, 0).close())
  var fig2 = new go.PathFigure(0, 0.3 * h, false)
  geo.add(fig2)
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.7 * w, 0.3 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, w, 0))
  fig2.add(new go.PathSegment(go.PathSegment.Move, 0.7 * w, 0.3 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.7 * w, h))
  geo.spot1 = new go.Spot(0, 0.3)
  geo.spot2 = new go.Spot(0.7, 1)
  return geo
})

go.Shape.defineFigureGenerator('Cylinder1', function (shape, w, h) {
  var geo = new go.Geometry()
  var cpxOffset = KAPPA * 0.5
  var cpyOffset = KAPPA * 0.1
  var fig = new go.PathFigure(0, 0.1 * h, true)
  geo.add(fig)

  // The base (top)
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.5 * w, 0, 0, (0.1 - cpyOffset) * h,
    (0.5 - cpxOffset) * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 1.0 * w, 0.1 * h, (0.5 + cpxOffset) * w, 0,
    1.0 * w, (0.1 - cpyOffset) * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.9 * h))
  // Bottom curve
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.5 * w, 1.0 * h, 1.0 * w, (0.9 + cpyOffset) * h,
    (0.5 + cpxOffset) * w, 1.0 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, 0.9 * h, (0.5 - cpxOffset) * w, 1.0 * h,
    0, (0.9 + cpyOffset) * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.1 * h))
  var fig2 = new go.PathFigure(0, 0.1 * h, false)
  geo.add(fig2)
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, 0.5 * w, 0.2 * h, 0, (0.1 + cpyOffset) * h,
    (0.5 - cpxOffset) * w, 0.2 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, 1.0 * w, 0.1 * h, (0.5 + cpxOffset) * w, 0.2 * h,
    1.0 * w, (0.1 + cpyOffset) * h))
  geo.spot1 = new go.Spot(0, 0.2)
  geo.spot2 = new go.Spot(1, 0.9)
  return geo
})

go.Shape.defineFigureGenerator('Cylinder2', function (shape, w, h) {
  var geo = new go.Geometry()
  var cpxOffset = KAPPA * 0.5
  var cpyOffset = KAPPA * 0.1
  var fig = new go.PathFigure(0, 0.9 * h, true)
  geo.add(fig)

  // The body, starting and ending bottom left
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.1 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.5 * w, 0, 0, (0.1 - cpyOffset) * h,
    (0.5 - cpxOffset) * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, w, 0.1 * h, (0.5 + cpxOffset) * w, 0,
    w, (0.1 - cpyOffset) * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.9 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.5 * w, h, w, (0.9 + cpyOffset) * h,
    (0.5 + cpxOffset) * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, 0.9 * h, (0.5 - cpxOffset) * w, h,
    0, (0.9 + cpyOffset) * h))
  var fig2 = new go.PathFigure(0, 0.9 * h, false)
  geo.add(fig2)
  // The base (bottom)
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, 0.5 * w, 0.8 * h, 0, (0.9 - cpyOffset) * h,
    (0.5 - cpxOffset) * w, 0.8 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, w, 0.9 * h, (0.5 + cpxOffset) * w, 0.8 * h,
    w, (0.9 - cpyOffset) * h))
  geo.spot1 = new go.Spot(0, 0.1)
  geo.spot2 = new go.Spot(1, 0.8)
  return geo
})

go.Shape.defineFigureGenerator('Cylinder3', function (shape, w, h) {
  var geo = new go.Geometry()
  var cpxOffset = KAPPA * 0.1
  var cpyOffset = KAPPA * 0.5
  var fig = new go.PathFigure(0.1 * w, 0, true)
  geo.add(fig)

  // The body, starting and ending top left
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.9 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, w, 0.5 * h, (0.9 + cpxOffset) * w, 0,
    w, (0.5 - cpyOffset) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.9 * w, h, w, (0.5 + cpyOffset) * h,
    (0.9 + cpxOffset) * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.1 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, 0.5 * h, (0.1 - cpxOffset) * w, h,
    0, (0.5 + cpyOffset) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.1 * w, 0, 0, (0.5 - cpyOffset) * h,
    (0.1 - cpxOffset) * w, 0))
  var fig2 = new go.PathFigure(0.1 * w, 0, false)
  geo.add(fig2)
  // Cylinder line (left)
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, 0.2 * w, 0.5 * h, (0.1 + cpxOffset) * w, 0,
    0.2 * w, (0.5 - cpyOffset) * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, 0.1 * w, h, 0.2 * w, (0.5 + cpyOffset) * h,
    (0.1 + cpxOffset) * w, h))
  geo.spot1 = new go.Spot(0.2, 0)
  geo.spot2 = new go.Spot(0.9, 1)
  return geo
})

go.Shape.defineFigureGenerator('Cylinder4', function (shape, w, h) {
  var geo = new go.Geometry()
  var cpxOffset = KAPPA * 0.1
  var cpyOffset = KAPPA * 0.5
  var fig = new go.PathFigure(0.9 * w, 0, true)
  geo.add(fig)

  // The body, starting and ending top right
  fig.add(new go.PathSegment(go.PathSegment.Bezier, w, 0.5 * h, (0.9 + cpxOffset) * w, 0,
    w, (0.5 - cpyOffset) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.9 * w, h, w, (0.5 + cpyOffset) * h,
    (0.9 + cpxOffset) * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.1 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, 0.5 * h, (0.1 - cpxOffset) * w, h,
    0, (0.5 + cpyOffset) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.1 * w, 0, 0, (0.5 - cpyOffset) * h,
    (0.1 - cpxOffset) * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.9 * w, 0))
  var fig2 = new go.PathFigure(0.9 * w, 0, false)
  geo.add(fig2)
  // Cylinder line (right)
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, 0.8 * w, 0.5 * h, (0.9 - cpxOffset) * w, 0,
    0.8 * w, (0.5 - cpyOffset) * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, 0.9 * w, h, 0.8 * w, (0.5 + cpyOffset) * h,
    (0.9 - cpxOffset) * w, h))
  geo.spot1 = new go.Spot(0.1, 0)
  geo.spot2 = new go.Spot(0.8, 1)
  return geo
})

go.Shape.defineFigureGenerator('Prism1', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0.25 * w, 0.25 * h, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close())
  var fig2 = new go.PathFigure(0.25 * w, 0.25 * h, false)
  geo.add(fig2)
  // Inner prism line
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, h))
  geo.spot1 = new go.Spot(0.408, 0.172)
  geo.spot2 = new go.Spot(0.833, 0.662)
  return geo
})

go.Shape.defineFigureGenerator('Prism2', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, 0.25 * h, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.25 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0.75 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close())
  var fig2 = new go.PathFigure(0, h, false)
  geo.add(fig2)
  // Inner prism lines
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.25 * w, 0.5 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, w, 0.25 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Move, 0, 0.25 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.25 * w, 0.5 * h))
  geo.spot1 = new go.Spot(0.25, 0.5)
  geo.spot2 = new go.Spot(0.75, 0.75)
  return geo
})

go.Shape.defineFigureGenerator('Pyramid1', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0.5 * w, 0, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.75 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.75 * h).close())
  var fig2 = new go.PathFigure(0.5 * w, 0, false)
  geo.add(fig2)
  // Inner pyramind line
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, h))
  geo.spot1 = new go.Spot(0.25, 0.367)
  geo.spot2 = new go.Spot(0.75, 0.875)
  return geo
})

go.Shape.defineFigureGenerator('Pyramid2', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0.5 * w, 0, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.85 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.85 * h).close())
  var fig2 = new go.PathFigure(0.5 * w, 0, false)
  geo.add(fig2)
  // Inner pyramid lines
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0.7 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0, 0.85 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Move, 0.5 * w, 0.7 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, w, 0.85 * h))
  geo.spot1 = new go.Spot(0.25, 0.367)
  geo.spot2 = new go.Spot(0.75, 0.875)
  return geo
})

go.Shape.defineFigureGenerator('Actor', function (shape, w, h) {
  var geo = new go.Geometry()
  var radiusw = 0.2
  var radiush = 0.1
  var offsetw = KAPPA * radiusw
  var offseth = KAPPA * radiush
  var centerx = 0.5
  var centery = 0.1
  var fig = new go.PathFigure(centerx * w, (centery + radiush) * h, true)
  geo.add(fig)

  // Head
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (centerx - radiusw) * w, centery * h, (centerx - offsetw) * w, (centery + radiush) * h,
  (centerx - radiusw) * w, (centery + offseth) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery - radiush) * h, (centerx - radiusw) * w, (centery - offseth) * h,
  (centerx - offsetw) * w, (centery - radiush) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + radiusw) * w, centery * h, (centerx + offsetw) * w, (centery - radiush) * h,
  (centerx + radiusw) * w, (centery - offseth) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery + radiush) * h, (centerx + radiusw) * w, (centery + offseth) * h,
  (centerx + offsetw) * w, (centery + radiush) * h))
  var r = 0.05
  var cpOffset = KAPPA * r
  centerx = 0.05
  centery = 0.25
  var fig2 = new go.PathFigure(0.5 * w, 0.2 * h, true)
  geo.add(fig2)
  // Body
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.95 * w, 0.2 * h))
  centerx = 0.95
  centery = 0.25
  // Right arm
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + r) * w, centery * h, (centerx + cpOffset) * w, (centery - r) * h,
  (centerx + r) * w, (centery - cpOffset) * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, w, 0.6 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.85 * w, 0.6 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.85 * w, 0.35 * h))
  r = 0.025
  cpOffset = KAPPA * r
  centerx = 0.825
  centery = 0.35
  // Right under arm
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery - r) * h, (centerx + r) * w, (centery - cpOffset) * h,
  (centerx + cpOffset) * w, (centery - r) * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, (centerx - r) * w, centery * h, (centerx - cpOffset) * w, (centery - r) * h,
  (centerx - r) * w, (centery - cpOffset) * h))
  // Right side/leg
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.8 * w, h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.55 * w, h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.55 * w, 0.7 * h))
  // Right in between
  r = 0.05
  cpOffset = KAPPA * r
  centerx = 0.5
  centery = 0.7
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery - r) * h, (centerx + r) * w, (centery - cpOffset) * h,
  (centerx + cpOffset) * w, (centery - r) * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, (centerx - r) * w, centery * h, (centerx - cpOffset) * w, (centery - r) * h,
  (centerx - r) * w, (centery - cpOffset) * h))
  // Left side/leg
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.45 * w, h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.2 * w, h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.2 * w, 0.35 * h))
  r = 0.025
  cpOffset = KAPPA * r
  centerx = 0.175
  centery = 0.35
  // Left under arm
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery - r) * h, (centerx + r) * w, (centery - cpOffset) * h,
  (centerx + cpOffset) * w, (centery - r) * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, (centerx - r) * w, centery * h, (centerx - cpOffset) * w, (centery - r) * h,
  (centerx - r) * w, (centery - cpOffset) * h))
  // Left arm
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.15 * w, 0.6 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0, 0.6 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0, 0.25 * h))
  r = 0.05
  cpOffset = KAPPA * r
  centerx = 0.05
  centery = 0.25
  // Left shoulder
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery - r) * h, (centerx - r) * w, (centery - cpOffset) * h,
  (centerx - cpOffset) * w, (centery - r) * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0.2 * h))
  geo.spot1 = new go.Spot(0.2, 0.2)
  geo.spot2 = new go.Spot(0.8, 0.65)
  return geo
})

// JC
// adding parameter to make top corner size adjustable
// these are going to have to be adjusted
go.Shape.setFigureParameter('Card', 0, new FigureParameter('CornerCutoutSize', 0.2, 0.1, 0.9)) // the cutout in the corner
go.Shape.defineFigureGenerator('Card', function (shape, w, h) {
  var geo = new go.Geometry()
  var param1 = shape ? shape.parameter1 : NaN
  if (isNaN(param1)) param1 = 0.2 // Distance between left and inner rect
  var fig = new go.PathFigure(w, 0, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, param1 * h)) // .2 * h
  fig.add(new go.PathSegment(go.PathSegment.Line, param1 * w, 0).close()) // creates the line segment
  // then reconnects to the rest of the points
  geo.spot1 = new go.Spot(0, 0.2)
  geo.spot2 = go.Spot.BottomRight
  return geo
})

go.Shape.defineFigureGenerator('Collate', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0.5 * w, 0.5 * h, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0.5 * h))
  var fig2 = new go.PathFigure(0.5 * w, 0.5 * h, true)
  geo.add(fig2)
  fig2.add(new go.PathSegment(go.PathSegment.Line, w, h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0, h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0.5 * h))
  geo.spot1 = new go.Spot(0.25, 0)
  geo.spot2 = new go.Spot(0.75, 0.25)
  return geo
})

go.Shape.defineFigureGenerator('CreateRequest', function (shape, w, h) {
  var geo = new go.Geometry()
  var param1 = shape ? shape.parameter1 : NaN
  if (isNaN(param1)) param1 = 0.1
  var fig = new go.PathFigure(0, 0, true)
  geo.add(fig)

  // Body
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close())
  var fig2 = new go.PathFigure(0, param1 * h, false)
  geo.add(fig2)
  // Inside lines
  fig2.add(new go.PathSegment(go.PathSegment.Line, w, param1 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Move, 0, (1 - param1) * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, w, (1 - param1) * h))
  // ??? geo.spot1 = new go.Spot(0, param1);
  // ??? geo.spot2 = new go.Spot(1, 1 - param1);
  return geo
})

go.Shape.defineFigureGenerator('Database', function (shape, w, h) {
  var geo = new go.Geometry()
  var cpxOffset = KAPPA * 0.5
  var cpyOffset = KAPPA * 0.1
  var fig = new go.PathFigure(w, 0.1 * h, true)
  geo.add(fig)

  // Body
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.9 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.5 * w, h, w, (0.9 + cpyOffset) * h,
    (0.5 + cpxOffset) * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, 0.9 * h, (0.5 - cpxOffset) * w, h,
    0, (0.9 + cpyOffset) * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.1 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.5 * w, 0, 0, (0.1 - cpyOffset) * h,
    (0.5 - cpxOffset) * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, w, 0.1 * h, (0.5 + cpxOffset) * w, 0,
    w, (0.1 - cpyOffset) * h))
  var fig2 = new go.PathFigure(w, 0.1 * h, false)
  geo.add(fig2)
  // Rings
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, 0.5 * w, 0.2 * h, w, (0.1 + cpyOffset) * h,
    (0.5 + cpxOffset) * w, 0.2 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, 0, 0.1 * h, (0.5 - cpxOffset) * w, 0.2 * h,
    0, (0.1 + cpyOffset) * h))
  fig2.add(new go.PathSegment(go.PathSegment.Move, w, 0.2 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, 0.5 * w, 0.3 * h, w, (0.2 + cpyOffset) * h,
    (0.5 + cpxOffset) * w, 0.3 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, 0, 0.2 * h, (0.5 - cpxOffset) * w, 0.3 * h,
    0, (0.2 + cpyOffset) * h))
  fig2.add(new go.PathSegment(go.PathSegment.Move, w, 0.3 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, 0.5 * w, 0.4 * h, w, (0.3 + cpyOffset) * h,
    (0.5 + cpxOffset) * w, 0.4 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, 0, 0.3 * h, (0.5 - cpxOffset) * w, 0.4 * h,
    0, (0.3 + cpyOffset) * h))
  geo.spot1 = new go.Spot(0, 0.4)
  geo.spot2 = new go.Spot(1, 0.9)
  return geo
})

go.Shape.defineFigureGenerator('DataStorage', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, 0, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.75 * w, h, w, 0, w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, 0, 0.25 * w, 0.9 * h, 0.25 * w, 0.1 * h).close())
  geo.spot1 = new go.Spot(0.226, 0)
  geo.spot2 = new go.Spot(0.81, 1)
  return geo
})

go.Shape.defineFigureGenerator('DiskStorage', function (shape, w, h) {
  var geo = new go.Geometry()
  var cpxOffset = KAPPA * 0.5
  var cpyOffset = KAPPA * 0.1
  var fig = new go.PathFigure(w, 0.1 * h, true)
  geo.add(fig)

  // Body
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.9 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.5 * w, h, w, (0.9 + cpyOffset) * h,
    (0.5 + cpxOffset) * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, 0.9 * h, (0.5 - cpxOffset) * w, h,
    0, (0.9 + cpyOffset) * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.1 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.5 * w, 0, 0, (0.1 - cpyOffset) * h,
    (0.5 - cpxOffset) * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, w, 0.1 * h, (0.5 + cpxOffset) * w, 0,
    w, (0.1 - cpyOffset) * h))
  var fig2 = new go.PathFigure(w, 0.1 * h, false)
  geo.add(fig2)
  // Rings
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, 0.5 * w, 0.2 * h, w, (0.1 + cpyOffset) * h,
    (0.5 + cpxOffset) * w, 0.2 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, 0, 0.1 * h, (0.5 - cpxOffset) * w, 0.2 * h,
    0, (0.1 + cpyOffset) * h))
  fig2.add(new go.PathSegment(go.PathSegment.Move, w, 0.2 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, 0.5 * w, 0.3 * h, w, (0.2 + cpyOffset) * h,
    (0.5 + cpxOffset) * w, 0.3 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, 0, 0.2 * h, (0.5 - cpxOffset) * w, 0.3 * h,
    0, (0.2 + cpyOffset) * h))
  geo.spot1 = new go.Spot(0, 0.3)
  geo.spot2 = new go.Spot(1, 0.9)
  return geo
})

go.Shape.defineFigureGenerator('Display', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0.25 * w, 0, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.75 * w, h, w, 0, w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.25 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.5 * h).close())
  geo.spot1 = new go.Spot(0.25, 0)
  geo.spot2 = new go.Spot(0.75, 1)
  return geo
})

go.Shape.defineFigureGenerator('DividedEvent', function (shape, w, h) {
  var geo = new go.Geometry()
  var param1 = shape ? shape.parameter1 : NaN
  if (isNaN(param1)) param1 = 0.2
  else if (param1 < 0.15) param1 = 0.15 // Minimum
  var cpOffset = KAPPA * 0.2
  var fig = new go.PathFigure(0, 0.2 * h, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.2 * w, 0, 0, (0.2 - cpOffset) * h,
    (0.2 - cpOffset) * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.8 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, w, 0.2 * h, (0.8 + cpOffset) * w, 0,
    w, (0.2 - cpOffset) * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.8 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.8 * w, h, w, (0.8 + cpOffset) * h,
    (0.8 + cpOffset) * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.2 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, 0.8 * h, (0.2 - cpOffset) * w, h,
    0, (0.8 + cpOffset) * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.2 * h))
  var fig2 = new go.PathFigure(0, param1 * h, false)
  geo.add(fig2)
  fig2.add(new go.PathSegment(go.PathSegment.Line, w, param1 * h))
  // ??? geo.spot1 = new go.Spot(0, param1);
  // ??? geo.spot2 = new go.Spot(1, 1 - param1);
  return geo
})

go.Shape.defineFigureGenerator('DividedProcess', function (shape, w, h) {
  var geo = new go.Geometry()
  var param1 = shape ? shape.parameter1 : NaN
  if (isNaN(param1) || param1 < 0.1) param1 = 0.1 // Minimum
  var fig = new go.PathFigure(0, 0, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close())
  var fig2 = new go.PathFigure(0, param1 * h, false)
  geo.add(fig2)
  fig2.add(new go.PathSegment(go.PathSegment.Line, w, param1 * h))
  // ??? geo.spot1 = new go.Spot(0, param1);
  // ??? geo.spot2 = go.Spot.BottomRight;
  return geo
})

go.Shape.defineFigureGenerator('Document', function (shape, w, h) {
  var geo = new go.Geometry()
  h = h / 0.8
  var fig = new go.PathFigure(0, 0.7 * h, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.7 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, 0.7 * h, 0.5 * w, 0.4 * h, 0.5 * w, h).close())
  geo.spot1 = go.Spot.TopLeft
  geo.spot2 = new go.Spot(1, 0.6)
  return geo
})

go.Shape.defineFigureGenerator('ExternalOrganization', function (shape, w, h) {
  var geo = new go.Geometry()
  var param1 = shape ? shape.parameter1 : NaN
  if (isNaN(param1) || param1 < 0.2) param1 = 0.2 // Minimum
  var fig = new go.PathFigure(0, 0, true)
  geo.add(fig)

  // Body
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close())
  var fig2 = new go.PathFigure(param1 * w, 0, false)
  geo.add(fig2)
  // Top left triangle
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0, param1 * h))
  // Top right triangle
  fig2.add(new go.PathSegment(go.PathSegment.Move, w, param1 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, (1 - param1) * w, 0))
  // Bottom left triangle
  fig2.add(new go.PathSegment(go.PathSegment.Move, 0, (1 - param1) * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, param1 * w, h))
  // Bottom right triangle
  fig2.add(new go.PathSegment(go.PathSegment.Move, (1 - param1) * w, h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, w, (1 - param1) * h))
  // ??? geo.spot1 = new go.Spot(param1 / 2, param1 / 2);
  // ??? geo.spot2 = new go.Spot(1 - param1 / 2, 1 - param1 / 2);
  return geo
})

go.Shape.defineFigureGenerator('ExternalProcess', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0.5 * w, 0, true)
  geo.add(fig)

  // Body
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.5 * h).close())
  var fig2 = new go.PathFigure(0.1 * w, 0.4 * h, false)
  geo.add(fig2)
  // Top left triangle
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.1 * w, 0.6 * h))
  // Top right triangle
  fig2.add(new go.PathSegment(go.PathSegment.Move, 0.9 * w, 0.6 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.9 * w, 0.4 * h))
  // Bottom left triangle
  fig2.add(new go.PathSegment(go.PathSegment.Move, 0.6 * w, 0.1 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.4 * w, 0.1 * h))
  // Bottom right triangle
  fig2.add(new go.PathSegment(go.PathSegment.Move, 0.4 * w, 0.9 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.6 * w, 0.9 * h))
  geo.spot1 = new go.Spot(0.25, 0.25)
  geo.spot2 = new go.Spot(0.75, 0.75)
  return geo
})

// JC - work on this parameter
// go.Shape.setFigureParameter("File", 0, new FigureParameter(""))     // ???
go.Shape.defineFigureGenerator('File', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, 0, true) // starting point
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.25 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close())
  var fig2 = new go.PathFigure(0.75 * w, 0, false)
  geo.add(fig2)
  // The Fold
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0.25 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, w, 0.25 * h))
  geo.spot1 = new go.Spot(0, 0.25)
  geo.spot2 = go.Spot.BottomRight
  return geo
})

go.Shape.defineFigureGenerator('Interrupt', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(w, 0.5 * h, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.5 * h))
  var fig2 = new go.PathFigure(w, 0.5 * h, false)
  geo.add(fig2)
  fig2.add(new go.PathSegment(go.PathSegment.Line, w, h))
  var fig3 = new go.PathFigure(w, 0.5 * h, false)
  geo.add(fig3)
  fig3.add(new go.PathSegment(go.PathSegment.Line, w, 0))
  geo.spot1 = new go.Spot(0, 0.25)
  geo.spot2 = new go.Spot(0.5, 0.75)
  return geo
})

go.Shape.defineFigureGenerator('InternalStorage', function (shape, w, h) {
  var geo = new go.Geometry()
  var param1 = shape ? shape.parameter1 : NaN
  var param2 = shape ? shape.parameter2 : NaN
  if (isNaN(param1)) param1 = 0.1 // Distance from left
  if (isNaN(param2)) param2 = 0.1 // Distance from top
  var fig = new go.PathFigure(0, 0, true)
  geo.add(fig)

  // The main body
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close())
  var fig2 = new go.PathFigure(param1 * w, 0, false)
  geo.add(fig2)
  // Two lines
  fig2.add(new go.PathSegment(go.PathSegment.Line, param1 * w, h))
  fig2.add(new go.PathSegment(go.PathSegment.Move, 0, param2 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, w, param2 * h))
  // ??? geo.spot1 = new go.Spot(param1, param2);
  // ??? geo.spot2 = go.Spot.BottomRight;
  return geo
})

go.Shape.defineFigureGenerator('Junction', function (shape, w, h) {
  var geo = new go.Geometry()
  var dist = (1 / Math.SQRT2)
  var small = ((1 - 1 / Math.SQRT2) / 2)
  var cpOffset = KAPPA * 0.5
  var radius = 0.5
  var fig = new go.PathFigure(w, radius * h, true)
  geo.add(fig)

  // Circle
  fig.add(new go.PathSegment(go.PathSegment.Bezier, radius * w, h, w, (radius + cpOffset) * h,
    (radius + cpOffset) * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, radius * h, (radius - cpOffset) * w, h,
    0, (radius + cpOffset) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, radius * w, 0, 0, (radius - cpOffset) * h,
    (radius - cpOffset) * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, w, radius * h, (radius + cpOffset) * w, 0,
    w, (radius - cpOffset) * h))
  var fig2 = new go.PathFigure((small + dist) * w, (small + dist) * h, false)
  geo.add(fig2)
  // X
  fig2.add(new go.PathSegment(go.PathSegment.Line, small * w, small * h))
  fig2.add(new go.PathSegment(go.PathSegment.Move, small * w, (small + dist) * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, (small + dist) * w, small * h))
  return geo
})

go.Shape.defineFigureGenerator('LinedDocument', function (shape, w, h) {
  var geo = new go.Geometry()
  h = h / 0.8
  var fig = new go.PathFigure(0, 0.7 * h, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.7 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, 0.7 * h, 0.5 * w, 0.4 * h, 0.5 * w, h).close())
  var fig2 = new go.PathFigure(0.1 * w, 0, false)
  geo.add(fig2)
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.1 * w, 0.75 * h))
  geo.spot1 = new go.Spot(0.1, 0)
  geo.spot2 = new go.Spot(1, 0.6)
  return geo
})

go.Shape.defineFigureGenerator('LoopLimit', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, h, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.25 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.25 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.25 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h).close())
  geo.spot1 = new go.Spot(0, 0.25)
  geo.spot2 = go.Spot.BottomRight
  return geo
})

go.Shape.defineFigureGenerator('MagneticTape', function (shape, w, h) {
  var geo = new go.Geometry()
  var cpOffset = KAPPA * 0.5
  var radius = 0.5
  var fig = new go.PathFigure(0.5 * w, h, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, radius * h, (radius - cpOffset) * w, h,
               0, (radius + cpOffset) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, radius * w, 0, 0, (radius - cpOffset) * h,
               (radius - cpOffset) * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, w, radius * h, (radius + cpOffset) * w, 0,
               w, (radius - cpOffset) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (radius + 0.1) * w, 0.9 * h, w, (radius + cpOffset) * h,
               (radius + cpOffset) * w, 0.9 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.9 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, h))
  geo.spot1 = new go.Spot(0.15, 0.15)
  geo.spot2 = new go.Spot(0.85, 0.8)
  return geo
})

go.Shape.defineFigureGenerator('ManualInput', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(w, 0, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.25 * h).close())
  geo.spot1 = new go.Spot(0, 0.25)
  geo.spot2 = go.Spot.BottomRight
  return geo
})

go.Shape.defineFigureGenerator('MessageFromUser', function (shape, w, h) {
  var geo = new go.Geometry()
  var param1 = shape ? shape.parameter1 : NaN
  if (isNaN(param1)) param1 = 0.7 // How far from the right the point is
  var fig = new go.PathFigure(0, 0, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, param1 * w, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close())
  geo.spot1 = go.Spot.TopLeft
  // ??? geo.spot2 = new go.Spot(param1, 1);
  return geo
})

go.Shape.defineFigureGenerator('MicroformProcessing', function (shape, w, h) {
  var geo = new go.Geometry()
  var param1 = shape ? shape.parameter1 : NaN
  if (isNaN(param1)) param1 = 0.25 // How far from the top/bottom the points are
  var fig = new go.PathFigure(0, 0, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, param1 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, (1 - param1) * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close())
  // ??? geo.spot1 = new go.Spot(0, param1);
  // ??? geo.spot2 = new go.Spot(1, 1 - param1);
  return geo
})

go.Shape.defineFigureGenerator('MicroformRecording', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, 0, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0.25 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.15 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.85 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0.75 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close())
  geo.spot1 = new go.Spot(0, 0.25)
  geo.spot2 = new go.Spot(1, 0.75)
  return geo
})

go.Shape.defineFigureGenerator('MultiDocument', function (shape, w, h) {
  var geo = new go.Geometry()
  h = h / 0.8
  var fig = new go.PathFigure(w, 0, true)
  geo.add(fig)

  // Outline
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.9 * w, 0.44 * h, 0.96 * w, 0.47 * h, 0.93 * w, 0.45 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.9 * w, 0.6 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.8 * w, 0.54 * h, 0.86 * w, 0.57 * h, 0.83 * w, 0.55 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.8 * w, 0.7 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, 0.7 * h, 0.4 * w, 0.4 * h, 0.4 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.2 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.1 * w, 0.2 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.1 * w, 0.1 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.2 * w, 0.1 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.2 * w, 0).close())
  var fig2 = new go.PathFigure(0.1 * w, 0.2 * h, false)
  geo.add(fig2)
  // Inside lines
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.8 * w, 0.2 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.8 * w, 0.54 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Move, 0.2 * w, 0.1 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.9 * w, 0.1 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.9 * w, 0.44 * h))
  geo.spot1 = new go.Spot(0, 0.25)
  geo.spot2 = new go.Spot(0.8, 0.77)
  return geo
})

go.Shape.defineFigureGenerator('MultiProcess', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0.1 * w, 0.1 * h, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0.2 * w, 0.1 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.2 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.8 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.9 * w, 0.8 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.9 * w, 0.9 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.8 * w, 0.9 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.8 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.2 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.1 * w, 0.2 * h).close())
  var fig2 = new go.PathFigure(0.2 * w, 0.1 * h, false)
  geo.add(fig2)
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.9 * w, 0.1 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.9 * w, 0.8 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Move, 0.1 * w, 0.2 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.8 * w, 0.2 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.8 * w, 0.9 * h))
  geo.spot1 = new go.Spot(0, 0.2)
  geo.spot2 = new go.Spot(0.8, 1)
  return geo
})

go.Shape.defineFigureGenerator('OfflineStorage', function (shape, w, h) {
  var geo = new go.Geometry()
  var param1 = shape ? shape.parameter1 : NaN
  if (isNaN(param1)) param1 = 0.1 // Distance between 2 top lines
  var l = 1 - param1 // Length of the top line
  var fig = new go.PathFigure(0, 0, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, h).close())
  var fig2 = new go.PathFigure(0.5 * param1 * w, param1 * h, false)
  geo.add(fig2)
  fig2.add(new go.PathSegment(go.PathSegment.Line, (1 - 0.5 * param1) * w, param1 * h))
  // ??? geo.spot1 = new go.Spot(l / 4 + .5 * param1, param1);
  // ??? geo.spot2 = new go.Spot(3 * l / 4 + .5 * param1, param1 + .5 * l);
  return geo
})

go.Shape.defineFigureGenerator('OffPageConnector', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, 0, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close())
  geo.spot1 = go.Spot.TopLeft
  geo.spot2 = new go.Spot(0.75, 1)
  return geo
})

go.Shape.defineFigureGenerator('Or', function (shape, w, h) {
  var geo = new go.Geometry()
  var cpOffset = KAPPA * 0.5
  var radius = 0.5
  var fig = new go.PathFigure(w, radius * h, true)
  geo.add(fig)

  // Circle
  fig.add(new go.PathSegment(go.PathSegment.Bezier, radius * w, h, w, (radius + cpOffset) * h,
    (radius + cpOffset) * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, radius * h, (radius - cpOffset) * w, h,
    0, (radius + cpOffset) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, radius * w, 0, 0, (radius - cpOffset) * h,
    (radius - cpOffset) * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, w, radius * h, (radius + cpOffset) * w, 0,
    w, (radius - cpOffset) * h))
  var fig2 = new go.PathFigure(w, 0.5 * h, false)
  geo.add(fig2)
  // +
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0, 0.5 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Move, 0.5 * w, h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0))
  return geo
})

go.Shape.defineFigureGenerator('PaperTape', function (shape, w, h) {
  var geo = new go.Geometry()
  h = h / 0.8
  var fig = new go.PathFigure(0, 0.7 * h, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.3 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, w, 0.3 * h, 0.5 * w, 0.6 * h,
    0.5 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.7 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, 0.7 * h, 0.5 * w, 0.4 * h,
    0.5 * w, h).close())
  geo.spot1 = new go.Spot(0, 0.49)
  geo.spot2 = new go.Spot(1, 0.75)
  return geo
})

go.Shape.defineFigureGenerator('PrimitiveFromCall', function (shape, w, h) {
  var geo = new go.Geometry()
  var param1 = shape ? shape.parameter1 : NaN
  var param2 = shape ? shape.parameter2 : NaN
  if (isNaN(param1)) param1 = 0.1 // Distance of left line from left
  if (isNaN(param2)) param2 = 0.3 // Distance of point from right
  var fig = new go.PathFigure(0, 0, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, (1 - param2) * w, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close())
  // ??? geo.spot1 = new go.Spot(param1, 0);
  // ??? geo.spot2 = new go.Spot(1 - param2, 1);
  return geo
})

go.Shape.defineFigureGenerator('PrimitiveToCall', function (shape, w, h) {
  var geo = new go.Geometry()
  var param1 = shape ? shape.parameter1 : NaN
  var param2 = shape ? shape.parameter2 : NaN
  if (isNaN(param1)) param1 = 0.1 // Distance of left line from left
  if (isNaN(param2)) param2 = 0.3 // Distance of top and bottom right corners from right
  var fig = new go.PathFigure(0, 0, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, (1 - param2) * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, (1 - param2) * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close())
  // ??? geo.spot1 = new go.Spot(param1, 0);
  // ??? geo.spot2 = new go.Spot(1 - param2, 1);
  return geo
})

go.Shape.defineFigureGenerator('Procedure', function (shape, w, h) {
  var geo = new go.Geometry()
  var param1 = shape ? shape.parameter1 : NaN
  // Distance of left  and right lines from edge
  if (isNaN(param1)) param1 = 0.1
  var fig = new go.PathFigure(0, 0, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close())
  var fig2 = new go.PathFigure((1 - param1) * w, 0, false)
  geo.add(fig2)
  fig2.add(new go.PathSegment(go.PathSegment.Line, (1 - param1) * w, h))
  fig2.add(new go.PathSegment(go.PathSegment.Move, param1 * w, 0))
  fig2.add(new go.PathSegment(go.PathSegment.Line, param1 * w, h))
  // ??? geo.spot1 = new go.Spot(param1, 0);
  // ??? geo.spot2 = new go.Spot(1 - param1, 1);
  return geo
})

go.Shape.defineFigureGenerator('Process', function (shape, w, h) {
  var geo = new go.Geometry()
  var param1 = shape ? shape.parameter1 : NaN
  if (isNaN(param1)) param1 = 0.1 // Distance of left  line from left edge
  var fig = new go.PathFigure(0, 0, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close())
  var fig2 = new go.PathFigure(param1 * w, 0, false)
  geo.add(fig2)
  fig2.add(new go.PathSegment(go.PathSegment.Line, param1 * w, h))
  // ??? geo.spot1 = new go.Spot(param1, 0);
  geo.spot2 = go.Spot.BottomRight
  return geo
})

go.Shape.defineFigureGenerator('Sort', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0.5 * w, 0, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.5 * h).close())
  var fig2 = new go.PathFigure(0, 0.5 * h, false)
  geo.add(fig2)
  fig2.add(new go.PathSegment(go.PathSegment.Line, w, 0.5 * h))
  geo.spot1 = new go.Spot(0.25, 0.25)
  geo.spot2 = new go.Spot(0.75, 0.5)
  return geo
})

go.Shape.defineFigureGenerator('Start', function (shape, w, h) {
  var geo = new go.Geometry()
  var param1 = shape ? shape.parameter1 : NaN
  if (isNaN(param1)) param1 = 0.25
  var fig = new go.PathFigure(param1 * w, 0, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Arc, 270, 180, 0.75 * w, 0.5 * h, 0.25 * w, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Arc, 90, 180, 0.25 * w, 0.5 * h, 0.25 * w, 0.5 * h))
  var geo = new go.Geometry()
  var fig2 = new go.PathFigure(param1 * w, 0, false)
  geo.add(fig2)
  fig2.add(new go.PathSegment(go.PathSegment.Line, param1 * w, h))
  fig2.add(new go.PathSegment(go.PathSegment.Move, (1 - param1) * w, 0))
  fig2.add(new go.PathSegment(go.PathSegment.Line, (1 - param1) * w, h))
  // ??? geo.spot1 = new go.Spot(param1, 0);
  // ??? geo.spot2 = new go.Spot((1 - param1), 1);
  return geo
})

go.Shape.defineFigureGenerator('Terminator', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0.25 * w, 0, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Arc, 270, 180, 0.75 * w, 0.5 * h, 0.25 * w, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Arc, 90, 180, 0.25 * w, 0.5 * h, 0.25 * w, 0.5 * h))
  geo.spot1 = new go.Spot(0.23, 0)
  geo.spot2 = new go.Spot(0.77, 1)
  return geo
})

go.Shape.defineFigureGenerator('TransmittalTape', function (shape, w, h) {
  var geo = new go.Geometry()
  var param1 = shape ? shape.parameter1 : NaN
  if (isNaN(param1)) param1 = 0.1 // Bottom line's distance from the point on the triangle
  var fig = new go.PathFigure(0, 0, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, (1 - param1) * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, (1 - param1) * h).close())
  geo.spot1 = go.Spot.TopLeft
  // ??? geo.spot2 = new go.Spot(1, 1 - param1);
  return geo
})

go.Shape.defineFigureGenerator('AndGate', function (shape, w, h) {
  var geo = new go.Geometry()
  var cpOffset = KAPPA * 0.5
  var fig = new go.PathFigure(0, 0, true)
  geo.add(fig)

  // The gate body
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, w, 0.5 * h, (0.5 + cpOffset) * w, 0,
    w, (0.5 - cpOffset) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.5 * w, h, w, (0.5 + cpOffset) * h,
    (0.5 + cpOffset) * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close())
  geo.spot1 = go.Spot.TopLeft
  geo.spot2 = new go.Spot(0.55, 1)
  return geo
})

go.Shape.defineFigureGenerator('Buffer', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, 0, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close())
  geo.spot1 = new go.Spot(0, 0.25)
  geo.spot2 = new go.Spot(0.5, 0.75)
  return geo
})

go.Shape.defineFigureGenerator('Clock', function (shape, w, h) {
  var geo = new go.Geometry()
  var cpOffset = KAPPA * 0.5
  var radius = 0.5
  var fig = new go.PathFigure(w, radius * h, true)
  geo.add(fig)

  // Ellipse
  fig.add(new go.PathSegment(go.PathSegment.Bezier, radius * w, h, w, (radius + cpOffset) * h,
    (radius + cpOffset) * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, radius * h, (radius - cpOffset) * w, h,
    0, (radius + cpOffset) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, radius * w, 0, 0, (radius - cpOffset) * h,
    (radius - cpOffset) * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, w, radius * h, (radius + cpOffset) * w, 0,
    w, (radius - cpOffset) * h))
  var fig2 = new go.PathFigure(w, radius * h, false)
  geo.add(fig2)
  fig2.add(new go.PathSegment(go.PathSegment.Line, w, radius * h))
  var fig3 = new go.PathFigure(0.8 * w, 0.75 * h, false)
  geo.add(fig3)
  // Inside clock
  // This first line solves a GDI+ graphical error with
  // more complex gradient brushes
  fig3.add(new go.PathSegment(go.PathSegment.Line, 0.8 * w, 0.25 * h))
  fig3.add(new go.PathSegment(go.PathSegment.Line, 0.6 * w, 0.25 * h))
  fig3.add(new go.PathSegment(go.PathSegment.Line, 0.6 * w, 0.75 * h))
  fig3.add(new go.PathSegment(go.PathSegment.Line, 0.4 * w, 0.75 * h))
  fig3.add(new go.PathSegment(go.PathSegment.Line, 0.4 * w, 0.25 * h))
  fig3.add(new go.PathSegment(go.PathSegment.Line, 0.2 * w, 0.25 * h))
  fig3.add(new go.PathSegment(go.PathSegment.Line, 0.2 * w, 0.75 * h))
  return geo
})

go.Shape.defineFigureGenerator('Ground', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0.5 * w, 0, false)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0.4 * h))
  fig.add(new go.PathSegment(go.PathSegment.Move, 0.2 * w, 0.6 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.8 * w, 0.6 * h))
  fig.add(new go.PathSegment(go.PathSegment.Move, 0.3 * w, 0.8 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.7 * w, 0.8 * h))
  fig.add(new go.PathSegment(go.PathSegment.Move, 0.4 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.6 * w, h))
  return geo
})

go.Shape.defineFigureGenerator('Inverter', function (shape, w, h) {
  var geo = new go.Geometry()
  var cpOffset = KAPPA * 0.1
  var radius = 0.1
  var centerx = 0.9
  var centery = 0.5
  var fig = new go.PathFigure(0.8 * w, 0.5 * h, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.8 * w, 0.5 * h))
  var fig2 = new go.PathFigure((centerx + radius) * w, centery * h, true)
  geo.add(fig2)
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery + radius) * h, (centerx + radius) * w, (centery + cpOffset) * h,
    (centerx + cpOffset) * w, (centery + radius) * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, (centerx - radius) * w, centery * h, (centerx - cpOffset) * w, (centery + radius) * h,
    (centerx - radius) * w, (centery + cpOffset) * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery - radius) * h, (centerx - radius) * w, (centery - cpOffset) * h,
    (centerx - cpOffset) * w, (centery - radius) * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + radius) * w, centery * h, (centerx + cpOffset) * w, (centery - radius) * h,
    (centerx + radius) * w, (centery - cpOffset) * h))
  geo.spot1 = new go.Spot(0, 0.25)
  geo.spot2 = new go.Spot(0.4, 0.75)
  return geo
})

go.Shape.defineFigureGenerator('NandGate', function (shape, w, h) {
  var geo = new go.Geometry()
  var cpxOffset = KAPPA * 0.5
  var cpyOffset = KAPPA * 0.4
  var cpOffset = KAPPA * 0.1
  var radius = 0.1
  var centerx = 0.9
  var centery = 0.5
  var fig = new go.PathFigure(0.8 * w, 0.5 * h, true)
  geo.add(fig)

  // The gate body
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.4 * w, h, 0.8 * w, (0.5 + cpyOffset) * h,
    (0.4 + cpxOffset) * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.4 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.8 * w, 0.5 * h, (0.4 + cpxOffset) * w, 0,
    0.8 * w, (0.5 - cpyOffset) * h))
  var fig2 = new go.PathFigure((centerx + radius) * w, centery * h, true)
  geo.add(fig2)
  // Inversion
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery + radius) * h, (centerx + radius) * w, (centery + cpOffset) * h,
    (centerx + cpOffset) * w, (centery + radius) * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, (centerx - radius) * w, centery * h, (centerx - cpOffset) * w, (centery + radius) * h,
    (centerx - radius) * w, (centery + cpOffset) * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery - radius) * h, (centerx - radius) * w, (centery - cpOffset) * h,
    (centerx - cpOffset) * w, (centery - radius) * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + radius) * w, (centery) * h, (centerx + cpOffset) * w, (centery - radius) * h,
    (centerx + radius) * w, (centery - cpOffset) * h))
  geo.spot1 = new go.Spot(0, 0.05)
  geo.spot2 = new go.Spot(0.55, 0.95)
  return geo
})

go.Shape.defineFigureGenerator('NorGate', function (shape, w, h) {
  var geo = new go.Geometry()
  var radius = 0.5
  var cpOffset = KAPPA * radius
  var centerx = 0
  var centery = 0.5
  var fig = new go.PathFigure(0.8 * w, 0.5 * h, true)
  geo.add(fig)

  // Normal
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, h, 0.7 * w, (centery + cpOffset) * h,
    (centerx + cpOffset) * w, (centery + radius) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, 0, 0.25 * w, 0.75 * h,
    0.25 * w, 0.25 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.8 * w, 0.5 * h, (centerx + cpOffset) * w, (centery - radius) * h,
    0.7 * w, (centery - cpOffset) * h))
  radius = 0.1
  cpOffset = KAPPA * 0.1
  centerx = 0.9
  centery = 0.5
  var fig2 = new go.PathFigure((centerx - radius) * w, centery * h, true)
  geo.add(fig2)
  // Inversion
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery - radius) * h, (centerx - radius) * w, (centery - cpOffset) * h,
    (centerx - cpOffset) * w, (centery - radius) * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + radius) * w, centery * h, (centerx + cpOffset) * w, (centery - radius) * h,
    (centerx + radius) * w, (centery - cpOffset) * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery + radius) * h, (centerx + radius) * w, (centery + cpOffset) * h,
    (centerx + cpOffset) * w, (centery + radius) * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, (centerx - radius) * w, centery * h, (centerx - cpOffset) * w, (centery + radius) * h,
    (centerx - radius) * w, (centery + cpOffset) * h))
  geo.spot1 = new go.Spot(0.2, 0.25)
  geo.spot2 = new go.Spot(0.6, 0.75)
  return geo
})

go.Shape.defineFigureGenerator('OrGate', function (shape, w, h) {
  var geo = new go.Geometry()
  var radius = 0.5
  var cpOffset = KAPPA * radius
  var centerx = 0
  var centery = 0.5
  var fig = new go.PathFigure(0, 0, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Bezier, w, 0.5 * h, (centerx + cpOffset + cpOffset) * w, (centery - radius) * h,
    0.8 * w, (centery - cpOffset) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, h, 0.8 * w, (centery + cpOffset) * h,
    (centerx + cpOffset + cpOffset) * w, (centery + radius) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, 0, 0.25 * w, 0.75 * h, 0.25 * w, 0.25 * h).close())
  geo.spot1 = new go.Spot(0.2, 0.25)
  geo.spot2 = new go.Spot(0.75, 0.75)
  return geo
})

go.Shape.defineFigureGenerator('XnorGate', function (shape, w, h) {
  var geo = new go.Geometry()
  var radius = 0.5
  var cpOffset = KAPPA * radius
  var centerx = 0.2
  var centery = 0.5
  var fig = new go.PathFigure(0.1 * w, 0, false)
  geo.add(fig)

  // Normal
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.1 * w, h, 0.35 * w, 0.25 * h, 0.35 * w, 0.75 * h))
  var fig2 = new go.PathFigure(0.8 * w, 0.5 * h, true)
  geo.add(fig2)
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, 0.2 * w, h, 0.7 * w, (centery + cpOffset) * h,
    (centerx + cpOffset) * w, (centery + radius) * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, 0.2 * w, 0, 0.45 * w, 0.75 * h, 0.45 * w, 0.25 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, 0.8 * w, 0.5 * h, (centerx + cpOffset) * w, (centery - radius) * h,
    0.7 * w, (centery - cpOffset) * h))
  radius = 0.1
  cpOffset = KAPPA * 0.1
  centerx = 0.9
  centery = 0.5
  var fig3 = new go.PathFigure((centerx - radius) * w, centery * h, true)
  geo.add(fig3)
  // Inversion
  fig3.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery - radius) * h, (centerx - radius) * w, (centery - cpOffset) * h,
    (centerx - cpOffset) * w, (centery - radius) * h))
  fig3.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + radius) * w, centery * h, (centerx + cpOffset) * w, (centery - radius) * h,
    (centerx + radius) * w, (centery - cpOffset) * h))
  fig3.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery + radius) * h, (centerx + radius) * w, (centery + cpOffset) * h,
    (centerx + cpOffset) * w, (centery + radius) * h))
  fig3.add(new go.PathSegment(go.PathSegment.Bezier, (centerx - radius) * w, centery * h, (centerx - cpOffset) * w, (centery + radius) * h,
    (centerx - radius) * w, (centery + cpOffset) * h))
  geo.spot1 = new go.Spot(0.4, 0.25)
  geo.spot2 = new go.Spot(0.65, 0.75)
  return geo
})

go.Shape.defineFigureGenerator('XorGate', function (shape, w, h) {
  var geo = new go.Geometry()
  var radius = 0.5
  var cpOffset = KAPPA * radius
  var centerx = 0.2
  var centery = 0.5
  var fig = new go.PathFigure(0.1 * w, 0, false)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.1 * w, h, 0.35 * w, 0.25 * h, 0.35 * w, 0.75 * h))
  var fig2 = new go.PathFigure(0.2 * w, 0, true)
  geo.add(fig2)
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, w, 0.5 * h, (centerx + cpOffset) * w, (centery - radius) * h,
    0.9 * w, (centery - cpOffset) * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, 0.2 * w, h, 0.9 * w, (centery + cpOffset) * h,
    (centerx + cpOffset) * w, (centery + radius) * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, 0.2 * w, 0, 0.45 * w, 0.75 * h, 0.45 * w, 0.25 * h).close())
  geo.spot1 = new go.Spot(0.4, 0.25)
  geo.spot2 = new go.Spot(0.8, 0.75)
  return geo
})

go.Shape.defineFigureGenerator('Capacitor', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, 0, false)
  geo.add(fig)

  // Two vertical lines
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h))
  fig.add(new go.PathSegment(go.PathSegment.Move, w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h))
  return geo
})

go.Shape.defineFigureGenerator('Resistor', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, 0.5 * h, false)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0.1 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.2 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.3 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.4 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.6 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.7 * w, 0.5 * h))
  return geo
})

go.Shape.defineFigureGenerator('Inductor', function (shape, w, h) {
  var geo = new go.Geometry()
  var cpOffset = KAPPA * 0.1
  var radius = 0.1
  var centerx = 0.1
  var centery = 0.5
  // Up
  var fig = new go.PathFigure((centerx - cpOffset * 0.5) * w, h, false)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + radius) * w, 0, (centerx - cpOffset) * w, h, (centerx - radius) * w, 0))
  // Down up
  centerx = 0.3
  fig.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, h, (centerx + radius) * w, 0, (centerx + cpOffset) * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + radius) * w, 0, (centerx - cpOffset) * w, h, (centerx - radius) * w, 0))
  // Down up
  centerx = 0.5
  fig.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, h, (centerx + radius) * w, 0, (centerx + cpOffset) * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + radius) * w, 0, (centerx - cpOffset) * w, h, (centerx - radius) * w, 0))
  // Down up
  centerx = 0.7
  fig.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, h, (centerx + radius) * w, 0, (centerx + cpOffset) * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + radius) * w, 0, (centerx - cpOffset) * w, h, (centerx - radius) * w, 0))
  // Down up
  centerx = 0.9
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + cpOffset * 0.5) * w, h, (centerx + radius) * w, 0, (centerx + cpOffset) * w, h))
  return geo
})

go.Shape.defineFigureGenerator('ACvoltageSource', function (shape, w, h) {
  var geo = new go.Geometry()
  var cpOffset = KAPPA * 0.5
  var radius = 0.5
  var centerx = 0.5
  var centery = 0.5
  var fig = new go.PathFigure((centerx - radius) * w, centery * h, false)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery - radius) * h, (centerx - radius) * w, (centery - cpOffset) * h,
  (centerx - cpOffset) * w, (centery - radius) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + radius) * w, centery * h, (centerx + cpOffset) * w, (centery - radius) * h,
  (centerx + radius) * w, (centery - cpOffset) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery + radius) * h, (centerx + radius) * w, (centery + cpOffset) * h,
  (centerx + cpOffset) * w, (centery + radius) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (centerx - radius) * w, centery * h, (centerx - cpOffset) * w, (centery + radius) * h,
  (centerx - radius) * w, (centery + cpOffset) * h))
  fig.add(new go.PathSegment(go.PathSegment.Move, (centerx - radius + 0.1) * w, centery * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + radius - 0.1) * w, centery * h, centerx * w, (centery - radius) * h,
  centerx * w, (centery + radius) * h))
  return geo
})

go.Shape.defineFigureGenerator('DCvoltageSource', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, 0.75 * h, false)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.25 * h))
  fig.add(new go.PathSegment(go.PathSegment.Move, w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h))
  return geo
})

go.Shape.defineFigureGenerator('Diode', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(w, 0, false)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h))
  geo.spot1 = new go.Spot(0, 0.25)
  geo.spot2 = new go.Spot(0.5, 0.75)
  return geo
})

go.Shape.defineFigureGenerator('Wifi', function (shape, w, h) {
  var geo = new go.Geometry()
  var origw = w
  var origh = h
  w = w * 0.38
  h = h * 0.6
  var cpOffset = KAPPA * 0.8
  var radius = 0.8
  var centerx = 0
  var centery = 0.5
  var xOffset = (origw - w) / 2
  var yOffset = (origh - h) / 2
  var fig = new go.PathFigure(centerx * w + xOffset, (centery + radius) * h + yOffset, true)
  geo.add(fig)

  // Left curves
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (centerx - radius) * w + xOffset,
      centery * h + yOffset, (centerx - cpOffset) * w + xOffset,
      (centery + radius) * h + yOffset,
      (centerx - radius) * w + xOffset,
      (centery + cpOffset) * h + yOffset))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w + xOffset,
      (centery - radius) * h + yOffset, (centerx - radius) * w + xOffset,
      (centery - cpOffset) * h + yOffset,
      (centerx - cpOffset) * w + xOffset,
      (centery - radius) * h + yOffset))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (centerx - radius + cpOffset * 0.5) * w + xOffset,
      centery * h + yOffset, centerx * w + xOffset,
      (centery - radius) * h + yOffset,
      (centerx - radius + cpOffset * 0.5) * w + xOffset,
      (centery - cpOffset) * h + yOffset))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w + xOffset,
      (centery + radius) * h + yOffset, (centerx - radius + cpOffset * 0.5) * w + xOffset,
      (centery + cpOffset) * h + yOffset,
      centerx * w + xOffset,
      (centery + radius) * h + yOffset).close())
  cpOffset = KAPPA * 0.4
  radius = 0.4
  centerx = 0.2
  centery = 0.5
  var fig2 = new go.PathFigure(centerx * w + xOffset, (centery + radius) * h + yOffset, true)
  geo.add(fig2)
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, (centerx - radius) * w + xOffset,
      centery * h + yOffset, (centerx - cpOffset) * w + xOffset,
      (centery + radius) * h + yOffset,
      (centerx - radius) * w + xOffset,
      (centery + cpOffset) * h + yOffset))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w + xOffset,
      (centery - radius) * h + yOffset, (centerx - radius) * w + xOffset,
      (centery - cpOffset) * h + yOffset,
      (centerx - cpOffset) * w + xOffset,
      (centery - radius) * h + yOffset))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, (centerx - radius + cpOffset * 0.5) * w + xOffset,
      centery * h + yOffset, centerx * w + xOffset,
      (centery - radius) * h + yOffset,
      (centerx - radius + cpOffset * 0.5) * w + xOffset,
      (centery - cpOffset) * h + yOffset))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w + xOffset,
      (centery + radius) * h + yOffset, (centerx - radius + cpOffset * 0.5) * w + xOffset,
      (centery + cpOffset) * h + yOffset,
      centerx * w + xOffset,
      (centery + radius) * h + yOffset).close())
  cpOffset = KAPPA * 0.2
  radius = 0.2
  centerx = 0.5
  centery = 0.5
  var fig3 = new go.PathFigure((centerx - radius) * w + xOffset, centery * h + yOffset, true)
  geo.add(fig3)
  // Center circle
  fig3.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w + xOffset,
      (centery - radius) * h + yOffset, (centerx - radius) * w + xOffset,
      (centery - cpOffset) * h + yOffset,
      (centerx - cpOffset) * w + xOffset,
      (centery - radius) * h + yOffset))
  fig3.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + radius) * w + xOffset,
      centery * h + yOffset, (centerx + cpOffset) * w + xOffset,
      (centery - radius) * h + yOffset,
      (centerx + radius) * w + xOffset,
      (centery - cpOffset) * h + yOffset))
  fig3.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w + xOffset,
      (centery + radius) * h + yOffset, (centerx + radius) * w + xOffset,
      (centery + cpOffset) * h + yOffset,
      (centerx + cpOffset) * w + xOffset,
      (centery + radius) * h + yOffset))
  fig3.add(new go.PathSegment(go.PathSegment.Bezier, (centerx - radius) * w + xOffset,
      centery * h + yOffset, (centerx - cpOffset) * w + xOffset,
      (centery + radius) * h + yOffset,
      (centerx - radius) * w + xOffset,
      (centery + cpOffset) * h + yOffset))
  cpOffset = KAPPA * 0.4
  radius = 0.4
  centerx = 0.8
  centery = 0.5
  var fig4 = new go.PathFigure(centerx * w + xOffset, (centery - radius) * h + yOffset, true)
  geo.add(fig4)
  // Right curves
  fig4.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + radius) * w + xOffset,
      centery * h + yOffset, (centerx + cpOffset) * w + xOffset,
      (centery - radius) * h + yOffset,
      (centerx + radius) * w + xOffset,
      (centery - cpOffset) * h + yOffset))
  fig4.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w + xOffset,
      (centery + radius) * h + yOffset, (centerx + radius) * w + xOffset,
      (centery + cpOffset) * h + yOffset,
      (centerx + cpOffset) * w + xOffset,
      (centery + radius) * h + yOffset))
  fig4.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + radius - cpOffset * 0.5) * w + xOffset,
      centery * h + yOffset, centerx * w + xOffset,
      (centery + radius) * h + yOffset,
      (centerx + radius - cpOffset * 0.5) * w + xOffset,
      (centery + cpOffset) * h + yOffset))
  fig4.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w + xOffset,
      (centery - radius) * h + yOffset, (centerx + radius - cpOffset * 0.5) * w + xOffset,
      (centery - cpOffset) * h + yOffset,
      centerx * w + xOffset,
      (centery - radius) * h + yOffset).close())
  cpOffset = KAPPA * 0.8
  radius = 0.8
  centerx = 1
  centery = 0.5
  var fig5 = new go.PathFigure(centerx * w + xOffset, (centery - radius) * h + yOffset, true)
  geo.add(fig5)
  fig5.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + radius) * w + xOffset,
      centery * h + yOffset, (centerx + cpOffset) * w + xOffset,
      (centery - radius) * h + yOffset,
      (centerx + radius) * w + xOffset,
      (centery - cpOffset) * h + yOffset))
  fig5.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w + xOffset,
      (centery + radius) * h + yOffset, (centerx + radius) * w + xOffset,
      (centery + cpOffset) * h + yOffset,
      (centerx + cpOffset) * w + xOffset,
      (centery + radius) * h + yOffset))
  fig5.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + radius - cpOffset * 0.5) * w + xOffset,
      centery * h + yOffset, centerx * w + xOffset,
      (centery + radius) * h + yOffset,
      (centerx + radius - cpOffset * 0.5) * w + xOffset,
      (centery + cpOffset) * h + yOffset))
  fig5.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w + xOffset,
      (centery - radius) * h + yOffset, (centerx + radius - cpOffset * 0.5) * w + xOffset,
      (centery - cpOffset) * h + yOffset,
      centerx * w + xOffset,
      (centery - radius) * h + yOffset).close())
  return geo
})

go.Shape.defineFigureGenerator('Email', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, 0, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0).close())
  var fig2 = new go.PathFigure(0, 0, false)
  geo.add(fig2)
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0.6 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, w, 0))
  fig2.add(new go.PathSegment(go.PathSegment.Move, 0, h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.45 * w, 0.54 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Move, w, h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.55 * w, 0.54 * h))
  return geo
})

go.Shape.defineFigureGenerator('Ethernet', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0.35 * w, 0, true)
  geo.add(fig)
  // Boxes above the wire
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.65 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.65 * w, 0.4 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.35 * w, 0.4 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.35 * w, 0).close())
  var fig2 = new go.PathFigure(0.10 * w, h, true, true)
  geo.add(fig2)
  // Boxes under the wire
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.40 * w, h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.40 * w, 0.6 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.10 * w, 0.6 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.10 * w, h).close())
  var fig3 = new go.PathFigure(0.60 * w, h, true, true)
  geo.add(fig3)
  fig3.add(new go.PathSegment(go.PathSegment.Line, 0.90 * w, h))
  fig3.add(new go.PathSegment(go.PathSegment.Line, 0.90 * w, 0.6 * h))
  fig3.add(new go.PathSegment(go.PathSegment.Line, 0.60 * w, 0.6 * h))
  fig3.add(new go.PathSegment(go.PathSegment.Line, 0.60 * w, h).close())
  var fig4 = new go.PathFigure(0, 0.5 * h, false)
  geo.add(fig4)
  // Wire
  fig4.add(new go.PathSegment(go.PathSegment.Line, w, 0.5 * h))
  fig4.add(new go.PathSegment(go.PathSegment.Move, 0.5 * w, 0.5 * h))
  fig4.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0.4 * h))
  fig4.add(new go.PathSegment(go.PathSegment.Move, 0.75 * w, 0.5 * h))
  fig4.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0.6 * h))
  fig4.add(new go.PathSegment(go.PathSegment.Move, 0.25 * w, 0.5 * h))
  fig4.add(new go.PathSegment(go.PathSegment.Line, 0.25 * w, 0.6 * h))
  return geo
})

go.Shape.defineFigureGenerator('Power', function (shape, w, h) {
  var geo = new go.Geometry()
  var cpOffset = KAPPA * 0.4
  var radius = 0.4
  var centerx = 0.5
  var centery = 0.5
  var unused = tempPoint()
  var mid = tempPoint()
  var c1 = tempPoint()
  var c2 = tempPoint()
  // Find the 45 degree midpoint for the first bezier
  breakUpBezier(centerx, centery - radius,
      centerx + cpOffset, centery - radius,
      centerx + radius, centery - cpOffset,
      centerx + radius, centery, 0.5, unused,
      unused, mid, c1, c2)
  var start = tempPointAt(mid.x, mid.y)
  var fig = new go.PathFigure(mid.x * w, mid.y * h, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + radius) * w, centery * h, c1.x * w, c1.y * h, c2.x * w, c2.y * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery + radius) * h, (centerx + radius) * w, (centery + cpOffset) * h,
    (centerx + cpOffset) * w, (centery + radius) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (centerx - radius) * w, centery * h, (centerx - cpOffset) * w, (centery + radius) * h,
    (centerx - radius) * w, (centery + cpOffset) * h))
  // Find the 45 degree midpoint of for the fourth bezier
  breakUpBezier(centerx - radius, centery,
      centerx - radius, centery - cpOffset,
      centerx - cpOffset, centery - radius,
      centerx, centery - radius, 0.5, c1,
      c2, mid, unused, unused)
  fig.add(new go.PathSegment(go.PathSegment.Bezier, mid.x * w, mid.y * h, c1.x * w, c1.y * h,
    c2.x * w, c2.y * h))
  // now make a smaller circle
  cpOffset = KAPPA * 0.3
  radius = 0.3
  // Find the 45 degree midpoint for the first bezier
  breakUpBezier(centerx - radius, centery,
      centerx - radius, centery - cpOffset,
      centerx - cpOffset, centery - radius,
      centerx, centery - radius, 0.5, c1,
      c2, mid, unused, unused)
  fig.add(new go.PathSegment(go.PathSegment.Line, mid.x * w, mid.y * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (centerx - radius) * w, centery * h, c2.x * w, c2.y * h, c1.x * w, c1.y * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery + radius) * h, (centerx - radius) * w, (centery + cpOffset) * h,
    (centerx - cpOffset) * w, (centery + radius) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + radius) * w, centery * h, (centerx + cpOffset) * w, (centery + radius) * h,
    (centerx + radius) * w, (centery + cpOffset) * h))
  // Find the 45 degree midpoint for the fourth bezier
  breakUpBezier(centerx, centery - radius,
      centerx + cpOffset, centery - radius,
      centerx + radius, centery - cpOffset,
      centerx + radius, centery, 0.5, unused,
      unused, mid, c1, c2)
  fig.add(new go.PathSegment(go.PathSegment.Bezier, mid.x * w, mid.y * h, c2.x * w, c2.y * h, c1.x * w, c1.y * h).close())
  var fig = new go.PathFigure(0.45 * w, 0, true)
  geo.add(fig)
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.45 * w, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.55 * w, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.55 * w, 0).close())
  freePoint(unused)
  freePoint(mid)
  freePoint(c1)
  freePoint(c2)
  freePoint(start)
  geo.spot1 = new go.Spot(0.25, 0.45)
  geo.spot2 = new go.Spot(0.75, 0.8)
  return geo
})

go.Shape.defineFigureGenerator('Fallout', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, h / 2, true)
  geo.add(fig)

  // Containing circle
  fig.add(new go.PathSegment(go.PathSegment.Arc, 180, 360, w / 2, h / 2, w / 2, h / 2))

  function drawTriangle (fig, offsetx, offsety) {
    fig.add(new go.PathSegment(go.PathSegment.Move, (0.3 + offsetx) * w, (0.8 + offsety) * h))
    fig.add(new go.PathSegment(go.PathSegment.Line, (0.5 + offsetx) * w, (0.5 + offsety) * h))
    fig.add(new go.PathSegment(go.PathSegment.Line, (0.1 + offsetx) * w, (0.5 + offsety) * h))
    fig.add(new go.PathSegment(go.PathSegment.Line, (0.3 + offsetx) * w, (0.8 + offsety) * h).close())
  }

  // Triangles
  drawTriangle(fig, 0, 0)
  drawTriangle(fig, 0.4, 0)
  drawTriangle(fig, 0.2, -0.3)
  return geo
})

go.Shape.defineFigureGenerator('IrritationHazard', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0.2 * w, 0, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0.3 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.8 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.2 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.7 * w, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.8 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.8 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0.7 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.2 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.8 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.3 * w, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.2 * h).close())
  geo.spot1 = new go.Spot(0.3, 0.3)
  geo.spot2 = new go.Spot(0.7, 0.7)
  return geo
})

go.Shape.defineFigureGenerator('ElectricalHazard', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0.37 * w, 0, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0.11 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.77 * w, 0.04 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.33 * w, 0.49 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.37 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.63 * w, 0.86 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.77 * w, 0.91 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.34 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.34 * w, 0.78 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.44 * w, 0.8 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.65 * w, 0.56 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.68 * h).close())
  return geo
})

go.Shape.defineFigureGenerator('FireHazard', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0.1 * w, h, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.29 * w, 0, -0.25 * w, 0.63 * h,
  0.45 * w, 0.44 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.51 * w, 0.42 * h, 0.48 * w, 0.17 * h,
  0.54 * w, 0.35 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.59 * w, 0.18 * h, 0.59 * w, 0.29 * h,
  0.58 * w, 0.28 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.75 * w, 0.6 * h, 0.8 * w, 0.34 * h,
  0.88 * w, 0.43 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.88 * w, 0.31 * h, 0.87 * w, 0.48 * h,
  0.88 * w, 0.43 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.9 * w, h, 1.17 * w, 0.76 * h,
  0.82 * w, 0.8 * h).close())
  geo.spot1 = new go.Spot(0.07, 0.445)
  geo.spot2 = new go.Spot(0.884, 0.958)
  return geo
})

go.Shape.defineFigureGenerator('BpmnActivityLoop', function (shape, w, h) {
  var geo = new go.Geometry()
  var r = 0.5
  var cx = 0 // offset from Center x
  var cy = 0 // offset from Center y
  var d = r * KAPPA
  var mx1 = (0.4 * Math.SQRT2 / 2 + 0.5)
  var my1 = (0.5 - 0.5 * Math.SQRT2 / 2)
  var x1 = 1
  var y1 = 0.5
  var x2 = 0.5
  var y2 = 0
  var fig = new go.PathFigure(mx1 * w, (1 - my1) * h, false)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Bezier, x1 * w, y1 * h, x1 * w, 0.7 * h,
  x1 * w, y1 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (x2 + cx) * w, (y2 + cx) * h, (0.5 + r + cx) * w, (0.5 - d + cx) * h,
  (0.5 + d + cx) * w, (0.5 - r + cx) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (0.5 - r + cx) * w, (0.5 + cy) * h, (0.5 - d + cx) * w, (0.5 - r + cy) * h,
  (0.5 - r + cx) * w, (0.5 - d + cy) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (0.35 + cx) * w, 0.9 * h, (0.5 - r + cx) * w, (0.5 + d + cy) * h,
  (0.5 - d + cx) * w, 0.9 * h))
  // Arrowhead
  fig.add(new go.PathSegment(go.PathSegment.Move, (0.25 + cx) * w, 0.8 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, (0.35 + cx) * w, 0.9 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, (0.20 + cx) * w, 0.95 * h))
  return geo
})

go.Shape.defineFigureGenerator('BpmnActivityParallel', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, 0, false)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h))
  fig.add(new go.PathSegment(go.PathSegment.Move, 0.5 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Move, w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h))
  return geo
})

go.Shape.defineFigureGenerator('BpmnActivitySequential', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, 0, false)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Move, 0, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Move, 0, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h))
  return geo
})

go.Shape.defineFigureGenerator('BpmnActivityAdHoc', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, 0, false)
  geo.add(fig)

  var fig2 = new go.PathFigure(w, h, false)
  geo.add(fig2)
  var fig3 = new go.PathFigure(0, 0.5 * h, false)
  geo.add(fig3)
  fig3.add(new go.PathSegment(go.PathSegment.Bezier, 0.5 * w, 0.5 * h, 0.2 * w, 0.35 * h,
    0.3 * w, 0.35 * h))
  fig3.add(new go.PathSegment(go.PathSegment.Bezier, w, 0.5 * h, 0.7 * w, 0.65 * h,
    0.8 * w, 0.65 * h))
  return geo
})

go.Shape.defineFigureGenerator('BpmnActivityCompensation', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, 0.5 * h, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, h).close())
  return geo
})

go.Shape.defineFigureGenerator('BpmnTaskMessage', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, 0.2 * h, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.2 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.8 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.8 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.8 * h).close())
  var fig = new go.PathFigure(0, 0.2 * h, false)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.2 * h))
  return geo
})

go.Shape.defineFigureGenerator('BpmnTaskScript', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0.7 * w, h, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0.3 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.3 * w, 0, 0.6 * w, 0.5 * h,
  0, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.7 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.7 * w, h, 0.4 * w, 0.5 * h,
  w, 0.5 * h).close())
  var fig2 = new go.PathFigure(0.45 * w, 0.73 * h, false)
  geo.add(fig2)
  // Lines on script
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.7 * w, 0.73 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Move, 0.38 * w, 0.5 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.63 * w, 0.5 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Move, 0.31 * w, 0.27 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.56 * w, 0.27 * h))
  return geo
})

go.Shape.defineFigureGenerator('BpmnTaskUser', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, 0, false)
  geo.add(fig)

  var fig2 = new go.PathFigure(0.335 * w, (1 - 0.555) * h, true)
  geo.add(fig2)
  // Shirt
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.335 * w, (1 - 0.405) * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, (1 - 0.335) * w, (1 - 0.405) * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, (1 - 0.335) * w, (1 - 0.555) * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, w, 0.68 * h, (1 - 0.12) * w, 0.46 * h,
    (1 - 0.02) * w, 0.54 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, w, h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0, h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0, 0.68 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, 0.335 * w, (1 - 0.555) * h, 0.02 * w, 0.54 * h,
    0.12 * w, 0.46 * h))
  // Start of neck
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.365 * w, (1 - 0.595) * h))
  var radiushead = 0.5 - 0.285
  var centerx = 0.5
  var centery = radiushead
  var alpha2 = Math.PI / 4
  var KAPPA = ((4 * (1 - Math.cos(alpha2))) / (3 * Math.sin(alpha2)))
  var cpOffset = KAPPA * 0.5
  var radiusw = radiushead
  var radiush = radiushead
  var offsetw = KAPPA * radiusw
  var offseth = KAPPA * radiush
  // Circle (head)
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, (centerx - radiusw) * w, centery * h, (centerx - ((offsetw + radiusw) / 2)) * w, (centery + ((radiush + offseth) / 2)) * h,
    (centerx - radiusw) * w, (centery + offseth) * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery - radiush) * h, (centerx - radiusw) * w, (centery - offseth) * h,
    (centerx - offsetw) * w, (centery - radiush) * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + radiusw) * w, centery * h, (centerx + offsetw) * w, (centery - radiush) * h,
    (centerx + radiusw) * w, (centery - offseth) * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, (1 - 0.365) * w, (1 - 0.595) * h, (centerx + radiusw) * w, (centery + offseth) * h,
    (centerx + ((offsetw + radiusw) / 2)) * w, (centery + ((radiush + offseth) / 2)) * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, (1 - 0.365) * w, (1 - 0.595) * h))
  // Neckline
  fig2.add(new go.PathSegment(go.PathSegment.Line, (1 - 0.335) * w, (1 - 0.555) * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, (1 - 0.335) * w, (1 - 0.405) * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.335 * w, (1 - 0.405) * h))
  var fig3 = new go.PathFigure(0.2 * w, h, false)
  geo.add(fig3)
  // Arm lines
  fig3.add(new go.PathSegment(go.PathSegment.Line, 0.2 * w, 0.8 * h))
  var fig4 = new go.PathFigure(0.8 * w, h, false)
  geo.add(fig4)
  fig4.add(new go.PathSegment(go.PathSegment.Line, 0.8 * w, 0.8 * h))
  return geo
})

go.Shape.defineFigureGenerator('BpmnEventConditional', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0.1 * w, 0, true)
  geo.add(fig)

  // Body
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.9 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.9 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.1 * w, h).close())
  var fig2 = new go.PathFigure(0.2 * w, 0.2 * h, false)
  geo.add(fig2)
  // Inside lines
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.8 * w, 0.2 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Move, 0.2 * w, 0.4 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.8 * w, 0.4 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Move, 0.2 * w, 0.6 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.8 * w, 0.6 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Move, 0.2 * w, 0.8 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.8 * w, 0.8 * h))
  return geo
})

go.Shape.defineFigureGenerator('BpmnEventError', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, h, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0.33 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.66 * w, 0.50 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.66 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.33 * w, 0.50 * h).close())
  return geo
})

go.Shape.defineFigureGenerator('BpmnEventEscalation', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, 0, false)
  geo.add(fig)
  // Set dimensions
  var fig2 = new go.PathFigure(w, h, false)
  geo.add(fig2)
  var fig3 = new go.PathFigure(0.1 * w, h, true)
  geo.add(fig3)
  fig3.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0))
  fig3.add(new go.PathSegment(go.PathSegment.Line, 0.9 * w, h))
  fig3.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0.5 * h).close())
  return geo
})

go.Shape.defineFigureGenerator('Caution', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0.05 * w, h, true)
  geo.add(fig)
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.1 * w, 0.8 * h, 0, h, 0, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.45 * w, 0.1 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.55 * w, 0.1 * h, 0.5 * w, 0, 0.5 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.95 * w, 0.9 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.9 * w, h, w, h, w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.05 * w, h))
  var radius = 0.05
  // Bottom circle of exclamation point
  fig.add(new go.PathSegment(go.PathSegment.Move, (0.5 - radius) * w, 0.875 * h))
  fig.add(new go.PathSegment(go.PathSegment.Arc, 180, -360, 0.5 * w, 0.875 * h, radius * w, radius * h))
  // Upper rectangle of exclamation point
  fig.add(new go.PathSegment(go.PathSegment.Move, 0.5 * w, 0.75 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.5 * w, 0.325 * h, 0.575 * w, 0.725 * h, 0.625 * w, 0.375 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.5 * w, 0.75 * h, 0.375 * w, 0.375 * h, 0.425 * w, 0.725 * h))
  return geo
})

go.Shape.defineFigureGenerator('Recycle', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0.45 * w, 0.95 * h, false)
  geo.add(fig)

  // Bottom left arrow
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.2 * w, 0.95 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.185 * w, 0.85 * h, 0.17 * w, 0.95 * h, 0.15 * w, 0.9 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.235 * w, 0.75 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.30 * w, 0.625 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.35 * w, 0.65 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.275 * w, 0.45 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.05 * w, 0.45 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.1 * w, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.05 * w, 0.575 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.1875 * w, 0.95 * h, 0, 0.675 * h, 0, 0.7 * h))
  fig.add(new go.PathSegment(go.PathSegment.Move, 0.45 * w, 0.95 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.45 * w, 0.775 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.22 * w, 0.775 * h))
  var fig2 = new go.PathFigure(0.475 * w, 0.2 * h, false)
  geo.add(fig2)
  // Top arrow
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.4 * w, 0.4 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.225 * w, 0.3 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.275 * w, 0.175 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.325 * w, 0.05 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, 0.4 * w, 0.05 * h, 0.35 * w, 0, 0.375 * w, 0))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.575 * w, 0.375 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.525 * w, 0.4 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0.475 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.85 * w, 0.315 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.8 * w, 0.32 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.65 * w, 0.05 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, 0.575 * w, 0, 0.65 * w, 0.05 * h, 0.625 * w, 0))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.38 * w, 0.0105 * h))
  var fig3 = new go.PathFigure(0.675 * w, 0.575 * h, false)
  geo.add(fig3)
  // Bottom right arrow
  fig3.add(new go.PathSegment(go.PathSegment.Line, 0.875 * w, 0.525 * h))
  fig3.add(new go.PathSegment(go.PathSegment.Line, w, 0.775 * h))
  fig3.add(new go.PathSegment(go.PathSegment.Bezier, 0.85 * w, 0.95 * h, w, 0.8 * h, w, 0.85 * h))
  fig3.add(new go.PathSegment(go.PathSegment.Line, 0.65 * w, 0.95 * h))
  fig3.add(new go.PathSegment(go.PathSegment.Line, 0.65 * w, h))
  fig3.add(new go.PathSegment(go.PathSegment.Line, 0.55 * w, 0.85 * h))
  fig3.add(new go.PathSegment(go.PathSegment.Line, 0.65 * w, 0.725 * h))
  fig3.add(new go.PathSegment(go.PathSegment.Line, 0.65 * w, 0.775 * h))
  fig3.add(new go.PathSegment(go.PathSegment.Line, 0.7 * w, 0.775 * h))
  fig3.add(new go.PathSegment(go.PathSegment.Line, w, 0.775 * h))
  fig3.add(new go.PathSegment(go.PathSegment.Move, 0.675 * w, 0.575 * h))
  fig3.add(new go.PathSegment(go.PathSegment.Line, 0.775 * w, 0.775 * h))
  return geo
})

go.Shape.defineFigureGenerator('BpmnEventTimer', function (shape, w, h) {
  var geo = new go.Geometry()
  var radius = 0.5
  var cpOffset = KAPPA * 0.5
  var fig = new go.PathFigure(w, radius * h, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Bezier, radius * w, h, w, (radius + cpOffset) * h,
    (radius + cpOffset) * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, radius * h, (radius - cpOffset) * w, h,
    0, (radius + cpOffset) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, radius * w, 0, 0, (radius - cpOffset) * h,
    (radius - cpOffset) * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, w, radius * h, (radius + cpOffset) * w, 0,
    w, (radius - cpOffset) * h))
  var fig2 = new go.PathFigure(radius * w, 0, false)
  geo.add(fig2)
  // Hour lines
  fig2.add(new go.PathSegment(go.PathSegment.Line, radius * w, 0.15 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Move, radius * w, h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, radius * w, 0.85 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Move, 0, radius * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.15 * w, radius * h))
  fig2.add(new go.PathSegment(go.PathSegment.Move, w, radius * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.85 * w, radius * h))
  // Clock hands
  fig2.add(new go.PathSegment(go.PathSegment.Move, radius * w, radius * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.58 * w, 0.1 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Move, radius * w, radius * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.78 * w, 0.54 * h))
  return geo
})

go.Shape.defineFigureGenerator('Package', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, 0.15 * h, true)
  geo.add(fig)

  // Package bottom rectangle
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.15 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close())
  var fig2 = new go.PathFigure(0, 0.15 * h, true)
  geo.add(fig2)
  // Package top flap
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0, 0))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.6 * w, 0))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.65 * w, 0.15 * h).close())
  geo.spot1 = new go.Spot(0, 0.1)
  geo.spot2 = new go.Spot(1, 1)
  return geo
})

go.Shape.defineFigureGenerator('Class', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, 0, true)
  geo.add(fig)

  // Class box
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0).close())
  var fig2 = new go.PathFigure(0, 0.2 * h, false)
  geo.add(fig2)
  // Top box separater
  fig2.add(new go.PathSegment(go.PathSegment.Line, w, 0.2 * h).close())
  var fig3 = new go.PathFigure(0, 0.5 * h, false)
  geo.add(fig3)
  // Middle box separater
  fig3.add(new go.PathSegment(go.PathSegment.Line, w, 0.5 * h).close())
  return geo
})

go.Shape.defineFigureGenerator('Component', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(w, h, true)
  geo.add(fig)

  // Component Box
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.15 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.15 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h).close())
  var fig2 = new go.PathFigure(0, 0.2 * h, true)
  geo.add(fig2)
  // Component top sub box
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.45 * w, 0.2 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.45 * w, 0.4 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0, 0.4 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0, 0.2 * h).close())
  var fig3 = new go.PathFigure(0, 0.6 * h, true)
  geo.add(fig3)
  // Component bottom sub box
  fig3.add(new go.PathSegment(go.PathSegment.Line, 0.45 * w, 0.6 * h))
  fig3.add(new go.PathSegment(go.PathSegment.Line, 0.45 * w, 0.8 * h))
  fig3.add(new go.PathSegment(go.PathSegment.Line, 0, 0.8 * h))
  fig3.add(new go.PathSegment(go.PathSegment.Line, 0, 0.6 * h).close())
  return geo
})

go.Shape.defineFigureGenerator('Boat Shipment', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0.15 * w, 0.6 * h, true)
  geo.add(fig)

  // Boat shipment flag
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.15 * w, 0.6 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.6 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.15 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.85 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.6 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.85 * w, 0.6 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.15 * w, 0.6 * h))
  var fig2 = new go.PathFigure(0.15 * w, 0.6 * h, false)
  geo.add(fig2)
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.85 * w, 0.6 * h))
  return geo
})

go.Shape.defineFigureGenerator('Customer/Supplier', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(w, h, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.66 * w, 0.33 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.66 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.33 * w, 0.33 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.33 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.33 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h).close())
  return geo
})

go.Shape.defineFigureGenerator('Workcell', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, h, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.65 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.65 * w, 0.4 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.35 * w, 0.4 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.35 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close())
  return geo
})

go.Shape.defineFigureGenerator('Supermarket', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, 0, false)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.33 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.33 * h))
  fig.add(new go.PathSegment(go.PathSegment.Move, w, 0.33 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.66 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.66 * h))
  fig.add(new go.PathSegment(go.PathSegment.Move, w, 0.66 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h))
  return geo
})

go.Shape.defineFigureGenerator('TruckShipment', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, 0, true)
  geo.add(fig)

  // Left rectangle
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.6 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.6 * w, 0.8 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.8 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0).close())
  var fig2 = new go.PathFigure(w, 0.8 * h, true)
  geo.add(fig2)
  // Right rectangle
  fig2.add(new go.PathSegment(go.PathSegment.Line, w, 0.4 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.6 * w, 0.4 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.6 * w, 0.8 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, w, 0.8 * h).close())
  var radius = 0.1
  var cpOffset = KAPPA * 0.1
  var centerx = 0.2
  var centery = 0.9
  var fig3 = new go.PathFigure((centerx - radius) * w, centery * h, true)
  geo.add(fig3)
  // Left wheel
  fig3.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery - radius) * h, (centerx - radius) * w, (centery - cpOffset) * h,
      (centerx - cpOffset) * w, (centery - radius) * h))
  fig3.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + radius) * w, centery * h, (centerx + cpOffset) * w, (centery - radius) * h,
      (centerx + radius) * w, (centery - cpOffset) * h))
  fig3.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery + radius) * h, (centerx + radius) * w, (centery + cpOffset) * h,
      (centerx + cpOffset) * w, (centery + radius) * h))
  fig3.add(new go.PathSegment(go.PathSegment.Bezier, (centerx - radius) * w, centery * h, (centerx - cpOffset) * w, (centery + radius) * h,
      (centerx - radius) * w, (centery + cpOffset) * h).close())
  radius = 0.1
  cpOffset = KAPPA * 0.1
  centerx = 0.8
  centery = 0.9
  var fig4 = new go.PathFigure((centerx - radius) * w, centery * h, true)
  geo.add(fig4)
  // Right wheel
  fig4.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery - radius) * h, (centerx - radius) * w, (centery - cpOffset) * h,
      (centerx - cpOffset) * w, (centery - radius) * h))
  fig4.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + radius) * w, centery * h, (centerx + cpOffset) * w, (centery - radius) * h,
      (centerx + radius) * w, (centery - cpOffset) * h))
  fig4.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery + radius) * h, (centerx + radius) * w, (centery + cpOffset) * h,
      (centerx + cpOffset) * w, (centery + radius) * h))
  fig4.add(new go.PathSegment(go.PathSegment.Bezier, (centerx - radius) * w, centery * h, (centerx - cpOffset) * w, (centery + radius) * h,
      (centerx - radius) * w, (centery + cpOffset) * h).close())
  return geo
})

go.Shape.defineFigureGenerator('KanbanPost', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0.2 * w, 0, false)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0.2 * w, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.8 * w, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.8 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Move, 0.5 * w, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.2 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Move, 0.5 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.8 * w, h))
  return geo
})

go.Shape.defineFigureGenerator('Forklift', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, 0, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.4 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0))
  var fig2 = new go.PathFigure(0, 0.5 * h, true)
  geo.add(fig2)
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0, 0.8 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0.8 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0.5 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0, 0.5 * h))
  var fig3 = new go.PathFigure(0.50 * w, 0.8 * h, true)
  geo.add(fig3)
  fig3.add(new go.PathSegment(go.PathSegment.Line, 0.50 * w, 0.1 * h))
  fig3.add(new go.PathSegment(go.PathSegment.Line, 0.55 * w, 0.1 * h))
  fig3.add(new go.PathSegment(go.PathSegment.Line, 0.55 * w, 0.8 * h))
  fig3.add(new go.PathSegment(go.PathSegment.Line, 0.50 * w, 0.8 * h))
  var fig4 = new go.PathFigure(0.5 * w, 0.7 * h, false)
  geo.add(fig4)
  fig4.add(new go.PathSegment(go.PathSegment.Line, w, 0.7 * h))
  var radius = 0.1
  var cpOffset = KAPPA * 0.1
  var centerx = 0.1
  var centery = 0.9
  var fig5 = new go.PathFigure((centerx - radius) * w, centery * h, true)
  geo.add(fig5)
  fig5.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery - radius) * h, (centerx - radius) * w, (centery - cpOffset) * h,
    (centerx - cpOffset) * w, (centery - radius) * h))
  fig5.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + radius) * w, centery * h, (centerx + cpOffset) * w, (centery - radius) * h,
    (centerx + radius) * w, (centery - cpOffset) * h))
  fig5.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery + radius) * h, (centerx + radius) * w, (centery + cpOffset) * h,
    (centerx + cpOffset) * w, (centery + radius) * h))
  fig5.add(new go.PathSegment(go.PathSegment.Bezier, (centerx - radius) * w, centery * h, (centerx - cpOffset) * w, (centery + radius) * h,
    (centerx - radius) * w, (centery + cpOffset) * h))
  radius = 0.1
  cpOffset = KAPPA * 0.1
  centerx = 0.4
  centery = 0.9
  var fig6 = new go.PathFigure((centerx - radius) * w, centery * h, true)
  geo.add(fig6)
  fig6.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery - radius) * h, (centerx - radius) * w, (centery - cpOffset) * h,
    (centerx - cpOffset) * w, (centery - radius) * h))
  fig6.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + radius) * w, centery * h, (centerx + cpOffset) * w, (centery - radius) * h,
    (centerx + radius) * w, (centery - cpOffset) * h))
  fig6.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery + radius) * h, (centerx + radius) * w, (centery + cpOffset) * h,
    (centerx + cpOffset) * w, (centery + radius) * h))
  fig6.add(new go.PathSegment(go.PathSegment.Bezier, (centerx - radius) * w, centery * h, (centerx - cpOffset) * w, (centery + radius) * h,
    (centerx - radius) * w, (centery + cpOffset) * h))
  return geo
})

go.Shape.defineFigureGenerator('RailShipment', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0.1 * w, 0.4 * h, true)
  geo.add(fig)

  // Left cart
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.45 * w, 0.4 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.45 * w, 0.9 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.1 * w, 0.9 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.1 * w, 0.4 * h).close())
  var fig2 = new go.PathFigure(0.45 * w, 0.7 * h, false)
  geo.add(fig2)
  // Line connecting carts
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.55 * w, 0.7 * h))
  var fig3 = new go.PathFigure(0.55 * w, 0.4 * h, true)
  geo.add(fig3)
  // Right cart
  fig3.add(new go.PathSegment(go.PathSegment.Line, 0.9 * w, 0.4 * h))
  fig3.add(new go.PathSegment(go.PathSegment.Line, 0.9 * w, 0.9 * h))
  fig3.add(new go.PathSegment(go.PathSegment.Line, 0.55 * w, 0.9 * h))
  fig3.add(new go.PathSegment(go.PathSegment.Line, 0.55 * w, 0.4 * h).close())
  var radius = 0.05
  var cpOffset = KAPPA * 0.05
  var centerx = 0.175
  var centery = 0.95
  var fig4 = new go.PathFigure((centerx - radius) * w, centery * h, true)
  geo.add(fig4)
  // Wheels
  fig4.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery - radius) * h, (centerx - radius) * w, (centery - cpOffset) * h,
    (centerx - cpOffset) * w, (centery - radius) * h))
  fig4.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + radius) * w, centery * h, (centerx + cpOffset) * w, (centery - radius) * h,
    (centerx + radius) * w, (centery - cpOffset) * h))
  fig4.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery + radius) * h, (centerx + radius) * w, (centery + cpOffset) * h,
    (centerx + cpOffset) * w, (centery + radius) * h))
  fig4.add(new go.PathSegment(go.PathSegment.Bezier, (centerx - radius) * w, centery * h, (centerx - cpOffset) * w, (centery + radius) * h,
    (centerx - radius) * w, (centery + cpOffset) * h))
  var radius = 0.05
  var cpOffset = KAPPA * 0.05
  var centerx = 0.375
  var centery = 0.95
  var fig5 = new go.PathFigure((centerx - radius) * w, centery * h, true)
  geo.add(fig5)
  fig5.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery - radius) * h, (centerx - radius) * w, (centery - cpOffset) * h,
    (centerx - cpOffset) * w, (centery - radius) * h))
  fig5.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + radius) * w, centery * h, (centerx + cpOffset) * w, (centery - radius) * h,
    (centerx + radius) * w, (centery - cpOffset) * h))
  fig5.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery + radius) * h, (centerx + radius) * w, (centery + cpOffset) * h,
    (centerx + cpOffset) * w, (centery + radius) * h))
  fig5.add(new go.PathSegment(go.PathSegment.Bezier, (centerx - radius) * w, centery * h, (centerx - cpOffset) * w, (centery + radius) * h,
    (centerx - radius) * w, (centery + cpOffset) * h))
  var radius = 0.05
  var cpOffset = KAPPA * 0.05
  var centerx = 0.625
  var centery = 0.95
  var fig6 = new go.PathFigure((centerx - radius) * w, centery * h, true)
  geo.add(fig6)
  fig6.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery - radius) * h, (centerx - radius) * w, (centery - cpOffset) * h,
    (centerx - cpOffset) * w, (centery - radius) * h))
  fig6.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + radius) * w, centery * h, (centerx + cpOffset) * w, (centery - radius) * h,
    (centerx + radius) * w, (centery - cpOffset) * h))
  fig6.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery + radius) * h, (centerx + radius) * w, (centery + cpOffset) * h,
    (centerx + cpOffset) * w, (centery + radius) * h))
  fig6.add(new go.PathSegment(go.PathSegment.Bezier, (centerx - radius) * w, centery * h, (centerx - cpOffset) * w, (centery + radius) * h,
    (centerx - radius) * w, (centery + cpOffset) * h))
  var radius = 0.05
  var cpOffset = KAPPA * 0.05
  var centerx = 0.825
  var centery = 0.95
  var fig7 = new go.PathFigure((centerx - radius) * w, centery * h, true)
  geo.add(fig7)
  fig7.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery - radius) * h, (centerx - radius) * w, (centery - cpOffset) * h,
    (centerx - cpOffset) * w, (centery - radius) * h))
  fig7.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + radius) * w, centery * h, (centerx + cpOffset) * w, (centery - radius) * h,
    (centerx + radius) * w, (centery - cpOffset) * h))
  fig7.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery + radius) * h, (centerx + radius) * w, (centery + cpOffset) * h,
    (centerx + cpOffset) * w, (centery + radius) * h))
  fig7.add(new go.PathSegment(go.PathSegment.Bezier, (centerx - radius) * w, centery * h, (centerx - cpOffset) * w, (centery + radius) * h,
    (centerx - radius) * w, (centery + cpOffset) * h).close())
  var fig8 = new go.PathFigure(0, h, false)
  geo.add(fig8)
  fig8.add(new go.PathSegment(go.PathSegment.Line, w, h).close())
  return geo
})

go.Shape.defineFigureGenerator('Warehouse', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, 0, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0).close())
  var fig2 = new go.PathFigure(0, 0.2 * h, false)
  geo.add(fig2)
  fig2.add(new go.PathSegment(go.PathSegment.Line, w, 0.2 * h).close())
  var fig3 = new go.PathFigure(0.15 * w, h, true)
  geo.add(fig3)
  fig3.add(new go.PathSegment(go.PathSegment.Line, 0.15 * w, 0.5 * h))
  fig3.add(new go.PathSegment(go.PathSegment.Line, 0.40 * w, 0.5 * h))
  fig3.add(new go.PathSegment(go.PathSegment.Line, 0.40 * w, h))
  fig3.add(new go.PathSegment(go.PathSegment.Line, 0.15 * w, h).close())
  var radius = 0.05
  var cpOffset = KAPPA * 0.05
  var centerx = 0.35
  var centery = 0.775
  var fig4 = new go.PathFigure((centerx - radius) * w, centery * h, true)
  geo.add(fig4)
  // Door handle
  fig4.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery - radius) * h, (centerx - radius) * w, (centery - cpOffset) * h,
  (centerx - cpOffset) * w, (centery - radius) * h))
  fig4.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + radius) * w, centery * h, (centerx + cpOffset) * w, (centery - radius) * h,
  (centerx + radius) * w, (centery - cpOffset) * h))
  fig4.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery + radius) * h, (centerx + radius) * w, (centery + cpOffset) * h,
  (centerx + cpOffset) * w, (centery + radius) * h))
  fig4.add(new go.PathSegment(go.PathSegment.Bezier, (centerx - radius) * w, centery * h, (centerx - cpOffset) * w, (centery + radius) * h,
  (centerx - radius) * w, (centery + cpOffset) * h).close())
  return geo
})

go.Shape.defineFigureGenerator('ControlCenter', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, h, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.8 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.1 * w, 0.8 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.1 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.9 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.9 * w, 0.8 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.8 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h))
  fig.add(new go.PathSegment(go.PathSegment.Move, 0.1 * w, 0.8 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.9 * w, 0.8 * h).close())
  return geo
})

go.Shape.defineFigureGenerator('Bluetooth', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, 0.75 * h, false)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.75 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.25 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.75 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.25 * h))
  return geo
})

go.Shape.defineFigureGenerator('Bookmark', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, 0, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0.6 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0))
  fig.add(new go.PathSegment(go.PathSegment.Move, 0.2 * w, 0.2 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.8 * w, 0.2 * h))
  fig.add(new go.PathSegment(go.PathSegment.Move, 0.2 * w, 0.4 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.8 * w, 0.4 * h))
  return geo
})

go.Shape.defineFigureGenerator('Bookmark', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, 0, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0.6 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0))
  fig.add(new go.PathSegment(go.PathSegment.Move, 0.2 * w, 0.2 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.8 * w, 0.2 * h))
  fig.add(new go.PathSegment(go.PathSegment.Move, 0.2 * w, 0.4 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.8 * w, 0.4 * h))
  return geo
})

go.Shape.defineFigureGenerator('Globe', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0.5 * w, 0, false)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Move, 0, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Move, 0.5 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, w, 0.5 * h, 0.75 * w, 0, w, 0.25 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.5 * w, h, w, 0.75 * h, 0.75 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, 0.5 * h, 0.25 * w, h, 0, 0.75 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.5 * w, 0, 0, 0.25 * h, 0.25 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.5 * w, h, 0.15 * w, 0.25 * h, 0.15 * w, 0.75 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.5 * w, 0, 0.85 * w, 0.75 * h, 0.85 * w, 0.25 * h))
  fig.add(new go.PathSegment(go.PathSegment.Move, 0.1675 * w, 0.15 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.8325 * w, 0.15 * h, 0.35 * w, 0.3 * h, 0.65 * w, 0.3 * h))
  fig.add(new go.PathSegment(go.PathSegment.Move, 0.1675 * w, 0.85 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.8325 * w, 0.85 * h, 0.35 * w, 0.7 * h, 0.65 * w, 0.7 * h))
  return geo
})

go.Shape.defineFigureGenerator('Wave', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, 0.25 * h, false)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.3 * w, 0.25 * h, 0.10 * w, 0, 0.2 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.7 * w, 0.25 * h, 0.425 * w, 0.5 * h, 0.575 * w, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, w, 0.25 * h, 0.8 * w, 0, 0.9 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.75 * h))
  fig.add(new go.PathSegment(go.PathSegment.Move, 0, 0.25 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.75 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.3 * w, 0.75 * h, 0.10 * w, 0.5 * h, 0.2 * w, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.7 * w, 0.75 * h, 0.425 * w, h, 0.575 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, w, 0.75 * h, 0.8 * w, 0.5 * h, 0.9 * w, 0.5 * h))
  return geo
})

go.Shape.defineFigureGenerator('Operator', function (shape, w, h) {
  var geo = new go.Geometry()
  var radius = 0.3
  var cpOffset = KAPPA * 0.3
  var centerx = 0.5
  var centery = 0.7
  var fig = new go.PathFigure((centerx - radius) * w, centery * h, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery - radius) * h, (centerx - radius) * w, (centery - cpOffset) * h,
    (centerx - cpOffset) * w, (centery - radius) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + radius) * w, centery * h, (centerx + cpOffset) * w, (centery - radius) * h,
    (centerx + radius) * w, (centery - cpOffset) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery + radius) * h, (centerx + radius) * w, (centery + cpOffset) * h,
    (centerx + cpOffset) * w, (centery + radius) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (centerx - radius) * w, centery * h, (centerx - cpOffset) * w, (centery + radius) * h,
    (centerx - radius) * w, (centery + cpOffset) * h))
  var fig2 = new go.PathFigure(0, 0.7 * h, false)
  geo.add(fig2)
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, w, 0.7 * h, 0, 0, w, 0))
  return geo
})

go.Shape.defineFigureGenerator('TripleFanBlades', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0.5 * w, 0, true)
  geo.add(fig)

  // Top blade
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.5 * w, 0.65 * h, 0.65 * w, 0.3 * h, 0.65 * w, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.5 * w, 0, 0.35 * w, 0.5 * h, 0.35 * w, 0.3 * h))
  // Bottom left blade
  fig.add(new go.PathSegment(go.PathSegment.Move, 0.5 * w, 0.65 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, h, 0.3 * w, 0.6 * h, 0.1 * w, 0.8 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.5 * w, 0.65 * h, 0.2 * w, h, 0.35 * w, 0.95 * h))
  // Bottom right blade
  fig.add(new go.PathSegment(go.PathSegment.Move, 0.5 * w, 0.65 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, w, h, 0.7 * w, 0.6 * h, 0.9 * w, 0.8 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.5 * w, 0.65 * h, 0.8 * w, h, 0.65 * w, 0.95 * h))
  return geo
})

go.Shape.defineFigureGenerator('CentrifugalPump', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(w, 0, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0.4 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, 0.5 * h, 0, 0.075 * h, 0, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.4 * w, h, 0, h, 0.4 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.8 * w, 0.4 * h, 0.8 * w, h, 0.85 * w, 0.6 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.4 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0))
  return geo
})

go.Shape.defineFigureGenerator('Battery', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, h, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.1 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.1 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h))
  fig.add(new go.PathSegment(go.PathSegment.Move, 0.4 * w, 0.1 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.4 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.6 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.6 * w, 0.1 * h))
  var fig2 = new go.PathFigure(0, 0.6 * h, false)
  geo.add(fig2)
  fig2.add(new go.PathSegment(go.PathSegment.Move, 0, 0.4 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, w, 0.4 * h))
  return geo
})

go.Shape.defineFigureGenerator('Delete', function (shape, w, h) {
  var geo = new go.Geometry()
  var radius = 0.5
  var cpOffset = KAPPA * 0.5
  var centerx = 0.5
  var centery = 0.5
  var fig = new go.PathFigure((centerx - radius) * w, centery * h, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery - radius) * h, (centerx - radius) * w, (centery - cpOffset) * h,
    (centerx - cpOffset) * w, (centery - radius) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + radius) * w, centery * h, (centerx + cpOffset) * w, (centery - radius) * h,
    (centerx + radius) * w, (centery - cpOffset) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery + radius) * h, (centerx + radius) * w, (centery + cpOffset) * h,
    (centerx + cpOffset) * w, (centery + radius) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (centerx - radius) * w, centery * h, (centerx - cpOffset) * w, (centery + radius) * h,
    (centerx - radius) * w, (centery + cpOffset) * h))
  var fig2 = new go.PathFigure(0.15 * w, 0.5 * h, false)
  geo.add(fig2)
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.85 * w, 0.5 * h))
  return geo
})

go.Shape.defineFigureGenerator('Flag', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, 0.1 * h, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h))
  fig.add(new go.PathSegment(go.PathSegment.Move, 0, 0.1 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.5 * w, 0.1 * h, 0.15 * w, 0, 0.35 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, w, 0.1 * h, 0.65 * w, 0.2 * h, 0.85 * w, 0.2 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.5 * w, 0.5 * h, 0.85 * w, 0.6 * h, 0.65 * w, 0.6 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, 0.5 * h, 0.35 * w, 0.4 * h, 0.15 * w, 0.4 * h).close())
  return geo
})

go.Shape.defineFigureGenerator('Help', function (shape, w, h) {
  var geo = new go.Geometry()
  var radius = 0.5
  var cpOffset = KAPPA * 0.5
  var centerx = 0.5
  var centery = 0.5
  var fig = new go.PathFigure((centerx - radius) * w, centery * h, false)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery - radius) * h, (centerx - radius) * w, (centery - cpOffset) * h,
    (centerx - cpOffset) * w, (centery - radius) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + radius) * w, centery * h, (centerx + cpOffset) * w, (centery - radius) * h,
    (centerx + radius) * w, (centery - cpOffset) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery + radius) * h, (centerx + radius) * w, (centery + cpOffset) * h,
    (centerx + cpOffset) * w, (centery + radius) * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, (centerx - radius) * w, centery * h, (centerx - cpOffset) * w, (centery + radius) * h,
    (centerx - radius) * w, (centery + cpOffset) * h).close())
  radius = 0.05
  cpOffset = KAPPA * 0.05
  centerx = 0.5
  centery = 0.8
  var fig2 = new go.PathFigure((centerx - radius) * w, centery * h, false)
  geo.add(fig2)
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery - radius) * h, (centerx - radius) * w, (centery - cpOffset) * h,
    (centerx - cpOffset) * w, (centery - radius) * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, (centerx + radius) * w, centery * h, (centerx + cpOffset) * w, (centery - radius) * h,
    (centerx + radius) * w, (centery - cpOffset) * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, centerx * w, (centery + radius) * h, (centerx + radius) * w, (centery + cpOffset) * h,
    (centerx + cpOffset) * w, (centery + radius) * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, (centerx - radius) * w, centery * h, (centerx - cpOffset) * w, (centery + radius) * h,
    (centerx - radius) * w, (centery + cpOffset) * h).close())
  fig2.add(new go.PathSegment(go.PathSegment.Move, 0.5 * w, 0.7 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0.5 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, 0.5 * w, 0.2 * h, 0.75 * w, 0.475 * h, 0.75 * w, 0.225 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, 0.3 * w, 0.35 * h, 0.4 * w, 0.2 * h, 0.3 * w, 0.25 * h))
  return geo
})

go.Shape.defineFigureGenerator('Location', function (shape, w, h) {
  return new go.Geometry()
         .add(new go.PathFigure(0.5 * w, h, true)
              .add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0.5 * h))
              .add(new go.PathSegment(go.PathSegment.Bezier, 0.5 * w, 0, 0.975 * w, 0.025 * h, 0.5 * w, 0))
              .add(new go.PathSegment(go.PathSegment.Bezier, 0.25 * w, 0.5 * h, 0.5 * w, 0, 0.025 * w, 0.025 * h).close())
              .add(new go.PathSegment(go.PathSegment.Move, 0.5 * w, 0.2 * h))
              .add(new go.PathSegment(go.PathSegment.Arc, 270, 360, 0.5 * w, 0.3 * h, 0.1 * w, 0.1 * h).close()))
})

go.Shape.defineFigureGenerator('Lock', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, 0.5 * h, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.5 * h))
  var fig2 = new go.PathFigure(0.2 * w, 0.5 * h, false)
  geo.add(fig2)
  fig2.add(new go.PathSegment(go.PathSegment.Move, 0.2 * w, 0.5 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.2 * w, 0.3 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, 0.8 * w, 0.3 * h, 0.25 * w, 0, 0.75 * w, 0))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.8 * w, 0.5 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.8 * w, 0.3 * h))
  return geo
})

go.Shape.defineFigureGenerator('Unlocked', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, 0.5 * h, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.5 * h))
  var fig2 = new go.PathFigure(0.2 * w, 0.5 * h, false)
  geo.add(fig2)
  fig2.add(new go.PathSegment(go.PathSegment.Move, 0.2 * w, 0.5 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.2 * w, 0.3 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Bezier, 0.8 * w, 0.3 * h, 0.25 * w, 0, 0.75 * w, 0))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.8 * w, 0.35 * h))
  return geo
})

go.Shape.defineFigureGenerator('Gear', function (shape, w, h) {
  return new go.Geometry()
         .add(new go.PathFigure(0.9375 * w, 0.56246875 * h, true)
              .add(new go.PathSegment(go.PathSegment.Line, 0.9375 * w, 0.4375 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.80621875 * w, 0.4375 * h))
              .add(new go.PathSegment(go.PathSegment.Bezier, 0.763 * w, 0.3316875 * h, 0.79840625 * w, 0.39915625 * h, 0.7834375 * w, 0.3635 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.8566875 * w, 0.23796875 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.76825 * w, 0.14959375 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.67596875 * w, 0.24184375 * h))
              .add(new go.PathSegment(go.PathSegment.Bezier, 0.5625 * w, 0.19378125 * h, 0.64228125 * w, 0.2188125 * h, 0.603875 * w, 0.2021875 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.5625 * w, 0.0625 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.4375 * w, 0.0625 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.4375 * w, 0.19378125 * h))
              .add(new go.PathSegment(go.PathSegment.Bezier, 0.32775 * w, 0.239375 * h, 0.39759375 * w, 0.20190625 * h, 0.36053125 * w, 0.2176875 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.2379375 * w, 0.14959375 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.14953125 * w, 0.2379375 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.23934375 * w, 0.3278125 * h))
              .add(new go.PathSegment(go.PathSegment.Bezier, 0.19378125 * w, 0.4375 * h, 0.21765625 * w, 0.36059375 * h, 0.201875 * w, 0.397625 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.0625 * w, 0.4375 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.0625 * w, 0.5625 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.1938125 * w, 0.5625 * h))
              .add(new go.PathSegment(go.PathSegment.Bezier, 0.241875 * w, 0.67596875 * h, 0.20221875 * w, 0.603875 * h, 0.21884375 * w, 0.64228125 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.1495625 * w, 0.76825 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.238 * w, 0.8566875 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.3316875 * w, 0.76296875 * h))
              .add(new go.PathSegment(go.PathSegment.Bezier, 0.43753125 * w, 0.80621875 * h, 0.36353125 * w, 0.78340625 * h, 0.3991875 * w, 0.79840625 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.43753125 * w, 0.9375 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.5625 * w, 0.9375 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.5625 * w, 0.80621875 * h))
              .add(new go.PathSegment(go.PathSegment.Bezier, 0.67225 * w, 0.760625 * h, 0.602375 * w, 0.79809375 * h, 0.63946875 * w, 0.78234375 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.76828125 * w, 0.8566875 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.85671875 * w, 0.76825 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.76065625 * w, 0.67221875 * h))
              .add(new go.PathSegment(go.PathSegment.Bezier, 0.80621875 * w, 0.56246875 * h, 0.78234375 * w, 0.63940625 * h, 0.798125 * w, 0.602375 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.9375 * w, 0.56246875 * h).close())

              .add(new go.PathSegment(go.PathSegment.Move, 0.5 * w, 0.6 * h))
              .add(new go.PathSegment(go.PathSegment.Arc, 90, 360, 0.5 * w, 0.5 * h, 0.1 * w, 0.1 * h).close()))
})

go.Shape.defineFigureGenerator('Hand', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, 0.5 * h, false)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.1 * w, 0.3 * h, 0, 0.375 * h, 0.05 * w, 0.325 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.45 * w, 0.075 * h, 0.3 * w, 0.225 * h, 0.4 * w, 0.175 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.525 * w, 0.075 * h, 0.46 * w, 0.05 * h, 0.525 * w, 0.05 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.3 * w, 0.4 * h, 0.525 * w, 0.275 * h, 0.475 * w, 0.325 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.9 * w, 0.4 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.9 * w, 0.55 * h, w, 0.4 * h, w, 0.55 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.425 * w, 0.55 * h))
  fig.add(new go.PathSegment(go.PathSegment.Move, 0.6 * w, 0.55 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.6 * w, 0.7 * h, 0.675 * w, 0.55 * h, 0.675 * w, 0.7 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.4 * w, 0.7 * h))
  fig.add(new go.PathSegment(go.PathSegment.Move, 0.575 * w, 0.7 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.575 * w, 0.85 * h, 0.65 * w, 0.7 * h, 0.65 * w, 0.85 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.4 * w, 0.85 * h))
  fig.add(new go.PathSegment(go.PathSegment.Move, 0.525 * w, 0.85 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.535 * w, h, 0.61 * w, 0.85 * h, 0.61 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, 0.9 * h, 0.435 * w, h, 0, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, 0.5 * h))
  geo.spot1 = new go.Spot(0, 0.6, 10, 0)
  geo.spot2 = new go.Spot(1, 1)
  return geo
})

go.Shape.defineFigureGenerator('Map', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, 0.2 * h, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0.25 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0.2 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.2 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0.8 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.25 * w, 0.8 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close())
  fig.add(new go.PathSegment(go.PathSegment.Move, 0.25 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.25 * w, 0.8 * h))
  fig.add(new go.PathSegment(go.PathSegment.Move, 0.5 * w, 0.2 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, h))
  fig.add(new go.PathSegment(go.PathSegment.Move, 0.75 * w, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0.8 * h))
  return geo
})

go.Shape.defineFigureGenerator('Eject', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, h, true)
  geo.add(fig)

  // bottam rectangle section
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h * 0.7))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h * 0.7).close())
  var fig2 = new go.PathFigure(0, (h * 0.6), true)
  geo.add(fig2)
  fig2.add(new go.PathSegment(go.PathSegment.Line, w, (0.6 * h)))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0).close())
  return geo
})

go.Shape.defineFigureGenerator('Pencil', function (shape, w, h) {
  return new go.Geometry()
         .add(new go.PathFigure(0, 0, true)
              .add(new go.PathSegment(go.PathSegment.Line, 0.2 * w, 0.1 * h))
              .add(new go.PathSegment(go.PathSegment.Line, w, 0.9 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.9 * w, h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.1 * w, 0.2 * h).close()))
})

// JC
// Building that kinda looks like a bank
go.Shape.defineFigureGenerator('Building', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(w * 1, h * 1, false)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h * 1)) // bottom part
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h * 0.85))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.046 * w, h * 0.85))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.046 * w, h * 0.45))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h * 0.45))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h * 0.30))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.046 * w, h * 0.30))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, h * 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, (1 - 0.046) * w, h * 0.30))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h * 0.30))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h * 0.45))
  fig.add(new go.PathSegment(go.PathSegment.Line, (1 - 0.046) * w, h * 0.45))
  fig.add(new go.PathSegment(go.PathSegment.Line, (1 - 0.046) * w, h * 0.85))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h * 0.85).close())
  var geo2 = new go.Geometry()
  var fig2 = new go.PathFigure(0.126 * w, 0.85 * h, false) // is filled in our not
  geo.add(fig2)
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.126 * w, 0.45 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.322 * w, 0.45 * h))
  fig2.add(new go.PathSegment(go.PathSegment.Line, 0.322 * w, 0.85 * h).close())
  var geo2 = new go.Geometry()
  var fig3 = new go.PathFigure(0.402 * w, 0.85 * h, false) // is filled in our not
  geo.add(fig3)
  fig3.add(new go.PathSegment(go.PathSegment.Line, 0.402 * w, 0.45 * h))
  fig3.add(new go.PathSegment(go.PathSegment.Line, 0.598 * w, 0.45 * h))
  fig3.add(new go.PathSegment(go.PathSegment.Line, 0.598 * w, 0.85 * h).close())
  var geo2 = new go.Geometry()
  var fig4 = new go.PathFigure(0.678 * w, 0.85 * h, false) // is filled in our not
  geo.add(fig4)
  fig4.add(new go.PathSegment(go.PathSegment.Line, 0.678 * w, 0.45 * h))
  fig4.add(new go.PathSegment(go.PathSegment.Line, 0.874 * w, 0.45 * h))
  fig4.add(new go.PathSegment(go.PathSegment.Line, 0.874 * w, 0.85 * h).close())
  // the top inner triangle
  var geo3 = new go.Geometry()
  var fig5 = new go.PathFigure(0.5 * w, 0.1 * h, false) // is filled in our not
  geo.add(fig5)
  fig5.add(new go.PathSegment(go.PathSegment.Line, (0.046 + 0.15) * w, 0.30 * h))
  fig5.add(new go.PathSegment(go.PathSegment.Line, (1 - (0.046 + 0.15)) * w, 0.30 * h).close())
  return geo
})

go.Shape.defineFigureGenerator('Staircase', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, h * 1, true)
  geo.add(fig)

  // Bottom part
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.20, h * 1)) // bottom left part
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.20, h * 0.80))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.40, h * 0.80))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.40, h * 0.60))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.60, h * 0.60))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.60, h * 0.40))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.80, h * 0.40))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.80, h * 0.20))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 1, h * 0.20))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 1, h * 0.15))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.75, h * 0.15))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.75, h * 0.35))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.55, h * 0.35))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.55, h * 0.55))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.35, h * 0.55))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.35, h * 0.75))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.15, h * 0.75))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.15, h * 0.95))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h * 0.95).close())
  return geo
})

go.Shape.defineFigureGenerator('5Bars', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, h * 1, true) // bottom left
  geo.add(fig)

  // Width of each bar is .184
  // space in between each bar is .2
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.184, h * 1)) // bottom left part
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.184, h * (1 - 0.184)).close())
  var geo2 = new go.Geometry()
  var fig3 = new go.PathFigure(w * 0.204, h, true) // is filled in our not
  geo.add(fig3)
  fig3.add(new go.PathSegment(go.PathSegment.Line, w * 0.204, h * (1 - 0.184)))
  fig3.add(new go.PathSegment(go.PathSegment.Line, w * 0.388, h * (1 - (0.184 * 2))))
  fig3.add(new go.PathSegment(go.PathSegment.Line, w * 0.388, h * 1).close())
  var geo3 = new go.Geometry()
  var fig4 = new go.PathFigure(w * 0.408, h, true) // is filled in our not
  geo.add(fig4)
  fig4.add(new go.PathSegment(go.PathSegment.Line, w * 0.408, h * (1 - (0.184 * 2))))
  fig4.add(new go.PathSegment(go.PathSegment.Line, w * 0.592, h * (1 - (0.184 * 3))))
  fig4.add(new go.PathSegment(go.PathSegment.Line, w * 0.592, h * 1).close())
  var geo4 = new go.Geometry()
  var fig5 = new go.PathFigure(w * 0.612, h, true) // is filled in our not
  geo.add(fig5)
  fig5.add(new go.PathSegment(go.PathSegment.Line, w * 0.612, h * (1 - (0.184 * 3))))
  fig5.add(new go.PathSegment(go.PathSegment.Line, w * 0.796, h * (1 - (0.184 * 4))))
  fig5.add(new go.PathSegment(go.PathSegment.Line, w * 0.796, h * 1).close())
  var geo5 = new go.Geometry()
  var fig6 = new go.PathFigure(w * 0.816, h, true) // is filled in our not
  geo.add(fig6)
  fig6.add(new go.PathSegment(go.PathSegment.Line, w * 0.816, h * (1 - (0.184 * 4))))
  fig6.add(new go.PathSegment(go.PathSegment.Line, w * 1, h * (1 - (0.184 * 5))))
  fig6.add(new go.PathSegment(go.PathSegment.Line, w * 1, h * 1).close())
  return geo
})

// desktop
go.Shape.defineFigureGenerator('PC', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, 0, true) // top right
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h * 1))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.3, h * 1))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.3, 0).close())
  // Drive looking rectangle 1
  var geo2 = new go.Geometry()
  var fig2 = new go.PathFigure(w * 0.055, 0.07 * h, true) // is filled in our not
  geo.add(fig2)
  fig2.add(new go.PathSegment(go.PathSegment.Line, w * 0.245, h * 0.07))
  fig2.add(new go.PathSegment(go.PathSegment.Line, w * 0.245, h * 0.1))
  fig2.add(new go.PathSegment(go.PathSegment.Line, w * 0.055, h * 0.1).close())
  // Drive looking rectangle 2
  var geo3 = new go.Geometry()
  var fig3 = new go.PathFigure(w * 0.055, 0.13 * h, true) // is filled in our not
  geo.add(fig3)
  fig3.add(new go.PathSegment(go.PathSegment.Line, w * 0.245, h * 0.13))
  fig3.add(new go.PathSegment(go.PathSegment.Line, w * 0.245, h * 0.16))
  fig3.add(new go.PathSegment(go.PathSegment.Line, w * 0.055, h * 0.16).close())
  // Drive/cd rom looking rectangle 3
  var geo3 = new go.Geometry()
  var fig4 = new go.PathFigure(w * 0.055, 0.18 * h, true) // is filled in our not
  geo.add(fig4)
  fig4.add(new go.PathSegment(go.PathSegment.Line, w * 0.245, h * 0.18))
  fig4.add(new go.PathSegment(go.PathSegment.Line, w * 0.245, h * 0.21))
  fig4.add(new go.PathSegment(go.PathSegment.Line, w * 0.055, h * 0.21).close())
  var geo4 = new go.Geometry()
  var fig5 = new go.PathFigure(w * 1, 0, true) // is filled in our not
  geo.add(fig5)
  fig5.add(new go.PathSegment(go.PathSegment.Line, w * 0.4, 0))
  fig5.add(new go.PathSegment(go.PathSegment.Line, w * 0.4, h * 0.65))
  fig5.add(new go.PathSegment(go.PathSegment.Line, w * 1, h * 0.65).close())
  return geo
})

go.Shape.defineFigureGenerator('Plane', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0.55 * w, h, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0.6 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.4 * w, 0.7 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.1 * w, 0.475 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.35 * w, 0.525 * h, 0, 0.4 * h, 0.225 * w, 0.45 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.4 * w, 0.475 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.15 * w, 0.35 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.2 * w, 0.325 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.6 * w, 0.325 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.85 * w, 0.1 * h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0.9 * w, 0.2 * h, 0.975 * w, 0, w, 0.08 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.7 * w, 0.45 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.6 * w, 0.95 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0.55 * w, h).close())
  return geo
})

go.Shape.defineFigureGenerator('Key', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(w * 1, h * 0.5, false)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.9, 0.4 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.35, 0.4 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.35, 0.36 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.32, 0.36 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.275, 0.24 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.12, 0.24 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.08, 0.4 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.08, 0.5 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.08, 0.6 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.12, 0.76 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.275, 0.76 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.32, 0.64 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.35, 0.64 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.35, 0.60 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.41, 0.60 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.43, 0.58 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.475, 0.58 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.495, 0.60 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.52, 0.58 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.56, 0.58 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.6, 0.538 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.645, 0.538 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.69, 0.58 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.70, 0.58 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.73, 0.60 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.75, 0.58 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.76, 0.60 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.80, 0.538 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.82, 0.58 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.84, 0.538 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.85, 0.558 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.86, 0.538 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.88, 0.538 * h))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.9, 0.6 * h).close())
  var geo2 = new go.Geometry()
  var fig2 = new go.PathFigure(w * 0.18, h * 0.5, false)
  geo.add(fig2)
  fig2.add(new go.PathSegment(go.PathSegment.Arc, 0, 360, w * 0.15, w * 0.5, w * 0.03)) // small circle on far left
  return geo
})

// movie like logo
go.Shape.defineFigureGenerator('FilmTape', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(0, 0, false)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Arc, 270, 180, w * 0, w * 0.3, w * 0.055)) // left semi-circle
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, h * 1))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.08, h * 1))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.08, h * 0.95))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * (0.08 + 0.056 * 1), h * 0.95))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * (0.08 + 0.056 * 1), h * 1))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * (0.08 + 0.056 * 2), h * 1))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * (0.08 + 0.056 * 2), h * 0.95))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * (0.08 + 0.056 * 3), h * 0.95))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * (0.08 + 0.056 * 3), h * 1))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * (0.08 + 0.056 * 4), h * 1))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * (0.08 + 0.056 * 4), h * 0.95))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * (0.08 + 0.056 * 5), h * 0.95))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * (0.08 + 0.056 * 5), h * 1))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * (0.08 + 0.056 * 6), h * 1))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * (0.08 + 0.056 * 6), h * 0.95))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * (0.08 + 0.056 * 7), h * 0.95))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * (0.08 + 0.056 * 7), h * 1))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * (0.08 + 0.056 * 8), h * 1))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * (0.08 + 0.056 * 8), h * 0.95))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * (0.08 + 0.056 * 9), h * 0.95))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * (0.08 + 0.056 * 9), h * 1))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * (0.08 + 0.056 * 10), h * 1))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * (0.08 + 0.056 * 10), h * 0.95))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * (0.08 + 0.056 * 11), h * 0.95))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * (0.08 + 0.056 * 11), h * 1))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * (0.08 + 0.056 * 12), h * 1))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * (0.08 + 0.056 * 12), h * 0.95))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * (0.08 + 0.056 * 13), h * 0.95))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * (0.08 + 0.056 * 13), h * 1))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * (0.08 + 0.056 * 14), h * 1))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * (0.08 + 0.056 * 14), h * 0.95))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * (0.08 + 0.056 * 15), h * 0.95))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * (0.08 + 0.056 * 15), h * 1))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 1, h * 1))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 1, h * 1))
  var geo2 = new go.Geometry()
  var fig2 = new go.PathFigure(0, 0, false) // is filled in our not
  geo.add(fig2)
  fig2.add(new go.PathSegment(go.PathSegment.Line, w * 1, h * 0))
  fig2.add(new go.PathSegment(go.PathSegment.Arc, 270, -180, w * 1, w * 0.3, w * 0.055)) // right semi circle
  fig2.add(new go.PathSegment(go.PathSegment.Line, w * 1, h * 1))
  // Each of the little square boxes on the tape
  var geo3 = new go.Geometry()
  var fig3 = new go.PathFigure(w * 0.11, h * 0.1, false) // is filled in our not
  geo.add(fig3)
  fig3.add(new go.PathSegment(go.PathSegment.Line, w * (0.11 + (0.24133333 * 1) + (0.028 * 0)), h * 0.1))
  fig3.add(new go.PathSegment(go.PathSegment.Line, w * (0.11 + (0.24133333 * 1) + (0.028 * 0)), h * 0.8))
  fig3.add(new go.PathSegment(go.PathSegment.Line, w * 0.11, h * 0.8).close())
  var geo4 = new go.Geometry()
  var fig4 = new go.PathFigure(w * (0.11 + (0.24133333 * 1) + (0.028 * 1)), h * 0.1, false) // is filled in our not
  geo.add(fig4)
  fig4.add(new go.PathSegment(go.PathSegment.Line, w * (0.11 + (0.24133333 * 2) + (0.028 * 1)), h * 0.1))
  fig4.add(new go.PathSegment(go.PathSegment.Line, w * (0.11 + (0.24133333 * 2) + (0.028 * 1)), h * 0.8))
  fig4.add(new go.PathSegment(go.PathSegment.Line, w * (0.11 + (0.24133333 * 1) + (0.028 * 1)), h * 0.8).close())
  var geo5 = new go.Geometry()
  var fig5 = new go.PathFigure(w * (0.11 + (0.24133333 * 2) + (0.028 * 2)), h * 0.1, false) // is filled in our not
  geo.add(fig5)
  fig5.add(new go.PathSegment(go.PathSegment.Line, w * (0.11 + (0.24133333 * 3) + (0.028 * 2)), h * 0.1))
  fig5.add(new go.PathSegment(go.PathSegment.Line, w * (0.11 + (0.24133333 * 3) + (0.028 * 2)), h * 0.8))
  fig5.add(new go.PathSegment(go.PathSegment.Line, w * (0.11 + (0.24133333 * 2) + (0.028 * 2)), h * 0.8).close())
  return geo
})

go.Shape.defineFigureGenerator('FloppyDisk', function (shape, w, h) {
  var geo = new go.Geometry()
  var roundValue = 8
  var cpOffset = roundValue * KAPPA
  var fig = new go.PathFigure(roundValue, 0, false)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.86, 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 1, h * 0.14))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, h - roundValue))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, w - roundValue, h, w, h - cpOffset, w - cpOffset, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, roundValue, h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, h - roundValue, cpOffset, h, 0, h - cpOffset))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, roundValue))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, roundValue, 0, 0, cpOffset, cpOffset, 0).close())
  // interior slightly  rectangle
  var geo2 = new go.Geometry()
  var fig2 = new go.PathFigure(w * 0.83, 0, false)
  geo.add(fig2)
  fig2.add(new go.PathSegment(go.PathSegment.Line, w * 0.83, h * 0.3))
  fig2.add(new go.PathSegment(go.PathSegment.Line, w * 0.17, h * 0.3))
  fig2.add(new go.PathSegment(go.PathSegment.Line, w * 0.17, h * 0).close())
  var geo3 = new go.Geometry()
  var fig3 = new go.PathFigure(w * 0.83, h * 1, false)
  geo.add(fig3)
  fig3.add(new go.PathSegment(go.PathSegment.Line, w * 0.83, h * 0.5))
  fig3.add(new go.PathSegment(go.PathSegment.Line, w * 0.17, h * 0.5))
  fig3.add(new go.PathSegment(go.PathSegment.Line, w * 0.17, h * 1).close())
  var geo4 = new go.Geometry()
  var fig4 = new go.PathFigure(w * 0.78, h * 0.05, false)
  geo.add(fig4)
  fig4.add(new go.PathSegment(go.PathSegment.Line, w * 0.66, h * 0.05))
  fig4.add(new go.PathSegment(go.PathSegment.Line, w * 0.66, h * 0.25))
  fig4.add(new go.PathSegment(go.PathSegment.Line, w * 0.78, h * 0.25).close())
  return geo
})

go.Shape.defineFigureGenerator('SpeechBubble', function (shape, w, h) {
  var geo = new go.Geometry()
  var param1 = 25
  var cpOffset = param1 * KAPPA
  var fig = new go.PathFigure(param1, 0, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, w - param1, 0))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, w, param1, w - cpOffset, 0, w, cpOffset))
  fig.add(new go.PathSegment(go.PathSegment.Line, w, (h * 0.60) - param1))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, w - param1, (h * 0.60), w, (h * 0.60) - cpOffset, w - cpOffset, (h * 0.60)))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.70, (h * 0.60)))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.70, (h * 0.775)))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.55, (h * 0.60)))
  fig.add(new go.PathSegment(go.PathSegment.Line, param1, (h * 0.60))) // ends at 25
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, (h * 0.60) - param1, cpOffset, (h * 0.60), 0, (h * 0.60) - cpOffset))
  fig.add(new go.PathSegment(go.PathSegment.Line, 0, param1))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, param1, 0, 0, cpOffset, cpOffset, 0).close())
  if (cpOffset > 1) {
    geo.spot1 = new go.Spot(0, 0, cpOffset, cpOffset)
    geo.spot2 = new go.Spot(1, 1, -cpOffset, -cpOffset)
  } else {
    geo.spot1 = go.Spot.TopLeft
    geo.spot2 = go.Spot.BottomRight
  }
  return geo
})

go.Shape.defineFigureGenerator('Repeat', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(w * 0, h * 0.45, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.25, h * 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.50, h * 0.45))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.30, h * 0.45))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.30, h * 0.90))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.60, h * 0.90))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.65, h * 1))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.20, h * 1))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.20, h * 0.45).close())
  var geo2 = new go.Geometry()
  var fig2 = new go.PathFigure(w * 1, h * 0.55, true) // is filled in our not
  geo.add(fig2)
  fig2.add(new go.PathSegment(go.PathSegment.Line, w * 0.75, h * 1))
  fig2.add(new go.PathSegment(go.PathSegment.Line, w * 0.50, h * 0.55))
  fig2.add(new go.PathSegment(go.PathSegment.Line, w * 0.70, h * 0.55))
  fig2.add(new go.PathSegment(go.PathSegment.Line, w * 0.70, h * 0.10))
  fig2.add(new go.PathSegment(go.PathSegment.Line, w * 0.40, h * 0.10))
  fig2.add(new go.PathSegment(go.PathSegment.Line, w * 0.35, h * 0))
  fig2.add(new go.PathSegment(go.PathSegment.Line, w * 0.80, h * 0))
  fig2.add(new go.PathSegment(go.PathSegment.Line, w * 0.80, h * 0.55).close())
  return geo
})

go.Shape.defineFigureGenerator('Windows', function (shape, w, h) {
  return new go.Geometry()
         .add(new go.PathFigure(0, 0, true)
              .add(new go.PathSegment(go.PathSegment.Line, w, 0))
              .add(new go.PathSegment(go.PathSegment.Line, w, h))
              .add(new go.PathSegment(go.PathSegment.Line, 0, h).close())
              .add(new go.PathSegment(go.PathSegment.Move, 0.4 * w, 0.4 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.4 * w, 0.8 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.9 * w, 0.8 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.9 * w, 0.4 * h).close())
              .add(new go.PathSegment(go.PathSegment.Move, 0.2 * w, 0.1 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.2 * w, 0.6 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.7 * w, 0.6 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.7 * w, 0.1 * h).close())
              .add(new go.PathSegment(go.PathSegment.Move, 0.1 * w, 0.6 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.1 * w, 0.9 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0.9 * h))
              .add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0.6 * h).close()))
})

go.Shape.defineFigureGenerator('Terminal', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(w * 0, h * 0.10, false)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, w * 1, h * 0.10))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 1, h * 0.90))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0, h * 0.90).close())
  var geo2 = new go.Geometry()
  var fig2 = new go.PathFigure(w * 0.10, h * 0.20, true) // is filled in our not
  geo.add(fig2)
  fig2.add(new go.PathSegment(go.PathSegment.Line, w * 0.10, h * 0.25))
  fig2.add(new go.PathSegment(go.PathSegment.Line, w * 0.22, h * 0.285)) // midpoint
  fig2.add(new go.PathSegment(go.PathSegment.Line, w * 0.10, h * 0.32))
  fig2.add(new go.PathSegment(go.PathSegment.Line, w * 0.10, h * 0.37))
  fig2.add(new go.PathSegment(go.PathSegment.Line, w * 0.275, h * 0.32))
  fig2.add(new go.PathSegment(go.PathSegment.Line, w * 0.275, h * 0.25).close())
  var geo3 = new go.Geometry()
  var fig3 = new go.PathFigure(w * 0.28, h * 0.37, true) // is filled in our not
  geo.add(fig3)
  fig3.add(new go.PathSegment(go.PathSegment.Line, w * 0.45, h * 0.37))
  fig3.add(new go.PathSegment(go.PathSegment.Line, w * 0.45, h * 0.41))
  fig3.add(new go.PathSegment(go.PathSegment.Line, w * 0.28, h * 0.41).close())
  return geo
})

go.Shape.defineFigureGenerator('Beaker', function (shape, w, h) {
  var geo = new go.Geometry()
  var param1 = 15
  var cpOffset = param1 * KAPPA
  var fig = new go.PathFigure(w * 0.62, h * 0.475, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, w, h - param1))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, w - param1, h, w, h - cpOffset, w - cpOffset, h))
  fig.add(new go.PathSegment(go.PathSegment.Line, param1, h))
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, h - param1, cpOffset, h, 0, h - cpOffset))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.38, h * 0.475))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.38, h * 0.03))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.36, h * 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.64, h * 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.62, h * 0.03).close())
  if (cpOffset > 1) {
    geo.spot1 = new go.Spot(0, 0, cpOffset, cpOffset)
    geo.spot2 = new go.Spot(1, 1, -cpOffset, -cpOffset)
  } else {
    geo.spot1 = go.Spot.TopLeft
    geo.spot2 = go.Spot.BottomRight
  }
  /*
  var param1 = 15;
var cpOffset = param1 * KAPPA;
  var fig = new go.PathFigure(w * .62, h *.475, true);
  geo.add(fig);

  fig.add(new go.PathSegment(go.PathSegment.Line, w, h - param1));
  fig.add(new go.PathSegment(go.PathSegment.Bezier, w - param1, h, w, h - cpOffset, w - cpOffset, h));
  fig.add(new go.PathSegment(go.PathSegment.Line, param1, h));
  fig.add(new go.PathSegment(go.PathSegment.Bezier, 0, h - param1, cpOffset, h, 0, h - cpOffset));
  fig.add(new go.PathSegment(go.PathSegment.Line, w * .38, h * .475));
  fig.add(new go.PathSegment(go.PathSegment.Line, w * .38, h * .03));
  fig.add(new go.PathSegment(go.PathSegment.Line, w * .36, h * 0));
  fig.add(new go.PathSegment(go.PathSegment.Line, w * .64, h * 0));
  fig.add(new go.PathSegment(go.PathSegment.Line, w * .62, h * .03).close());
  */
  return geo
})

go.Shape.defineFigureGenerator('Download', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(w * 0, h * 1, true)
  geo.add(fig)

  var third = 0.1 / 0.3 // just to keep values consistent
  // outer frame
  // starts bottom left
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 1, h * 1))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 1, h * (1 - third)))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.8, h * 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.66, h * 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.66, h * 0.055))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.755, h * 0.055))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.93, h * (1 - third)))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.64, h * (1 - third)))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.61, h * 0.75))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.5, h * 0.75))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.39, h * 0.75))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.36, h * (1 - third)))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.07, h * (1 - third)))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * (1 - 0.755), h * (0.055)))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * (1 - 0.66), h * (0.055)))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * (1 - 0.66), h * (0)))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * (1 - 0.8), h * (0)))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0, h * (1 - third)).close())
  // arrow pointing down
  var geo2 = new go.Geometry()
  var fig2 = new go.PathFigure(w * 0.40, h * 0, true)
  geo.add(fig2)
  fig2.add(new go.PathSegment(go.PathSegment.Line, w * 0.40, h * 0.44))
  fig2.add(new go.PathSegment(go.PathSegment.Line, w * 0.26, h * 0.44))
  fig2.add(new go.PathSegment(go.PathSegment.Line, w * 0.5, h * 0.66))
  fig2.add(new go.PathSegment(go.PathSegment.Line, w * (1 - 0.26), h * 0.44))
  fig2.add(new go.PathSegment(go.PathSegment.Line, w * 0.60, h * 0.44))
  fig2.add(new go.PathSegment(go.PathSegment.Line, w * 0.60, h * 0).close())
  return geo
})

go.Shape.defineFigureGenerator('Bin', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(w * 0, h * 1, true)
  geo.add(fig)

  var third = 0.1 / 0.3 // just to keep values consistent
  // outer frame
  // starts bottom left
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 1, h * 1))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 1, h * (1 - third)))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.8, h * 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.66, h * 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.66, h * 0.055))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.755, h * 0.055))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.93, h * (1 - third)))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.64, h * (1 - third)))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.61, h * 0.75))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.5, h * 0.75))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.39, h * 0.75))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.36, h * (1 - third)))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.07, h * (1 - third)))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * (1 - 0.755), h * (0.055)))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * (1 - 0.66), h * (0.055)))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * (1 - 0.66), h * (0)))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * (1 - 0.8), h * (0)))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0, h * (1 - third)).close())
  return geo
})

go.Shape.defineFigureGenerator('Upload', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(w * 0, h * 1, true)
  geo.add(fig)

  var third = 0.1 / 0.3 // just to keep values consistent
  // outer frame
  // starts bottom left
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 1, h * 1))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 1, h * (1 - third)))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.8, h * 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.66, h * 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.66, h * 0.055))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.755, h * 0.055))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.93, h * (1 - third)))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.64, h * (1 - third)))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.61, h * 0.75))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.5, h * 0.75))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.39, h * 0.75))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.36, h * (1 - third)))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.07, h * (1 - third)))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * (1 - 0.755), h * (0.055)))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * (1 - 0.66), h * (0.055)))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * (1 - 0.66), h * (0)))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * (1 - 0.8), h * (0)))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0, h * (1 - third)).close())
  var geo2 = new go.Geometry()
  var fig2 = new go.PathFigure(w * 0.5, h * 0, true)
  geo.add(fig2)
  fig2.add(new go.PathSegment(go.PathSegment.Line, w * 0.26, h * 0.25))
  fig2.add(new go.PathSegment(go.PathSegment.Line, w * 0.40, h * 0.25))
  fig2.add(new go.PathSegment(go.PathSegment.Line, w * 0.40, h * 0.63))
  fig2.add(new go.PathSegment(go.PathSegment.Line, w * 0.60, h * 0.63))
  fig2.add(new go.PathSegment(go.PathSegment.Line, w * 0.60, h * 0.25))
  fig2.add(new go.PathSegment(go.PathSegment.Line, w * 0.74, h * 0.25).close())

  return geo
})

go.Shape.defineFigureGenerator('EmptyDrink', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(w * 0.15, h * 0, false)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.85, h * 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.70, h * 1))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.30, h * 1).close())
  return geo
})

go.Shape.defineFigureGenerator('Drink', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(w * 0.15, h * 0, false)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.85, h * 0))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.70, h * 1))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.30, h * 1).close())

  var geo2 = new go.Geometry()
  var fig2 = new go.PathFigure(w * 0.235, h * 0.28, true)
  geo.add(fig2)
  fig2.add(new go.PathSegment(go.PathSegment.Line, w * 0.765, h * 0.28))
  fig2.add(new go.PathSegment(go.PathSegment.Line, w * 0.655, h * 0.97))
  fig2.add(new go.PathSegment(go.PathSegment.Line, w * 0.345, h * 0.97).close())

  return geo
})

go.Shape.defineFigureGenerator('4Arrows', function (shape, w, h) {
  var geo = new go.Geometry()
  var fig = new go.PathFigure(w * 0.5, h * 0, true)
  geo.add(fig)

  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.65, h * 0.25))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.55, h * 0.25))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.55, h * 0.45))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.75, h * 0.45))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.75, h * 0.35))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 1, h * 0.5))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.75, h * 0.65))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.75, h * 0.55))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.55, h * 0.55))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.55, h * 0.75))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.65, h * 0.75))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.5, h * 1))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.35, h * 0.75))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.45, h * 0.75))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.45, h * 0.55))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.25, h * 0.55))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.25, h * 0.65))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0, h * 0.5))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.25, h * 0.35))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.25, h * 0.45))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.45, h * 0.45))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.45, h * 0.25))
  fig.add(new go.PathSegment(go.PathSegment.Line, w * 0.35, h * 0.25).close())
  return geo
})

/*
go.Shape.defineFigureGenerator("CoffeeCup", function(shape, w, h) {
      var geo = new go.Geometry();
      var fig = new go.PathFigure(w * .2, h * 0, true);
      geo.add(fig);

    fig.add(new go.PathSegment(go.PathSegment.Line, w * .8, h * 0));
        fig.add(new go.PathSegment(go.PathSegment.Line, w * .8, h * .05));

      return geo;
  });
*/

go.Shape.defineFigureGenerator('Connector', 'Ellipse')
go.Shape.defineFigureGenerator('Alternative', 'TriangleUp')
go.Shape.defineFigureGenerator('Merge', 'TriangleUp')
go.Shape.defineFigureGenerator('Decision', 'Diamond')
go.Shape.defineFigureGenerator('DataTransmissions', 'Hexagon')
go.Shape.defineFigureGenerator('Gate', 'Crescent')
go.Shape.defineFigureGenerator('Delay', 'HalfEllipse')
go.Shape.defineFigureGenerator('Input', 'Parallelogram1')
go.Shape.defineFigureGenerator('ManualLoop', 'ManualOperation')
go.Shape.defineFigureGenerator('ISOProcess', 'Chevron')
go.Shape.defineFigureGenerator('MessageToUser', 'SquareArrow')
go.Shape.defineFigureGenerator('MagneticData', 'Cylinder1')
go.Shape.defineFigureGenerator('DirectData', 'Cylinder4')
go.Shape.defineFigureGenerator('StoredData', 'DataStorage')
go.Shape.defineFigureGenerator('SequentialData', 'MagneticTape')
go.Shape.defineFigureGenerator('Subroutine', 'Procedure')
