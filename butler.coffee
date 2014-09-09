
module.exports = (robot) ->

  robot.hear /I like beer/i, (msg) ->
    msg.emote "makes a freshly brewed beer"
    console.log(msg.envelope)

