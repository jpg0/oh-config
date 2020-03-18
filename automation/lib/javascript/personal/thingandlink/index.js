const provider = require('ohj').provider;

let addToSystem = function(thingsAndItems){
    let itemsProvider = provider.newCallbackItemProvider();
    let thingsProvider = provider.newCallbackThingProvider();
    let metadataProvider = provider.newCallbackMetadataProvider();
    
    for(let tai of thingsAndItems) {
        tai.addToMetadataProvider(metadataProvider);
        tai.addToThingsProvider(thingsProvider);
        tai.addToItemsProvider(itemsProvider); //items last as they will wire up bindings
    }

    metadataProvider.register();  
    thingsProvider.register();     
    itemsProvider.register();    

    for(let tai of thingsAndItems) {
        tai.activateRules();
    }

    return {
        itemsProvider,
        thingsProvider,
        metadataProvider
    }
}

module.exports = {
    addToSystem,
    device: {
        ...require('./tasmotatai'),
        ...require('./zigbeebulbtai'),
        ...require('./xiaomizigbeetai'),
        ...require('./rollertai'),
        ...require('./433tai'),
        ...require('./zigbeebuttontai'),
        ...require('./huezigbeetai'),
    }
}