//let widgetFactory = Java.type('org.openhab.api.sitemap.builder.WidgetFactory').create();
let widgetFactory = require('@runtime/sitemap').factory;

//LastUpdated<3600="green" 
//<3600="green" 
//3600="green" 
//LastUpdated<3600="green" 
let ColorArrays = function(strs) {
    
    if(typeof strs === 'undefined' || typeof strs === 'null') {
        return [];
    }

    return strs.map((str) => {

        if(!str.includes('=')) {
            return widgetFactory.newColorArray(null,null,null,null,str);
        }

        let parsed = str.match(/^(?<item>[A-Za-z][A-Za-z0-9_]*|)(?<condition>==|!=|\>|\<|)(?<sign>-|)(?<state>[0-9A-Za-z]+)=\"?(?<arg>[a-z]+)\"?$/);

        if(!parsed) {
            throw `Failed to parse color statement: ${str}`;
        }

        return widgetFactory.newColorArray(
            parsed.groups.item,
            parsed.groups.condition,
            parsed.groups.sign,
            parsed.groups.state,
            parsed.groups.arg
        );
    });
}

let Mappings = function(obj) {
    
    if(typeof obj === 'undefined' || typeof obj === 'null') {
        return obj;
    }

    return Object.keys(obj).map(function(key) {
        return widgetFactory.newMapping(key, obj[key]);
    });
}

//LastUpdated<3600
let Visibility = function(strs) {

    if(typeof strs === 'undefined' || typeof strs == 'null') {
        return [];
    }

    return strs.map((str) => {

        let parsed = str.match(/^(?<item>[A-Za-z][A-Za-z0-9_]*|)(?<condition>==|!=|\>|\<|)(?<sign>-|)(?<state>[0-9A-Za-z]+)?$/);

        if(!parsed) {
            throw `Failed to parse visibility statement: ${str}`;
        }

        return widgetFactory.newVisibilityRule(
            parsed.groups.item,
            parsed.groups.condition,
            parsed.groups.sign,
            parsed.groups.state
        );
    });
}

module.exports = {
    ColorArrays,
    Mappings,
    Visibility
}
