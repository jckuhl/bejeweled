const playField = document.querySelector('#playfield');
const progress = document.querySelector('.progress');
const totalScoreSpan = document.querySelector('#totalScore');

const colors = ['red', 'green', 'blue', 'purple', 'yellow'];

const circles = [];

let ANIMATION_RUNNING = false;

class Circle {
    #div;

    constructor(div) {
        this.#div = div;
    }

    deselect() {
        this.#div.classList.remove('selected');
    }

    select() {
        this.#div.classList.add('selected');
    }

    get position() {
        return {
            top: parseFloat(this.#div.style.top),
            left: parseFloat(this.#div.style.left)
        }
    }

    setPosition(top, left) {
        this.#div.style.top = `${top}px`;
        this.#div.style.left = `${left}px`;
    }

    get selected() {
        return this.#div.classList.contains('selected');
    }
}

function random(x) {
    return Math.floor(Math.random() * x);
}

function populateCircles() {
    const rect = playField.getBoundingClientRect();
    let top = rect.top + 2;
    let left = rect.left + 2;
    for(let i = 0; i < 100; i++) {
        const circle = document.createElement('div');
        circle.classList.add('circle');
        circle.classList.add(colors[random(colors.length)]);
        circle.style.top = `${top}px`;
        circle.style.left = `${left}px`;
        const circleObj = new Circle(circle)
        circle.addEventListener('click', (event) => select(circleObj));
        circles.push(circleObj);
        playField.appendChild(circle);
        left += 52;
        if((i + 1) % 10 === 0) {
            top += 52;
            left = rect.left;
        }
    }
}

function select(circle) {
    if(ANIMATION_RUNNING) return;

    function deselect() {
        circles.forEach(circle => circle.deselect());
    }

    function nothingIsSelected() {
        return circles.every(circle => !circle.selected);
    }

    function isNeighbor(circle, selectedCircle) {
        const topDiff = Math.abs(circle.position.top - selectedCircle.position.top);
        const leftDiff = Math.abs(circle.position.left - selectedCircle.position.left);
        return topDiff === 52 || leftDiff === 52;
    }

    function getSelectedCircle() {
        return circles.find(circle => circle.selected);
    }

    function swap(circleA, circleB) {
        const targetA = Object.assign({}, circleA.position);
        const targetB = Object.assign({}, circleB.position);
        console.log(targetA, targetB);
        let top = circleA.position.top;
        const movementHandle = setInterval(()=> {
            if(circleA.position.top !== targetB.top) {
                ANIMATION_RUNNING = true;
                circleA.setPosition(top++, circleA.position.left);
            } else {
                ANIMATION_RUNNING = false;
                clearInterval(movementHandle);
            }
        }, 200);
    }

    if(nothingIsSelected()) {
        circle.select();
    //if neighbor is not clicked
    } else if(isNeighbor(circle, getSelectedCircle())) {
        swap(circle, getSelectedCircle());
        console.log('neighbors');
    } else {
        deselect();
        circle.select();
    }
}

populateCircles();