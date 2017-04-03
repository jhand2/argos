var http = require("http");
var express = require("express")
var bodyParser = require("body-parser");
var app = express();
var argv = require("minimist")(process.argv.slice(-2));

var JobService = require('./services/job-service');
var js = new JobService();

if (argv.d || argv.dev) process.env.dev = true;

var config = require("./utils/conf-mgr");
config.startup();

var device_libs = {
	"hue": require('./devices/hue-bridge')
}

app.use(bodyParser.json());

// Adds the routes in routes.js to our express app
require("./app/routes")(app);

let port = 8080;

// Start express app
app.listen(port, () => {
	console.log("Listening on " + port);
	js.runSetStateJob();
	js.runDiscoverJob();
});
