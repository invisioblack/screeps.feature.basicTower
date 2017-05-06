
let mod = {};
module.exports = mod;

mod.dependencies = [];
mod.install = function(){
    context.requiresMemory = false;

    // urgent repair when hits below
    context.defaultValue('LIMIT_URGENT_REPAIRING', 750);
    context.defaultValue('PLAYER_WHITELIST', []);    

    context.inject(Room, 'room');
    context.inject(StructureTower, 'tower');
};
