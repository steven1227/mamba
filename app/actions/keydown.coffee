AbstractAction = require './action'
_ = require 'underscore'
Immutable = require 'immutable'
{XY} = require '../utility'


KeyDownAction = AbstractAction.implementation class KeyDownAction
  @KEYCODES: Immutable.Set [
    37 # ←
    38 # ↑
    39 # →
    40 # ↓
    82 # r
  ]

  @METHOD_KEYS: Immutable.Map [
    [82, 'restart']
  ]

  @MOTION_KEYS: Immutable.Map [
    [37, XY.left()]
    [38, XY.up()]
    [39, XY.right()]
    [40, XY.down()]
  ]

  @validate_payload: (payload) ->
    unless _.isObject(payload) && _.isNumber(payload.keycode)
      throw new Error 'Expected payload to have a number keycode property'

  @post_value_of_hook: (payload) ->
    {keycode} = payload
    if @KEYCODES.has keycode
      # We'd like to use super(payload), but this means
      # something different in CoffeeScript than in ES6
      Object.getPrototypeOf(@).post_value_of_hook.call(@, payload)
    else
      throw new Error "Unsupported keycode: #{keycode}; try #{@KEYCODES}"

  keycode: ->
    @payload.keycode

  is_motion: ->
    @constructor.MOTION_KEYS.has @keycode()

  is_method: ->
    @constructor.METHOD_KEYS.has @keycode()

  motion: ->
    @constructor.MOTION_KEYS.get @keycode()

  method: ->
    @constructor.METHOD_KEYS.get @keycode()


module.exports = {KeyDownAction}