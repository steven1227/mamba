Immutable = require 'immutable'
XY = require '../utility/xy'
settings = require '../settings'

###
  Represents an instance of an expandable, movable snake.

  Backed by an Immutable.OrderedSet, so .meets(xy) and .move() are fast.
###
class Snake

  constructor: (xy_list) ->
    @_this_frame = Immutable.OrderedSet(xy_list)
    @_length = 1
    @

  @at_position: (xy) ->
    new @([xy])

  set_motion: (xy) ->
    if xy?
      if !@_motion?
        @_motion = xy
      else if XY.negate(xy) isnt @_motion
        @_motion = xy
    else
      @_motion = null

  head: ->
    @_this_frame.first()

  move: ->
    if @moving()
      new_front = XY.add(@_this_frame.first(), @_motion)
      new_frame = @_this_frame.take(@_length - 1)
      @_this_frame = Immutable.OrderedSet.of(new_front, (new_frame.toJS())...)

  length: ->
    @_length

  grow: ->
    @_length++

  meets: (xy) ->
    @_this_frame.has xy

  moving: ->
    @_motion?

  toString: ->
    @_this_frame.toString()


module.exports = Snake