const log = require('ohj').log('fluoro_lights');
const { fluent, actions, items } = require('ohj');


with(fluent) {

    items.replaceItem('Red_Hand', 'Switch', 'light', [], 'Red Hand Light')

    when(item('Red_Hand').receivedCommand()).then(() => {
        //publish rf code
        //toggle state
    });

}