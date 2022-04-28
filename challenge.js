/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

function log(myHeroes) {
    let i = 0;
    while (i <= 2){
        if (myHeroes[i].target == undefined) {
            myHeroes[i].set_target(defaultpos[i]);
        }
        myHeroes[i].move();
        i++;
    }
}

function updatepos(entity, x, y)
{
    entity.set_pos(x, y);
}

function attack_closest(index) {
    if (farBadguy != undefined)
    {
        myHeroes[index].set_closestmonster(theMonsters);
        myHeroes[index].set_target(myHeroes[index].closestmonster.pos);
    }
    else {
        myHeroes[index].target = undefined;
    }
}

function get_distance(posA, posB) {
    let a = posA[0] - posB[0];
    let b = posA[1] - posB[1];
    
    return Math.sqrt( a*a + b*b );
}

function get_closest_monster(mypos , theMonsters) {
    let closest = theMonsters[0];
    for (i in theMonsters)
        if (get_distance(mypos, theMonsters[i].pos) < get_distance(mypos, closest.pos))
            closest = theMonsters[i];
    return closest;
}

function attack_most_threatening(index) {
    if (theMonsters != []) {
        let closebadguy = theMonsters.find(monster => monster.DistancetoBase < 5000);
        if (closebadguy != undefined) {
            let mytarget = get_closest_monster(mybase.pos, theMonsters);
            myHeroes[index].set_target(mytarget.pos);
        }
        else
            myHeroes[index].target = undefined;
    }
}

/****************************/
/*	CLASS					*/
/****************************/

class Entity {
    constructor(){
    };
    set_follow(e_toX, e_toY) {
        this.follow = [e_toX, e_toY]; 
    }
    set_id(e_id) {
        this.id = e_id;
    }
    set_pos(p_x, p_y) {
        this.pos = [p_x, p_y];
    }
    set_health(e_health) {
        this.health = e_health;
    }
    set_vector(e_vx, e_vy) {
        this.vector = [e_vx, e_vy];
    }
    set_nearbase(e_nearBase){
        this.nearBase = e_nearBase;
    }
    set_threatFor(e_threat) {
        this.threat = e_threat;
    }
    set_DistancetoBase(e_baseX, e_baseY, pos) {
        let a = [e_baseX, e_baseY];
        this.DistancetoBase = get_distance(a, pos);
    }
    set_target(target) {
        this.target = target;
    }
    set_route(e_routeX, e_routeY) {
        this.route = [e_routeX, e_routeY];
    }
    set_nearbyspiders(Entity ,theMonsters) {
        let count;
        for (i in theMonsters) {
            if (get_distance(Entity.pos, theMonsters.pos) < 1000)
            count++;
        }
    }
    set_closestmonster(theMonsters) {
        if (theMonsters != [])
        this.closestmonster = get_closest_monster(this.pos, theMonsters);
        else
        this.closestmonster = undefined;
    }
    set_isControlled(e_isControlled) {
        this.isControlled = e_isControlled;
    }
    set_shieldLife(e_shieldLife) {
        this.shieldLife = e_shieldLife;
    }
    set_control_target() {

    }
    move() {
        console.log('MOVE ' + this.target[0] + ' ' + this.target[1]);
    }
    windspell(target) {
        console.log('SPELL WIND ' + target[0] + ' ' + target[1]);
    }
    controlspell(direction) {
        console.log('CONTROL ' + this.controltarget.id + ' ' + direction[0] + ' ' + direction[1]);
    }
}


class base extends Entity{
	constructor() {
        super();
		this.health = undefined;
		this.mana = undefined;
        this.pos = undefined;
        this.closestmonster = undefined;
	}
}
class Hero extends Entity {
    constructor() {
        super();
        this.id = undefined;
        this.pos = undefined;
        this.isControlled = undefined;
        // this.route = undefined;
        // this.nearbyspiders = undefined;
        this.target = undefined;
        this.closestmonster = undefined;
        this.controltarget = undefined;
        this.shieldLife = undefined;
        //  this.shieldLife = undefined;
        //  this.isControlled = undefined;
    }
}

class Monster extends Entity {
    constructor() {
        super();
        this.health = undefined;
        this.vector = undefined;
        this.nearBase = undefined;
        this.pos = undefined;
        this.threat = undefined;
        this.DistancetoBase = undefined;
        this.nearbyspiders = undefined;
        this.isControlled = undefined;
        this.shieldLife = undefined;
    }
}

/****************************/
/*	PARSING					*/
/****************************/

var inputs = readline().split(' ');
const baseX = parseInt(inputs[0]); // The corner of the map representing your base
const baseY = parseInt(inputs[1]);
const heroesPerPlayer = parseInt(readline()); // Always 3

let waves = 1;
let index = 0;
myHeroes = [];
enemyHeroes = [];
theMonsters = [];
enemybase = new base();
if (baseX == 0) {
    enemybase.set_pos(17630, 9000);
    defaultpos = [[5000, 1228],[800, 800],[2500, 4300]];
}
else {
    enemybase.set_pos(0, 0);
    defaultpos = [[13250, 6800],[17000, 8100],[15500, 4500]];
}

mybase = new base();
mybase.set_pos(baseX, baseY);

function Parseentities() {
    for (let i = 0; i < 2; i++) {
        var inputs = readline().split(' ');
        const health = parseInt(inputs[0]); // Each player's base health
        const mana = parseInt(inputs[1]); // Ignore in the first league; Spend ten mana to cast a spell
        mybase.health = health;
        mybase.mana = mana;
    }
    const entityCount = parseInt(readline()); // Amount of heros and monsters you can see
    for (let i = 0; i < entityCount; i++) {
        var inputs = readline().split(' ');
        const id = parseInt(inputs[0]); // Unique identifier
        const type = parseInt(inputs[1]); // 0=monster, 1=your hero, 2=opponent hero
        const x = parseInt(inputs[2]); // Position of this entity
        const y = parseInt(inputs[3]);
        const shieldLife = parseInt(inputs[4]); // Ignore for this league; Count down until shield spell fades
        const isControlled = parseInt(inputs[5]); // Ignore for this league; Equals 1 when this entity is under a control spell
        const health = parseInt(inputs[6]); // Remaining health of this monster
        const vx = parseInt(inputs[7]); // Trajectory of this monster
        const vy = parseInt(inputs[8]);
        const nearBase = parseInt(inputs[9]); // 0=monster with no target yet, 1=monster targeting a base
        const threatFor = parseInt(inputs[10]); // Given this monster's trajectory, is it a threat to 1=your base, 2=your opponent's base, 0=neither
        if (type == 0)
        {
            let newMonster = new Monster();
            newMonster.set_health(health);
            newMonster.set_id(id);
            newMonster.set_nearbase(nearBase);
            newMonster.set_vector(vx, vy);
            newMonster.set_pos(x, y);
            newMonster.set_threatFor(threatFor);
            newMonster.set_DistancetoBase(baseX, baseY, newMonster.pos);
            newMonster.set_isControlled(isControlled);
            //console.error(newMonster.DistancetoBase);
            theMonsters.push(newMonster);
        }
        if (type == 1) {
            let newHero = new Hero();
            newHero.set_pos(x, y);
            newHero.set_id(id);
            newHero.set_isControlled(isControlled);
            myHeroes.push(newHero);
        }
        if (type == 2) {
            let newenemyHero = new Hero();
            newenemyHero.set_pos(x, y);
            newenemyHero.set_id(id);
            enemyHeroes.push(newenemyHero);
        }

    }
}

// game loop
while (true) {
    
    Parseentities();
    farBadguy = theMonsters.find(element => element.threat == 1);
    let tocontrol = theMonsters.find(element => element.threat == 1, element.DistancetoBase > 5000);
    
    for (i in myHeroes) {
        if (i == 0) {
            if (tocontrol != undefined && mybase.mana > 50) {
                myHeroes[i].controltarget = tocontrol;
            }
            else {
                myHeroes[i].controltarget = undefined;
            }
            if (myHeroes[i].controltarget != undefined)
            attack_closest(i);
        };
        if (i == 1) {
            attack_most_threatening(i);
        };
        if (i == 2) {
            attack_most_threatening(i);
        };
    }
    theMonsters.splice(0,theMonsters.length);
    console.error(waves);
    log(myHeroes);
    waves++;
}
