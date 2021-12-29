const playField = document.querySelector('#playfield');

function populate() {
    for(let i = 0; i < 100; i++) {
        const div = document.createElement('div');
        div.classList.add('square');
        playField.appendChild(div);
    }
}

let score = 0;
let level = 1;

const colors = ['red', 'green', 'blue'];

populate();