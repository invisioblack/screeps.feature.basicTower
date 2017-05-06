
// urgent repair when hits below
const LIMIT_URGENT_REPAIRING = 750;
const DECAY_AMOUNT = {
    'rampart': RAMPART_DECAY_AMOUNT, // 300
    'road': ROAD_DECAY_AMOUNT, // 100
    'container': CONTAINER_DECAY, // 5000
};

let mod = {};
module.exports = mod;

mod.extend = function(){
    Object.defineProperties(Room.prototype, {
        'hostiles': {
            configurable: true,
            get: function() {
                if( this._hostiles === undefined || this._hostilesSet != Game.time ){
                    this._hostilesSet = Game.time;
                    let notWhitelisted = (creep) => 
                        !(global.PLAYER_WHITELIST.some((player) => 
                            player.toLowerCase() === creep.owner.username.toLowerCase()
                        ));
                    this._hostiles = this.find(FIND_HOSTILE_CREEPS, { filter : notWhitelisted });
                }
                return this._hostiles;
            }
        },
        'towerHealable': {
            configurable: true,
            get: function() {
                if( this._towerHealable === undefined || this._towerHealableSet != Game.time ){
                    this._towerHealableSet = Game.time;
                    const myCreeps = this.find(FIND_MY_CREEPS);
                    const isActiveHealPart = part => ( part.type === HEAL && part.hits !== 0 );
                    const isInjured = creep => creep.hits < creep.hitsMax && (creep.towers === undefined || creep.towers.length === 0) && !this.body.some(isActiveHealPart);
                    this._towerHealable = myCreeps.filter(isInjured);
                }
                return this._towerHealable;
            }
        },
        'urgentRepairable': {
            configurable: true,
            get: function() {
                if( this._urgentRepairable === undefined || this._urgentRepairableSet != Game.time ){
                    this._urgentRepairableSet = Game.time;
                    const structures = this.find(FIND_STRUCTURES);
                    const isUrgent = structure => (
                        structure.hits < (LIMIT_URGENT_REPAIRING + (DECAY_AMOUNT[structure.structureType] || 0))
                    );
                    this._urgentRepairable = structures.filter(isUrgent);
                }
                return this._urgentRepairable;
            }
        },
    });
};
