const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
    },
    backgroundColor: '#4a4d6b',
    scene: {
        preload: preload,
        init: init,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let texto;
const patrones = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
let celdas = [];
let posicionesX = [];
let posicionesO = [];
let movimientosX = 0;
let movimientosO = 0;
let gano = false;
let ganador = '';
let jugador1 = true, jugador2 = false;

function preload(){
    this.load.image('vacio', 'public/assets/vacio.png');
    this.load.image('x', 'public/assets/x.png');
    this.load.image('o', 'public/assets/o.png');
}
function init(){
    celdas = [];
    posicionesX = [];
    posicionesO = [];
    movimientosX = 0;
    movimientosO = 0;
    jugador1 = true;
    jugador2 = false;
    gano = false;
}
function create(){
    texto = this.add.text((this.scale.width / 2) - 32, 100, 'Turno de: Jugador 1', {color: 'black', fontWeight: 'bold'}).setOrigin(0.5);
    for(let i = 0; i < 9; i++){
        const celdaVacia = this.add.image(0, 0, 'vacio');
        celdaVacia.type = i;
        celdaVacia.setInteractive();
        celdas.push(celdaVacia);

        celdaVacia.on('pointerdown', ()=>{
            if(jugador1){
                celdaVacia.setTexture('x');
                celdaVacia.disableInteractive();
                posicionesX.push(celdaVacia.type);
                movimientosX++;

                gano = verificarGanador(this, posicionesX, 'Jugador 1');
                if(!gano){
                    jugador1 = false;
                    jugador2 = true;
                    texto.setText('Turno de: Jugador 2')
                }
            }else if(jugador2){
                celdaVacia.setTexture('o');
                celdaVacia.disableInteractive();
                posicionesO.push(celdaVacia.type);
                movimientosO++;
                
                gano = verificarGanador(this, posicionesO, 'Jugador 2');
                if(!gano){
                    jugador1 = true;
                    jugador2 = false;
                    texto.setText('Turno de: Jugador 1')
                }
            }

            
        })
    }

    Phaser.Actions.GridAlign(celdas, {
        width: 3,
        height: 3,
        cellWidth: 64,
        cellHeight: 64,
        x: (this.scale.width - (3 * 64)) / 2,
        y: (this.scale.height - (3 * 64)) / 2,
    });
}

function verificarGanador(scene, posiciones, jugador = "Jugador 1"){
    const gano = patrones.some(patron => patron.every(pos => posiciones.includes(pos)));
    if(gano){
       
        celdas.forEach(cel => {
            cel.disableInteractive();
            cel.setAlpha(.5);
        })
        movimientosX = 0;
        movimientosO = 0;
        ganador = jugador;
        setTimeout(()=>{
            posicionesX.forEach(pos => celdas[pos].setTexture('vacio'));
            scene.scene.restart();
        }, 3000)
    }
    return gano;
}

function update(){
    if((movimientosX === 5 && movimientosO === 4) || (movimientosX === 4 && movimientosO === 5)){
        texto.setText(`Empate!👾`);
        celdas.forEach(cel => {
            cel.disableInteractive();
            cel.setAlpha(.5);
        } )
        setTimeout(()=>this.scene.restart(), 3000);
    }
    if(gano){
        texto.setText(`Ganador: ${ganador} 🏆🥇`);
        gano = false;
    }
}