let { items } = require('ohj');

let startOffGroup = items.getItem("gStartOff");

for(let item of startOffGroup.members) {
    item.sendCommand("OFF");
}