
module.exports = (robot) ->
  robot.hear /badger/i, (msg) ->
    msg.send "Badgers? BADGERS? WE DON'T NEED NO STINKIN BADGERS"

  robot.respond /open the pod bay doors/i, (msg) ->
    msg.reply "I'm afraid I can't let you do that."

  robot.hear /I like pie/i, (msg) ->
    msg.emote "makes a freshly baked pie"
