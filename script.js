const playField = document.querySelector('#playfield');

const colors = ['red', 'green', 'blue'];

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
    console.log(circles);
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
        return false;
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
            console.log('do cascade');
        }
    }
}



let score = 0;
let level = 1;


populate();