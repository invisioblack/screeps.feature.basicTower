let mod = {};
module.exports = mod;

mod.extend = function(){
    StructureTower.prototype.execute = function (room) {
        const towerCount = room.structures.towers.length;
        let that = this;

        // Heal
        if( room.towerHealable != null && room.towerHealable.length !== 0 ) {
            const maxRange = 15 - towerCount;
            const inRange = creep => that.pos.getRangeTo(creep) < maxRange && ( room.hostiles == null || room.hostiles.length === 0 || creep.hitsMax - creep.hits > 399 );
            let targets = room.towerHealable.filter(inRange);
            if( targets.length !== 0 ){
                let target = targets[0];
                this.heal(target);
                if( target.towers === undefined )
                    target.towers = [];
                target.towers.push(this.id);
                return;
            }
        }

        // urgent Repair
        if( room.urgentRepairable.length > 0 ) {
            let target = room.urgentRepairable[0];
            this.repair(target);
            if( target.towers === undefined )
                target.towers = [];
            target.towers.push(this.id);
            return;
        }

        // Attack
        if( room.hostiles != null && room.hostiles.length !== 0 ){
            const maxRange = 30 - (towerCount*3);
            const inRange = creep => that.pos.getRangeTo(creep) < maxRange;
            let hostilesInRange = room.hostiles.filter(inRange);
            if( hostilesInRange.length !== 0 ){
                let closestHostile = this.pos.findClosestByRange(hostilesInRange);
                if( closestHostile != null ) 
                    this.attack(closestHostile);
            }
        }   
    };    
};

function executeInstance(room){
    if( room.my ){
        let execute = tower => tower.execute(room);
        _.forEach(room.structures.towers, execute);
    }
}

function execute(){
    _.forEach(Game.rooms, executeInstance);
}

context.execute.on(execute);
