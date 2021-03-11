const { things, provider } = require('ohj');


let thing = things.newThingBuilder(`mqtt:topic`, `thingtest`, `mqtt:broker:mosquitto`).build();

let p = provider.newCallbackThingProvider();

p.addCallback(() => [thing]);

p.register();

  
//provider.newCallbackMetadataProvider().register();
