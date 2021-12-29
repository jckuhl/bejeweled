const playField = document.querySelector('#playfield');
const progress = document.querySelector('.progress');
const totalScoreSpan = document.querySelector('#totalScore');

const colors = ['red', 'green', 'blue', 'purple', 'yellow'];

const circles = [];

function random(x) {
    return Math.floor(Math.random() * x);
}

class Circle {
    constructor(position, div, color, type) {
        this.position = position;
        this.color = color;
        this.div = div;
        this.type = type ?? Type.NORMAL;
    }
}

const Type = {
    NORMAL: 1,
    SUPERCUBE: 2, //Matching 5
    HYPERCUBE: 3, //Matching 5 up AND 5 across
    SUPERHYPERCUBE: 4
}

function cascade() {
    return 10;
}

function populate() {
    for(let i = 0; i < 100; i++) {
        const div = document.createElement('div');
        div.classList.add('square');
        const index = random(colors.length);
        const circle = document.createElement('div');
        circle.classList.add('circle');
        circle.classList.add(colors[index]);
        const c = new Circle(i, circle, colors[index]);
        circle.addEventListener('click', (event) => select(event, c));
        circles.push(c);
        div.appendChild(circle);
        playField.appendChild(div);
    }
    cascade();
}



function select(event, circle) {

    function deselect() {
        circles.forEach(c => {
            c.div.classList.remove('selected');
        });
    }

    function ifNothingIsSelected() {
        return circles.every(c => !c.div.classList.contains('selected'))
    }

    function swap(circleA, circleB) {
        const temp = Object.assign({},circleA);
        circleA.position = circleB.position;
        circleA.div.classList.remove(circleA.color);
        circleA.color = circleB.color;
        circleA.div.classList.add(circleB.color);
        circleB.position = temp.position;
        circleB.div.classList.remove(circleB.color);
        circleB.color = temp.color;
        circleB.div.classList.add(temp.color);
    }

    function isNeighbor(circleA, circleB) {
        
        const adjacentSquareFuncs = {
            LEFT: (circle) => circle.position - 1,
            RIGHT: (circle) => circle.position + 1,
            UP: (circle) => circle.position - 10,
            DOWN: (circle) => circle.position + 10
        }

        let adjacentSquaresEntries = Object.entries(adjacentSquareFuncs)

        if(circleA.position % 10 === 0)
            adjacentSquaresEntries = adjacentSquaresEntries.filter(([k, v])=> k !== 'LEFT');
        if((circleA.position + 1) % 10 == 0)
            adjacentSquaresEntries = adjacentSquaresEntries.filter(([k, v])=> k !== 'RIGHT');
        if(circleA.position >= 0 && circleA.position <= 9)
            adjacentSquaresEntries = adjacentSquaresEntries.filter(([k, v])=> k !== 'UP');
        if(circleA.position >= 90 && circleA.position <= 99)
            adjacentSquaresEntries = adjacentSquaresEntries.filter(([k, v])=> k !== 'DOWN');

        for(let [direction, func] of adjacentSquaresEntries) {
            if(func(circleA) === circleB.position)
                return true;
        }
        return false;
    }

    function match(circle) {
        return true;
    }

    //if nothing is selected
    if(ifNothingIsSelected()) {
        circle.div.classList.add('selected');
    } else {
        const selected = circles.find(c => c.div.classList.contains('selected'));

        //if selected is not neighbor
        if(!isNeighbor(circle, selected)) {
            deselect();
            circle.div.classList.add('selected');
            console.log('select ' + circle.position);
        //if selected is neighbor
        } else {
            swap(circle, selected);
            if(match(circle)) {
                console.log('do cascade');
                let points = cascade();
                score(points);
            } else {
                swap(circle, selected);
                console.log('swap back');
            }
            deselect();
        }
    }
}

function score(points) {
    totalScore += points;
    totalScoreSpan.innerHTML = totalScore;
    currentScore += points;
    let percent = (currentScore / levelScore) * 100
    progress.style.width = `${percent}%`;
    if(percent >= 100) {
        console.log('levelTransition()');
        progress.style.width = '0%';
        currentScore = 0;
        currentLevel += 1;
        levelScore = calculateLevelScore(currentLevel);
    }
}

let totalScore = 0;
let currentScore = 0;
let currentLevel = 1;
let levelScore = calculateLevelScore();

function calculateLevelScore(level) {
    return 100 * level;
}

populate();