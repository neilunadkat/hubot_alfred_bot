db = require("./js/mysql")

module.exports = (robot) ->
  robot.respond  /whois/i, (msg) ->
    msg.reply "Let me just check"
    msg.emote "is looking into the database"
    setTimeout () ->
      db.whoIs(msg.message.text,"alfred",(t) -> msg.reply t)
     , 4000

  robot.respond /how many accounts/i, (msg) ->
    msg.reply "Let me check"
    msg.emote "is counting"
    setTimeout () ->
      db.howManyAccounts((t) -> msg.reply t)
     , 4000

  robot.respond /get info for acc/i, (msg) ->
    msg.reply "Let me check"
    msg.emote "is looking into the database"
    setTimeout () ->
      db.accountInfo(msg.message.text,"alfred",(t) -> msg.reply t)
     , 4000

  robot.respond /get info for dep/i, (msg) ->
    msg.reply "Let me check"
    msg.emote "is looking into the database"
    setTimeout () ->
      db.deploymentInfo(msg.message.text,"alfred",(t) -> msg.reply t)
     , 4000
