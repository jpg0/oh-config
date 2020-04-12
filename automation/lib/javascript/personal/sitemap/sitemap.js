const { utils, items } = require('ohj');
const { AbstractProvider } = require('ohj').provider;

const { ColorArrays, Mappings, Visibility} = require('./statement');

let SitemapProviderClass = utils.typeBySuffix('model.sitemap.SitemapProvider');

const log = require('ohj').log('sitemap');

let factory = require('@runtime/sitemap').factory;

class CallbackSitemapProvider extends AbstractProvider {
    constructor(sitemapName, sitemapProvider){
        super(SitemapProviderClass);
        this.sitemap = sitemap;
    }

    addModelChangeListener(listener) {
    }

    removeModelChangeListener(listener) {
    }

    getSitemap(){
        return this.sitemap;
    }

    getSitemapNames() {
        return utils.jsArrayToJavaSet(['generated']);
    }

    getAll(){
        return utils.jsArrayToJavaList(this.callbacks.flatMap(c => c()));
    }
}

// Text newText(String item, String label, String icon, List<ColorArray> labelColor, List<ColorArray> valueColor,
//   List<VisibilityRule> visibility, List<Widget<?>> children)
let Text = function({ item, label, icon, labelColor, valueColor, visibility}, children = []) {
    return factory.newText(item, label, icon, ColorArrays(labelColor), ColorArrays(valueColor), Visibility(visibility), children);
}
 
// Switch newSwitch(String item, String label, String icon, List<ColorArray> labelColor, List<ColorArray> valueColor,
//   List<VisibilityRule> visibility, List<Mapping> mappings)
let Switch = function({ item, label, icon, labelColor, valueColor, mappings, visibility}) {
    return factory.newSwitch(item, label, icon, ColorArrays(labelColor), ColorArrays(valueColor), Visibility(visibility), Mappings(mappings));
}

// Frame newFrame(String item, String label, String icon, List<ColorArray> labelColor, List<ColorArray> valueColor,
//   List<VisibilityRule> visibility, List<Widget<?>> children)
let Frame = function({ item, label, icon, labelColor, valueColor, visibility}, children = []) {
    return factory.newFrame(item, label, icon, ColorArrays(labelColor), ColorArrays(valueColor), Visibility(visibility), children);
}

// Selection newSelection(String item, String label, String icon, List<ColorArray> labelColor, List<ColorArray> valueColor,
//    List<VisibilityRule> visibility, List<Mapping> mappings) {
let Selection = function({ item, label, icon, labelColor, valueColor, mappings, visibility}) {
    return factory.newSelection(item, label, icon, ColorArrays(labelColor), ColorArrays(valueColor), Visibility(visibility), Mappings(mappings));
}

// Webview newWebview(String item, String label, String icon, List<ColorArray> labelColor, List<ColorArray> valueColor,
//   List<VisibilityRule> visibility, int height, String url)
let Webview = function({ item, label, icon, labelColor, valueColor, visibility, height, url}) {
    return factory.newWebview(item, label, icon, ColorArrays(labelColor), ColorArrays(valueColor), Visibility(visibility), height, url);
}


// Setpoint newSetpoint(String item, String label, String icon, List<ColorArray> labelColor,
//  List<ColorArray> valueColor, List<VisibilityRule> visibility, BigDecimal minValue, BigDecimal maxValue,
//  BigDecimal step)
let BigDecimalType = Java.type('java.math.BigDecimal');
let Setpoint = function({ item, label, icon, labelColor, valueColor, visibility, minValue=0, maxValue=0, step=0}) {
    return factory.newSetpoint(item, label, icon, ColorArrays(labelColor), ColorArrays(valueColor), Visibility(visibility), new BigDecimalType(minValue), new BigDecimalType(maxValue), new BigDecimalType(step));
}

// Default newDefault(String item, String label, String icon, List<ColorArray> labelColor, List<ColorArray> valueColor,
//    List<VisibilityRule> visibility, int height)
let Default = function({ item, label, icon, labelColor, valueColor, visibility, height=0}) {
    return factory.newDefault(item, label, icon, ColorArrays(labelColor), ColorArrays(valueColor), Visibility(visibility), height);
}

// Group newGroup(String item, String label, String icon, List<ColorArray> labelColor, List<ColorArray> valueColor,
//   List<VisibilityRule> visibility, List<Widget<?>> children)
let Group = function({ item, label, icon, labelColor, valueColor, visibility}, children = []) {
    return factory.newGroup(item, label, icon, ColorArrays(labelColor), ColorArrays(valueColor), Visibility(visibility), children);
}

// Slider newSlider(String item, String label, String icon, List<ColorArray> labelColor, List<ColorArray> valueColor,
//   List<VisibilityRule> visibility, int frequency, boolean switchEnabled, BigDecimal minValue,
//   BigDecimal maxValue, BigDecimal step)
let Slider = function({ item, label, icon, labelColor, valueColor, visibility, frequency=0, switchEnabled=false, minValue=0, maxValue=0, step=0}) {
    return factory.newSlider(item, label, icon, ColorArrays(labelColor), ColorArrays(valueColor), Visibility(visibility), frequency, switchEnabled, new BigDecimalType(minValue), new BigDecimalType(maxValue), new BigDecimalType(step));
} 

let Sitemap = function({ name, label}, children = []) {
    return factory.newSitemap(name, label, null, children);
};

let SitemapProvider = function(sitemaps) {
    //return new CallbackSitemapProvider(sitemaps[0]);
    return factory.newFixedSitemapProvider(sitemaps);
}

module.exports = {
    SitemapProvider,

    Text,
    Switch,
    Frame,
    Selection,
    Webview,
    Setpoint,
    Default,
    Group,
    Slider,
    Sitemap,

    ...require('./singletons'),
}
