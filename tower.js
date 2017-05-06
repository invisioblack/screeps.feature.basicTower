let mod = {};
module.exports = mod;

mod.extend = function(){
    StructureTower.prototype.execute = function (room) {
        // TODO: convert to action pattern?
        let towerCount = room.structures.towers.length;
        let tower = this;

        // Heal
        if( room.towerHealable != null && room.towerHealable.length !== 0 ) {
            const maxRange = 15 - towerCount;
            const inRange = creep => tower.pos.getRangeTo(creep) < maxRange && ( room.hostiles == null || room.hostiles.length === 0 || creep.hitsMax - creep.hits > 399 );
            let targets = room.towerHealable.filter(inRange);
            if( targets.length !== 0 ){
                let target = targets[0];
                tower.heal(target);
                if( target.towers === undefined )
                    target.towers = [];
                target.towers.push(tower.id);
                return;
            }
        }

        // urgent Repair
        if( room.structures.urgentRepairable.length > 0 ) {
            let target = room.structures.urgentRepairable[0];
            tower.repair(target);
            if( target.towers === undefined )
                target.towers = [];
            target.towers.push(tower.id);
            return;
        }

        // Attack
        if( room.hostiles != null && room.hostiles.length !== 0 ){
            const maxRange = 30 - (towerCount*3);
            const inRange = creep => tower.pos.getRangeTo(creep) < maxRange;
            let hostilesInRange = room.hostiles.filter(inRange);
            if( hostilesInRange.length !== 0 ){
                let closestHostile = tower.pos.findClosestByRange(hostilesInRange);
                if( closestHostile != null ) 
                    tower.attack(closestHostile);
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
