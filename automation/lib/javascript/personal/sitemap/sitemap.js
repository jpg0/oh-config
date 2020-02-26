const { utils, items } = require('ohj');
const { AbstractProvider } = require('ohj').provider;

const { ColorArrays, Mappings, Visibility} = require('./statement');

let SitemapProviderClass = utils.typeBySuffix('model.sitemap.SitemapProvider');
let SitemapBuilder = Java.type('org.openhab.api.sitemap.builder.EMFLessSitemapBuilder');
let WidgetFactory = Java.type('org.openhab.api.sitemap.builder.WidgetFactory');

class CallbackSitemapProvider extends AbstractProvider {
    constructor(sitemap){
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

let widgetFactory = WidgetFactory.create();


// Text newText(String item, String label, String icon, List<ColorArray> labelColor, List<ColorArray> valueColor,
//   List<VisibilityRule> visibility, List<Widget<?>> children)
let Text = function({ item, label, icon, labelColor, valueColor, visibility}, children = []) {
    return widgetFactory.newText(item, label, icon, ColorArrays(labelColor), ColorArrays(valueColor), Visibility(visibility), children);
}
 
// Switch newSwitch(String item, String label, String icon, List<ColorArray> labelColor, List<ColorArray> valueColor,
//   List<VisibilityRule> visibility, List<Mapping> mappings)
let Switch = function({ item, label, icon, labelColor, valueColor, mappings, visibility}) {
    return widgetFactory.newSwitch(item, label, icon, ColorArrays(labelColor), ColorArrays(valueColor), Visibility(visibility), Mappings(mappings));
}

// Frame newFrame(String item, String label, String icon, List<ColorArray> labelColor, List<ColorArray> valueColor,
//   List<VisibilityRule> visibility, List<Widget<?>> children)
let Frame = function({ item, label, icon, labelColor, valueColor, visibility}, children = []) {
    return widgetFactory.newFrame(item, label, icon, ColorArrays(labelColor), ColorArrays(valueColor), Visibility(visibility), children);
}

// Selection newSelection(String item, String label, String icon, List<ColorArray> labelColor, List<ColorArray> valueColor,
//    List<VisibilityRule> visibility, List<Mapping> mappings) {
let Selection = function({ item, label, icon, labelColor, valueColor, mappings, visibility}) {
    return widgetFactory.newSelection(item, label, icon, ColorArrays(labelColor), ColorArrays(valueColor), Visibility(visibility), Mappings(mappings));
}

// Webview newWebview(String item, String label, String icon, List<ColorArray> labelColor, List<ColorArray> valueColor,
//   List<VisibilityRule> visibility, int height, String url)
let Webview = function({ item, label, icon, labelColor, valueColor, visibility, height, url}) {
    return widgetFactory.newWebview(item, label, icon, ColorArrays(labelColor), ColorArrays(valueColor), Visibility(visibility), height, url);
}


// Setpoint newSetpoint(String item, String label, String icon, List<ColorArray> labelColor,
//  List<ColorArray> valueColor, List<VisibilityRule> visibility, BigDecimal minValue, BigDecimal maxValue,
//  BigDecimal step)
let BigDecimalType = Java.type('java.math.BigDecimal');
let Setpoint = function({ item, label, icon, labelColor, valueColor, visibility, minValue=0, maxValue=0, step=0}) {
    return widgetFactory.newSetpoint(item, label, icon, ColorArrays(labelColor), ColorArrays(valueColor), Visibility(visibility), new BigDecimalType(minValue), new BigDecimalType(maxValue), new BigDecimalType(step));
}

// Default newDefault(String item, String label, String icon, List<ColorArray> labelColor, List<ColorArray> valueColor,
//    List<VisibilityRule> visibility, int height)
let Default = function({ item, label, icon, labelColor, valueColor, visibility, height=0}) {
    return widgetFactory.newDefault(item, label, icon, ColorArrays(labelColor), ColorArrays(valueColor), Visibility(visibility), height);
}

// Group newGroup(String item, String label, String icon, List<ColorArray> labelColor, List<ColorArray> valueColor,
//   List<VisibilityRule> visibility, List<Widget<?>> children)
let Group = function({ item, label, icon, labelColor, valueColor, visibility}, children = []) {
    return widgetFactory.newGroup(item, label, icon, ColorArrays(labelColor), ColorArrays(valueColor), Visibility(visibility), children);
}

// Slider newSlider(String item, String label, String icon, List<ColorArray> labelColor, List<ColorArray> valueColor,
//   List<VisibilityRule> visibility, int frequency, boolean switchEnabled, BigDecimal minValue,
//   BigDecimal maxValue, BigDecimal step)
let Slider = function({ item, label, icon, labelColor, valueColor, visibility, frequency=0, switchEnabled=false, minValue=0, maxValue=0, step=0}) {
    return widgetFactory.newSlider(item, label, icon, ColorArrays(labelColor), ColorArrays(valueColor), Visibility(visibility), frequency, switchEnabled, new BigDecimalType(minValue), new BigDecimalType(maxValue), new BigDecimalType(step));
} 

let Sitemap = function({ name, label}, children = []) {
    return widgetFactory.newSitemap(name, label, null, children);
};

module.exports = {
    CallbackSitemapProvider,

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
}