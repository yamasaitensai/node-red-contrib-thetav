module.exports = function(RED) {
    "use strict";
    // require any external libraries we may need....
    var Theta = require('ricoh-theta');
    var fs = require('fs');

    // The main node definition - most things happen in here
    function ThetaNode(n) {
        // Create a RED node
        RED.nodes.createNode(this,n);

        // Store local copies of the node configuration (as defined in the .html)
        this.topic = n.topic;

        // copy "this" object in case we need it in context of callbacks of other functions.
        var node = this;

        var theta = new Theta();
        var filename;

        // respond to inputs....
        this.on('input', function (msg) {
            theta.connect('192.168.1.1');
            node.log("connecting to theta");
        });

        this.on("close", function() {
        });

        // capture
        theta.on('connect', function(){
            node.log("theta.on 'connect'");
            theta.capture(function(err){
                if(err) return console.error(err);
                    console.log('capture success');
            });
        });

        // get picture
        theta.on('objectAdded', function(object_handle){
            node.log("theta.on 'objectAdded'"+object_handle);
            theta.getPicture(object_handle, function(err, picture){
                fs.writeFile(object_handle.toString()+'.jpg', picture, function(err){
                    console.log('picture saved => '+object_handle);
                    theta.disconnect();
                });
            });
        });        
    }

    // Register the node by name. This must be called before overriding any of the
    // Node functions.
    RED.nodes.registerType("theta",ThetaNode);

};