let events = require('events');
let HttpClient = Java.type('org.eclipse.jetty.client.HttpClient');
let DigestAuthentication = Java.type('org.eclipse.jetty.client.util.DigestAuthentication');
let URI = Java.type('java.net.URI');

let logger = require('ohj').log('request');

/*
This is a very simple implementation of https://github.com/request/request using Jetty Client
*/

class Request extends events.EventEmitter {
    constructor(config, cb) {
        super();

        this.uri = config.uri;

        this.auth = config.auth;
        this.headers = config.headers;
        this.cb = cb;

        this.httpClient = new HttpClient();
        this.httpClient.start();
        this.doRequest();
    }

    doRequest() {
        try
        {
            if(this.auth) {
                this.httpClient.getAuthenticationStore().addAuthentication(
                    new DigestAuthentication(new URI(this.uri), "<<ANY_REALM>>", this.auth.user, this.auth.password));
            }

            let response = this.httpClient.newRequest(this.uri).send()
            let status = response.getStatus();

            if(status >= 200 && status < 400) {
                this.cb(undefined, {
                    statusCode: response.getStatus()
                }, response.getContentAsString().toString());
            } else {
                this.cb(new Error(`${status}: ${response.getContentAsString()}`));
            }
        }
        catch(e) {
            this.cb(e);
        }
    }
}

module.exports = (config, cb) => new Request(config, cb)



  
    //   client.on('response', () => {
    //     debug(`Connected to ${this.baseUri}`);
    //     this.emit("connect")
    //   });
    //   client.on('error', err => this.emit("error", err));
    //   client.on('data', this.handleDahuaEventData.bind(this));
    //   client.on('close', () => {   // Try to reconnect after 30s
    //     () => setTimeout(() => this.listenForEvents(eventNames), 30000);
    //     this.emit("end");
    //   });