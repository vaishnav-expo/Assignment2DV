let tb;

let leftMargin = 120;
let topMargin = 70;
let spacing = 40;
let minValue = Number.MAX_SAFE_INTEGER;
let maxValue = 0;
let plotWidth = 900;

let airports = ["ATL","DFW","EWR","LGA","SFO"];

let months = {
    1 : "Jan",
    2 : "Feb",
    3 : "Mar",
    4 : "Apr",
    5 : "May",
    6 : "Jun",
    7 : "Jul",
    8 : "Aug",
    9 : "Sep",
    10 : "Oct",
    11 : "Nov",
    12 : "Dec"
};

let from;
let to;

function preload() {
    tb = loadTable("airlines.csv", "csv", "header");
}

let tempMap = {};

function setup(){
    createCanvas(window.innerWidth,window.innerHeight);

    //Filling map with values
    tb.rows.forEach(i => {
        if(i.obj["Time.Year"] == 2009){
            if(airports.includes(i.obj["Airport.Code"])){
                if(!(i.obj["Airport.Code"] in tempMap))
                    tempMap[i.obj["Airport.Code"]] = [];
                tempMap[i.obj["Airport.Code"]].push({[i.obj["Time.Month"]] : i.obj["Statistics.Minutes Delayed.Weather"]});
            }
        }
    });

    //To check if map is loaded properly or not
    console.log("map len = "+Object.keys(tempMap).length);

    // colour range for heat map
    from = color(255, 0, 0);
    to = color(0, 0, 0);
}

function draw() {
    background(220);
    fill(0);

    //To check if maps are accessible in the method
    const len =  Object.keys(tempMap).length;
    console.log("Length of map : "+len);
    console.log("Total months = "+Object.keys(months).length);
    console.log("Month = "+airports.length);

    //Heading
    textSize(15);
    strokeWeight(0.7);
    text("Total minutes delayed due to weather in years 2009 across 5 different cities",plotWidth/2 - 20,topMargin - 30);
    strokeWeight(1);
    textSize(12);

    let monthlyFlightsCancelled;

    Object.keys(tempMap).forEach((i, index) => {
        //calculating max value and min value of # flights cancelled possible
        tempMap[i].forEach((monthlyFlightsCancelled) => {
            monthlyFlightsCancelled = +Object.values(monthlyFlightsCancelled)[0];
            if (monthlyFlightsCancelled > maxValue){
                maxValue = monthlyFlightsCancelled;
            }
            if (monthlyFlightsCancelled < minValue){
                minValue = monthlyFlightsCancelled;
            }
        });

        // Y Axis
        fill(0);
        strokeWeight(0);
        text(i, leftMargin  + 40, index * spacing + topMargin + 22);

        console.log("min value : "+minValue);
        console.log("max value : "+maxValue);

        strokeWeight(1);
    });

    Object.keys(tempMap).forEach((i, index) => {
        tempMap[i].forEach((monthlyFlightsCancelled, index2) =>{
            let value = +Object.values(monthlyFlightsCancelled)[0];
            stroke(220);
            let c = lerpColor(from, to,  value / maxValue);
            fill(c);
            square(leftMargin + 70 + index2 * spacing, index * spacing + topMargin , 40);
        })
    });

    // Adding Months to x axis
    fill(0);
    strokeWeight(0.7);
    tempMap["ATL"].forEach((i, idx) =>{
        text(months[idx+1], idx * spacing + leftMargin + 90 , 300);
    });
    strokeWeight(1);

    // Creating Text and Linear Gradient on Right
    setGradient(plotWidth - 140, topMargin + 20, 20, 2 * spacing + 30 + topMargin , from, to);
    strokeWeight(0);
    text(minValue, 15 * spacing + leftMargin, topMargin + 30);
    text(maxValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), 15 * spacing + leftMargin, topMargin + 200);
    textAlign(CENTER);
    text("Delays", 14 * spacing + leftMargin + 40 , topMargin + 10);
    strokeWeight(1);
}

function setGradient(x, y, width, height, from, to) {
    for (let i = y; i <= y + height; i++) {
        let inter = map(i, y, y + height, 0, 1);
        let c = lerpColor(from, to, inter);
        stroke(c);
        line(x, i, x + width, i);
    }
}