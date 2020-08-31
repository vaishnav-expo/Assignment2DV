let tb;

let leftMargin = 120;
let topMargin = 70;
let plotWidth = window.innerWidth - 2 * leftMargin;
let plotHeight = window.innerHeight - topMargin - 90;
let barWidth = 40;

function preload() {
    tb = loadTable("https://bl.ocks.org/vaishnav-expo/raw/6ee54f749470b087662a7d63e3a7ca99/airlines.csv", "csv", "header");
}

let tempMap = {};

function setup(){
    createCanvas(window.innerWidth,window.innerHeight);

    tb.rows.forEach(i => {
        if(!(i.obj["Time.Year"] in tempMap)){
            tempMap[i.obj["Time.Year"]] = 0;
        }
        tempMap[i.obj["Time.Year"]] += +(i.obj["Statistics.Flights.Total"]);
    });

    //To check if map is successfully loaded or not
    console.log("len = "+Object.keys(tempMap).length);
}

function draw() {
    background(220);
    fill(0);
    const len =  Object.keys(tempMap).length;

    //To check if map is accessible or not
    console.log("len = "+len);

    //Heading of the plot
    textSize(25);
    text("Number of flights in years 2003-2016",plotWidth/2+200,topMargin);
    textSize(12);

    // plotting x-axis
    line(leftMargin,topMargin + plotHeight, plotWidth + 60, topMargin + plotHeight);

    line(plotWidth + 50, topMargin + plotHeight - 10, plotWidth + 60, topMargin + plotHeight);
    line(plotWidth + 50, topMargin + plotHeight + 10, plotWidth + 60, topMargin + plotHeight)

    // plotting y-axis
    line(leftMargin, topMargin + plotHeight, leftMargin, topMargin);

    line(leftMargin - 10, topMargin + 10, leftMargin, topMargin);
    line(leftMargin + 10, topMargin + 10, leftMargin, topMargin);

    // plotting x - axis labels
    textAlign(LEFT);
    textSize(20);
    text("Duration (in Years)",plotWidth/2,topMargin+plotHeight+70);
    textSize(12);

    let fixedBarWidth = window.innerWidth / 1000;
    const hztSpacing = plotWidth / len - 10;
    Object.keys(tempMap).forEach((i, index) =>
        text(i, index * hztSpacing + 30 + (fixedBarWidth * 10) + leftMargin, topMargin + plotHeight + 30)
    );

    // plotting y - axis labels
    angleMode(DEGREES);
    rotate(270);
    textAlign(CENTER);
    textSize(20);
    text("Number of flights",-(topMargin + plotHeight/2),leftMargin - 70);
    textSize(12);
    rotate(90);

    let extraPixelsyaxis = 5;
    let minValYaxis = topMargin + plotHeight - extraPixelsyaxis;
    let verSpacing = plotHeight / 13;

    // Y axis label values according to scale
    textAlign(RIGHT);
    text("0K", leftMargin - 25, minValYaxis + 5);
    for(i = 1; i < 13; i++){
        if(i == 1)
            text(5*i+"00K", leftMargin - 25, minValYaxis - (verSpacing * i) + 5);
        else
            text((5*i)/10+"M", leftMargin - 25, minValYaxis - (verSpacing * i) + 5);
        line(leftMargin - 5, minValYaxis - (verSpacing * i ) , leftMargin + 5, minValYaxis - (verSpacing * i ) );
    }

    // plotting bars according to the values
    Object.values(tempMap).forEach((i, index) => {
        fill(134, 231, 250);
        rect(index * hztSpacing + leftMargin + 30, topMargin + plotHeight - extraPixelsyaxis - (i/500000 * verSpacing),barWidth*fixedBarWidth, (i/500000 * verSpacing)+extraPixelsyaxis);
    })
}