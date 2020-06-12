
const { items } = require('ohj');
const log = require('ohj').log("rollerssystem");
const Thread = Java.type("java.lang.Thread");

const rollersMap = [
    {'name':'Large_Left_Blind_Roller','groupName':'Large_Blinds_Roller_Group'},
    {'name':'Large_Centre_Blind_Roller','groupName':'Large_Blinds_Roller_Group'},
    {'name':'Large_Right_Blind_Roller','groupName':'Large_Blinds_Roller_Group'},
    {'name':'Large_Left_Screen_Roller','groupName':'Large_Screens_Roller_Group'},
    {'name':'Large_Centre_Screen_Roller','groupName':'Large_Screens_Roller_Group'},
    {'name':'Large_Right_Screen_Roller','groupName':'Large_Screens_Roller_Group'},
    {'name':'Small_Left_Blind_Roller','groupName':'Small_Blinds_Roller_Group'},
    {'name':'Small_Centre_Blind_Roller','groupName':'Small_Blinds_Roller_Group'},
    {'name':'Small_Right_Blind_Roller','groupName':'Small_Blinds_Roller_Group'},
    {'name':'Door_Left_Blind_Roller','groupName':'Door_Blinds_Roller_Group'},
    {'name':'Door_Right_Blind_Roller','groupName':'Door_Blinds_Roller_Group'},
    {'name':'Door_Left_Screen_Roller','groupName':'Door_Screens_Roller_Group'},
    {'name':'Door_Right_Screen_Roller','groupName':'Door_Screens_Roller_Group'},
    {'name':'Toilet_Blind_Roller'}
]

class RollerSystem {
    constructor(rollersConfig) {
        this.rollersToRollerGroup = indexBy(rollersConfig, (k,v) => ({key: v.name, value: v.groupName}))
        this.rollerGroupToRollers = indexBy(rollersConfig, (k,v) => ({key: v.groupName, value: v.name}))
    }

    setState(rollersState) {
        let groupNameToNameAndOp = indexBy(rollersState, (k,v) => ({
            key: this.rollersToRollerGroup[v.name] || "___nogroup___",
            value: ({'name':v.name, 'op':v.op})
        }));

        log.debug("State by group to set: {}", JSON.stringify(groupNameToNameAndOp));

        let opsToAction = {};

        for(let groupName in groupNameToNameAndOp) {
            let nameAndOps = groupNameToNameAndOp[groupName];
            //if ops all match
            let commonOp = nameAndOps.reduce((prev, current) => prev.op == current.op ? prev : null)
            if(commonOp != null) {
                //if we have all the rollers in the group (by counting)
                let completeGroup = this.rollerGroupToRollers[groupName];
                if(typeof completeGroup !== 'undefined' && nameAndOps.length === completeGroup.length) {
                    //scavenge the group
                    opsToAction[groupName] = commonOp.op;
                    continue;
                }
            }

            for(let nameAndOp of nameAndOps) {
                opsToAction[nameAndOp.name] = nameAndOp.op;
            }
        }

        this.processOps(opsToAction);
    }

    processOps(opsToAction) {
        for(let name in opsToAction) {
            let action = opsToAction[name];
            log.debug(`items.getItem(${name}).sendCommand(${opsToAction[name]})`);
            items.getItem(name).sendCommand(action);

            //also set the status on the individual items
            let childrenToUpdate = this.rollerGroupToRollers[name];
            if(typeof childrenToUpdate !== 'undefined') {
                for(let r of childrenToUpdate) {
                    items.getItem(r).postUpdate(action)
                }
            }

            Thread.sleep(200); //don't overload the neosmart
        }
    }
}

function indexBy(arrayOfItems, keyValueFn) {
    let rv = {};

    for(let i in arrayOfItems) {
        let {key,value} = keyValueFn(i, arrayOfItems[i]);
        if(typeof rv[key] === 'undefined') {
            rv[key] = [];
        }
        rv[key].push(value);
    }

    return rv;
}

let rollerSystem = new RollerSystem(rollersMap);

module.exports = {
    /**
     * setState({
     * 'roller1':'up',
     * 'roller2':'down'
     * });
     */
    setState:(r) => rollerSystem.setState(r)
}