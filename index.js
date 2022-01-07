/**
 * index.js
 */

//Begin Cited Code
//this line of code was copied from https://codeburst.io/creating-and-drawing-on-an-html5-canvas-using-javascript-93da75f001c1
const canvas = document.querySelector('canvas');
const can = canvas.getContext('2d');
//End cited Code
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
var projectileNum = 0;
var starty = 2;
var startx = 2;
var scale = 12;

/** Projectile list for the simulations
* @type {Projectile[]}
*/
var projectileList = [];

/** Projectile list for the calculations
* @type {Projectile[]}
*/
var projectileConsoleList = [];

/**
 * Enumeration values for the output on inline console
 */
const outputValues = {
    FINAL_DISTANCE: "Final Distance",
    MAX_HEIGHT: "Max Height",
    TIME_OF_FLIGHT: "Time of Flight",
    ALL: "All",
}

// Begin Cited Code
// https://stackoverflow.com/questions/3842614/how-do-i-call-a-javascript-function-on-page-load
function onLoadStart() {
    setInterval(animate, 0.1);
}
// End cited code

//Updtate game
function animate() {
    can.clearRect(0, 0, canvas.width, canvas.height); //https://www.youtube.com/watch?v=eI9idPTT0c4&t=1313s&ab_channel=ChrisCourses
    updateProjectiles(projectileList);
    drawField();
    drawMeasureX();
    drawMeasureY();
}

/**
 * Update alle projectiles in the list. If a projetile is still in the air (flying),
 * then it remains in the list and its data is updates (according to the time passed).
 * If the a projectile is not in the air anymore, it is removed from the list
 * @param {list of Projectile objects} projetileList the list of the projetile objects
 * @returns nothing (void function = procedure)
 */
function updateProjectiles(projetileList) {

    for (var i = 0; i < projetileList.length; i++) {
        if (projectileList[i].getCurrentTime() >= projectileList[i].timeofflight()) {
            projectileList.splice(i, i + 1);
            i--;
        } else {
            var now = Date.now();
            projetileList[i].update(now);
        }

    }
}
/**
 * The function called when the "Show Finale Distance" Button is called 
 */
function finalDistanceButton() {
    outputCalculations(projectileConsoleList, outputValues.FINAL_DISTANCE);
}
/**
 * The function called when the "Show Max Height" Button is called 
 */
function maxHeightButton() {
    outputCalculations(projectileConsoleList, outputValues.MAX_HEIGHT);
}
/**
 * The function called when the "Show Time Of Flight" Button is called 
 */
function timeOfFlightButton() {
    outputCalculations(projectileConsoleList, outputValues.TIME_OF_FLIGHT);
}
/**
 * The function called when the "Show All" Button is called 
 */
function allButton() {
    outputCalculations(projectileConsoleList, outputValues.ALL);
}
/**
 * Shows the projectile values depending on the value of the parameter outputValue  
 * @param {list of Projectile objects} projectileList 
 * @param {String} outputValue determines what calculation is shown (Output on the Inline Console), must be one of the enum values of the const "outputValues"
 */
function outputCalculations(list, outputValue) {
    toBeDeleted = [];
    for (var i = 0; i < list.length; i++) {
        output("<strong id='console'>Projectile:</strong> <span id='console' style='color:red'>"
            + list[i].projectileNum + "</span>"
            + "\n<strong>v0:</strong> " + list[i].velocity + " m/s   <strong>vx:</strong>"
            + list[list.length - 1].x_velocity.toFixed(2) + " m/s  <strong>vy:</strong>"
            + list[list.length - 1].y_velocity.toFixed(2) + " m/s"
            + "\n<strong>Angle:</strong> " + list[i].angle + "°"
            + "\n<strong>g:</strong> " + list[i].gravity + "m/s^2"
            + "\n<strong>height:</strong> " + list[i].height + "m"
        );
        switch (outputValue) {
            case outputValues.FINAL_DISTANCE:
                output("<strong>distance: </strong>" + list[i].finaldistance().toFixed(2) + "m"
                );
                break;
            case outputValues.MAX_HEIGHT:
                output("<strong>max height: </strong>" + list[i].maxheight().toFixed(2) + "m"
                );
                break;
            case outputValues.TIME_OF_FLIGHT:
                output("<strong>t</strong>: " + list[i].timeofflight().toFixed(2) + "s"
                );
                break;
            case outputValues.ALL:
                output("<strong>t</strong>: " + list[i].timeofflight().toFixed(2) + "s"
                    + "\n<strong>distance: </strong>" + list[i].finaldistance().toFixed(2) + "m"
                    + "\n<strong>max height: </strong>" + list[i].maxheight().toFixed(2) + "m"
                );
        }
    }
    list.splice(0, list.length);
}


/**
 * Draws a green field to identify the border for the projectile and measurements
 */
function drawField() {
    can.fillStyle = "rgb(218, 255, 159)";
    can.fillRect(0, (canvas.height - (starty) * scale), canvas.width, 100);
    can.fillText;
    can.fillRect(0, 0, startx * scale, canvas.height);
    can.fillText;
}

/**
 * draws the horizontal measurements in the lower part of the canvas
 */
function drawMeasureX() {
    can.font = "15px Arial";
    for (var i = startx; i < canvas.width; i += 10) {
        can.fillStyle = "black";
        can.fillRect((i * scale), (canvas.height - (starty) * scale), 2, 10);
        can.fillText(((i - 2) + "m").toString(), (i * scale) - 15, (canvas.height - (starty) * scale) + 22);
    }
}
/**
 * draws the verticle measurements on the left part of the canvas
 */
function drawMeasureY() {
    can.font = "13px Arial";
    for (var i = 0; i < canvas.height; i += 10) {
        can.fillStyle = "black";
        can.fillRect((startx * scale) - 10, (canvas.height - (starty * scale)) - i * scale, 10, 2);
        can.fillText((i + "m").toString(), 0.5, ((canvas.height - (starty * scale)) - i * scale) - 5, 30);
    }
}

/**
 * Class for the projectile
 */
class Projectile {
    /**
     * Constructor
     * @param {Number} velocity 
     * @param {Number} angleDegree 
     * @param {Number} height 
     * @param {Number} gravity 
     */
    constructor(velocity, angleDegree, height, gravity) {
        this.velocity = velocity;
        this.angle = angleDegree;
        this.height = height;
        this.initialX = 0;
        this.initialY = 0;
        this.initial_T = Date.now(); // This code is cited from https://stackoverflow.com/questions/29971898/how-to-create-an-accurate-timer-in-javascript
        this.angleRadians = this.angle * (Math.PI / 180);
        this.x_velocity = this.velocity * Math.cos(this.angleRadians);
        this.y_velocity = this.velocity * Math.sin(this.angleRadians);
        this.onScreen = true;
        this.currentTime = 0;
        this.projectileNum = projectileNum;
        this.gravity = gravity;
    }
    /**
     * Calculates the total time the projectile is in the air
     * @returns the final travel time of projectile
     */
    timeofflight() {
        return ((-this.y_velocity - Math.sqrt(this.y_velocity * this.y_velocity - 4 * (this.gravity / 2) * this.height)) / (2 * (this.gravity / 2)));
    }
    /**
     * Calculates the maximum x distance the ball traveled
     * @returns horizontal distance
     */
    finaldistance() {
        return ((this.timeofflight() * this.x_velocity));
    }
    /**
     * Calculates the the it takes for the ball to reach its maximum height
     * @returns time until maximum height
     */
    peakTime() {
        return (-this.y_velocity / this.gravity);
    }
    /**
     * Calculates the maximum distance the ball traveled in the y direction
     * @returns maximum y distance reached
     */
    maxheight() {
        return ((this.height) + (this.y_velocity * this.peakTime()) + (0.5 * (this.gravity * this.peakTime() * this.peakTime())));
    }
    /**
     * @returns the time of the ball at that moment
     */
    getCurrentTime() {
        return this.currentTime;
    }
    /**
     * Draws the a circle at that point of the canvas (draws the projectile)
     */
    drawPoint() {
        // Begin Cited Code
        // https://stackoverflow.com/questions/25095548/how-to-draw-a-circle-in-html5-canvas-using-javascript
        // https://www.youtube.com/watch?v=eI9idPTT0c4&t=1313s&ab_channel=ChrisCourses
        can.beginPath();
        can.arc(this.initialX, canvas.height - this.initialY, 3, 0, Math.PI * 2, false);
        can.fillStyle = "black";
        can.fill();
        // End Cited Code
    }

    /**
     * update
     * @param {Date} timestamp 
     */
    update(timestamp) {
        this.onScreen = false;
        // Begin Cited Code
        // https://stackoverflow.com/questions/29971898/how-to-create-an-accurate-timer-in-javascript
        var delta_T = (timestamp - this.initial_T) / 1000;
        // End Cited Code 
        this.initialX = scale * (startx + (this.x_velocity * delta_T)); // x postion
        this.initialY = scale * (starty + (this.height + (this.y_velocity * delta_T) + 0.5 * (this.gravity * delta_T * delta_T))); // y position
        this.drawPoint();
        this.currentTime = delta_T;
    }
}

// Begin cited code
//https://github.com/rwblackburn/inline-console/blob/master/src/inline-console.js

/**
 * Creates and writes in the Inline Console
 */
var InlineConsole = document.getElementById("InlineConsole");
function output(str, color = "") {
    var con = document.createElement("pre");
    con.innerHTML = str;
    con.style.backgroundColor = color;
    InlineConsole.appendChild(con);
}
/**
 * Clears the Inline Console
 */
function reset() {
    while (InlineConsole.children.length > 0) {
        InlineConsole.removeChild(InlineConsole.children[0])
    }
    projectileList = [];
    projectileConsoleList = [];
    projectileNum = 0;

}
// End Cited Code

// Begin cited code 
//https://www.w3schools.com/howto/howto_js_rangeslider.asp
//https://www.w3schools.com/howto/tryit.asp?filename=tryhow_css_js_rangeslider

//input for velocity
var velocitySlider = /** @type {HTMLInputElement} */ (document.getElementById("velocitySlider"));
var velocityOutput = document.getElementById("velocityField");
var inputvel = 10;
velocityOutput.innerHTML = velocitySlider.value; // Display the default slider value
// Update the current slider value (each time you drag the slider handle)
velocitySlider.oninput = function () {
    velocityOutput.innerHTML = velocitySlider.value;
    inputvel = Number(velocitySlider.value);
}

//input for height
var heightSlider = /** @type {HTMLInputElement} */ (document.getElementById("heightSlider"));
var heightOutput = document.getElementById("heightField");
var inputheight = 0;
heightOutput.innerHTML = heightSlider.value; // Display the default slider value
// Update the current slider value (each time you drag the slider handle)
heightSlider.oninput = function () {
    heightOutput.innerHTML = heightSlider.value;
    inputheight = Number(heightSlider.value);
}

//input for angle
var angleSlider = /** @type {HTMLInputElement} */ (document.getElementById("angleSlider"));
var angleOutput = document.getElementById("angleField");
var inputangle = 45;
angleOutput.innerHTML = angleSlider.value;  // Display the default slider value
// Update the current slider value (each time you drag the slider handle)
angleSlider.oninput = function () {
    angleOutput.innerHTML = angleSlider.value;
    inputangle = Number(angleSlider.value);
}


//input for gravity
var gravitySlider = /** @type {HTMLInputElement} */ (document.getElementById("gravitySlider"));
var gravityOutput = document.getElementById("gravityField");
var inputgravity = -9.81;
gravityOutput.innerHTML = gravitySlider.value; // Display the default slider value
// Update the current slider value (each time you drag the slider handle)
gravitySlider.oninput = function () {
    gravityOutput.innerHTML = gravitySlider.value;
    inputgravity = Number(gravitySlider.value);
}
// End Cited Code

/**
 * Function when button "Shoot" is pressed
 */
function shoot() {
    createProjectile();
}

/**
 * increments the projectile num, Creates and pushes a new Projectile into projectileList
 */
function createProjectile() {
    projectileNum++;
    projectile = new Projectile(inputvel, inputangle, inputheight, inputgravity);
    projectileList.push(projectile);
    projectileConsoleList.push(projectile);
}