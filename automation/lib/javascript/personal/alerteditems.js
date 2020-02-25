const items = require('ohj').items;

module.exports = {
    ALERTED_ITEMS_TAG: "__alerted_item__",
    ALERTED_ITEMS_ITEM_NAME: "gAlerted",

    setAlerted:(item, isAlerted) => {
        if(typeof item === 'string') {
            item = items.getItem(item);
        }

        if(isAlerted) {
            item.addTags(this.ALERTED_ITEMS_TAG);
        } else {
            item.removeTags(this.ALERTED_ITEMS_TAG);
        }
    }
}