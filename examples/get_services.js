const k8s = require('@kubernetes/client-node');
const request = require('request');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const opts = {};
kc.applyToRequest(opts);

request.get(`${kc.getCurrentCluster().server}/api/v1/namespaces/default/services`, opts,
    (error, response, body) => {
        if (error) {
            console.log(`error: ${error}`);
        }
        if (response) {
            console.log(`statusCode: ${response.statusCode}`);
       }
        console.log(`body: ${body}`);
        var svcs = JSON.parse(body);
        var servers = []; 
        for (var i=0;i<svcs.items.length;i++){
            var svc = svcs.items[i];
            var server = {};
            server.name = svc.metadata.name;
            if (svc.metadata.name!=='kubernetes'){
                console.log(`ClusterIP: ${svc.spec.clusterIP}`);
                var ports = svc.spec.ports;
                var endpoints = {};
                for (j=0;j<ports.length;j++){
                    endpoints[ports[j].name] = ports[j].port;
                }
                server.endpoints = endpoints;
                servers.push(server);
            }
        }
        console.log(JSON.stringify(servers));
  });
