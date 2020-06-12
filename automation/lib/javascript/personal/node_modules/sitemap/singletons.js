const { osgi, utils } = require('ohj');
const lifecycle = require('@runtime/osgi').lifecycle;


const log = require('ohj').log('sitemap_singletons');

const sitemapProviderClassName = utils.typeBySuffix('model.sitemap.SitemapProvider').class.getName();

function disposeRegistered(id = "*") {
    for(let service of osgi.findServices(sitemapProviderClassName, `(sitemapId=${id})`)) {
        osgi.unregisterService(service);
        log.debug("Unregistered {}", service);
    }
}

function registerSingleton(sitemapProvider, id = "__default__") {
    disposeRegistered(id);

    registeredService = osgi.registerPermanentService(
        sitemapProvider,
        [sitemapProviderClassName],
        {
            "sitemapId": id
        }
    );
}
 
lifecycle.addDisposeHook(() => disposeRegistered());

module.exports = {
    registerSingleton
}