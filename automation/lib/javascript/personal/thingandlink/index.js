const provider = require('ohj').provider;

let addToSystem = function(thingsAndItems){
    let itemsProvider = provider.newCallbackItemProvider();
    let thingsProvider = provider.newCallbackThingProvider();
    let metadataProvider = provider.newCallbackMetadataProvider();
    let itemChannelLinkProvider = provider.newCallbackItemChannelLinkProvider();
    
    for(let tai of thingsAndItems) {
        tai.addToMetadataProvider(metadataProvider);
        tai.addToThingsProvider(thingsProvider);
        tai.addToItemsProvider(itemsProvider); //items last as they will wire up bindings
        tai.addToItemChannelLinksProvider(itemChannelLinkProvider);
    }

    metadataProvider.register();  
    thingsProvider.register();     
    itemsProvider.register();    
    // itemChannelLinkProvider.register();

    return {
        itemsProvider,
        thingsProvider,
        metadataProvider,
        itemChannelLinkProvider
    }
}

module.exports = {
    addToSystem,
    device: {
        ...require('./tasmotatai'),
        ...require('./zigbeebulbtai'),
        ...require('./xiaomizigbeetai'),
        ...require('./rollertai'),
        ...require('./433tai')
    }
}