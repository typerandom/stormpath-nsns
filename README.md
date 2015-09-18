Stormpath - New Signup Notification Service (NSNS)
------------------------------------------------------------

### What?

Turns Stormpath signups into HipChat notifications!

### How?

1. Grab your Stormpath apiKey.properties file and put it in the root of the directory.
2. Copy config.json.default to config.json and fill in the missing details.
3. Run the server! `$ node server.js`
4. Open up HipChat, go to the name of the channel specified in config.json and watch as notifications of new signups arrive!

### License

WTFPL - http://www.wtfpl.net/about/