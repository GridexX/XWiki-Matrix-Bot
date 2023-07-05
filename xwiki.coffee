# Description:
#   XWiki bot
#
#   This script allows interaction with XWiki.
#   The bot commands are
#
#   xwiki search [solr search terms]
#
#   Also XWiki can send callbacks to Hubot to send notifications to the proper channels
#   In XWiki you indicate a channel for a sub-wiki, a space or a page and notifications will be sent to the channel
#
module.exports = (robot) ->

  robot.respond /search (.*)/, (res) ->
   query = res.match[1]
   res.reply "Search for #{query}, please wait..."
   url = "#{process.env.XWIKI_URL}rest/wikis/query?media=json&prettyNames=true&type=solr&q=#{query}"
   robot.http(url)
    .header('Accept', 'application/json')
    .header('User-Agent', 'nosso')
    .auth(process.env.XWIKI_USERNAME, process.env.XWIKI_PASSWORD)
    .get() (err, hres, body) ->
      # error checking code here
      urlRegex = /(http.*?:\/\/)(.*?)([.].*?)(\/rest\/wikis\/)(.*?)\/spaces\/(.*)/
      data = JSON.parse body
      str = "Number Result: #{data.searchResults.length}\n"
      for searchResult, i in data.searchResults
        pageUrl = searchResult.links[0].href
        pageUrl = pageUrl.replace urlRegex, (match, p1, p2, p3, p4, p5, p6) ->
           return p1 + p5 + p3 + "/bin/view/" + p6.replace(/\/spaces\//g, "/").replace(/\/pages\//g, "/")

        str += "#{searchResult.pageFullName} #{pageUrl}\n"
      res.reply str

  robot.router.post '/xwiki/notifications/:room', (req, res) ->
     room   = req.params.room
     data   = if req.body.payload? then JSON.parse req.body.payload else req.body
     msg = data.msg

     robot.messageRoom room, msg

     res.send 'OK'

  robot.router.post '/xwiki/newchat/', (req, res) ->
     data   = if req.body.payload? then JSON.parse req.body.payload else req.body
     roomName = data.roomName
     options =
       name : roomName
       visibility : "public"

     robot.adapter.client.createRoom options, (err, data) =>
       robot.logger.error data
       res.send data


  robot.error (err, res) ->
    robot.logger.error "DOES NOT COMPUTE"

    if res?
     res.reply "DOES NOT COMPUTE"
