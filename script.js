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
        function move(direction, value, circle, target) {
            console.log(direction, value, circle, target);
            const movementHandle = setInterval(()=> {
                const magnitude = 1 * (value < 0 ? 1 : -1);
                const constantPosition = direction === 'left' ? 'top' : 'left';
                let position = circle.position[direction];
                if(circle.position[direction] !== target[direction]) {
                    ANIMATION_RUNNING = true;
                    if(direction === 'top')
                        circle.setPosition(position += magnitude, circle.position[constantPosition]);
                    else
                        circle.setPosition(circle.position[constantPosition], position += magnitude);
                } else {
                    ANIMATION_RUNNING = false;
                    clearInterval(movementHandle);
                }
            }, 100);
        }

        const targetA = Object.assign({}, circleA.position);
        const targetB = Object.assign({}, circleB.position);
        const horiz = circleA.position.left - circleB.position.left;
        const vert = circleA.position.top - circleB.position.top;

        console.log(horiz, vert);

        let direction = horiz !== 0 ? 'left' : 'top';
        let value = horiz !== 0 ? horiz : vert;

        move(direction, value, circleA, targetB);

        direction = direction === 'top' ? 'left' : 'top';

        move(direction, -value, circleB, targetA);
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