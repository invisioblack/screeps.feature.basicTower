
let mod = {};
module.exports = mod;

mod.install = function(){
    context.requiresMemory = false;
    context.inject(Room, 'room');
    context.inject(StructureTower, 'tower');
};
