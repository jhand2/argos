var DeviceService = require("../services/device-service");
var UserService = require("../services/user-service");
var auth = require("basic-auth");

module.exports = function(app, ds, config) {

    var us = new UserService(config);

    app.get("/health", (req, res) => {
        res.send("Success");
    })

    app.put("/notify_state/:fulcrumId/:deviceId", (req, res) => {
        var did = req.params.deviceId;
        var fulcrumId = req.params.fulcrumId;
        var state = req.body.state;
        ds.notifyState(did, fulcrumId, state).then((body) => {
            res.send(body);
        }).catch((err) => {
            console.log(err);
            res.status(500).send(err.toString());
        });
    })

    app.put("/notify_state/:fulcrumId", (req, res) => {
        var devices = req.body;
        ds.notifyStateBulk(devices, req.params.fulcrumId).then(success => {
            res.send(success);
        }).catch(err => {
            console.log(err)
            res.status(500).send(err);
        })
    })

    app.post("/set_state/:uid/:deviceId", (req, res) => {
        var did = req.params.deviceId;
        var uid = req.params.uid;
        var on = req.body.on;
        ds.setDeviceState(did, uid, on).then((r) => {
            res.send({success: true});
        }).catch((err) => {
            res.send({success: false});
        }); 
    })

    app.get("/devices/:uid", (req, res) => {
        var uid = req.params.uid;
        ds.getDevices(uid).then((devices) => {
            res.json(devices);
        }).catch((err) => {
            console.log(err);
            res.status(500).send(err);
        });
    });

    app.post("/map_fulcrum", (req, res) => {
        var uid = req.body.uid;
        var fulcrumId = req.body.fulcrumId;
        us.mapFulcrum(uid, fulcrumId).then(success => {
            res.send(success);
        });
    })

    app.post("/create_user", (req, res) => {
        var user = auth(req);
        us.makeNewUser(req.body.username, user.name, user.pass).then(u => {
            res.json(u);
        }).catch(err => {
            res.status(403).send(err);
        });
    })

    app.get("/sign_in", (req, res) => {
        var user = auth(req);
        us.getUserToken(user.name, user.pass).then(u => {
            res.json(u);
        }).catch(err => {
            console.log(err);
            res.status(403).send(err);
        })
    })

    app.get("/get_time_series/:fulcrumId/:deviceId", (req, res) => {
        var fulcrumId = req.params.fulcrumId;
        var deviceId = req.params.deviceId;
        var q = req.query;
        ds.getTimeSeries(deviceId, fulcrumId, q.from, q.to).then(val => {
            res.json(val);
        }).catch(err => {
            res.status(404).send(err);
        })
    })
}
