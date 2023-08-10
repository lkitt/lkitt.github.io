var earningsTableInitialized = false;
var benefitsTableInitialized = false;

const firstCut = 1115;
const secondCut = 6721;
var lastAWIYear = 0;
var birthDate;
var monthMultiplier = 12;
var earningsHistory = new Map();
var minSS = 1000000;
var maxSS = 0;
var lastYear = 0;
var sortedKeys;
var medicareMap = new Map();
var ficaMap = new Map();
var adjustedFicaMap = new Map();
var predictedFicaMap = new Map();
var totalTaxesPaid = 0;

const formatter7 = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 7,
 });

// https://www.minneapolisfed.org/about-us/monetary-policy/inflation-calculator/consumer-price-index-1913-
const inflationMap = new Map([
    [1935,2.6], [1936,1.0], [1937,3.7], [1938,-2.0], [1939,-1.3],
    [1940,0.7], [1941,5.1], [1942,10.9], [1943,6.0], [1944,1.6], [1945,2.3], [1946,8.5], [1947,14.4], [1948,7.7], [1949,-1.0],
    [1950,1.1], [1951,7.9], [1952,2.3], [1953,0.8], [1954,0.3], [1955,-0.3], [1956,1.5], [1957,3.3], [1958,2.7], [1959,1.1], 
    [1960,1.5], [1961,1.1], [1962,1.2], [1963,1.2], [1964,1.3], [1965,1.6], [1966,3.0], [1967,2.8], [1968,4.3], [1969,5.5], 
    [1970,5.8], [1971,4.3], [1972,3.3], [1973,6.2], [1974,11.1], [1975,9.1], [1976,5.7], [1977,6.5], [1978,7.6], [1979,11.3], 
    [1980,13.5], [1981,10.3], [1982,6.1], [1983,3.2], [1984,4.3], [1985,3.5], [1986,1.9], [1987,3.7], [1988,4.1], [1989,4.8], 
    [1990,5.4], [1991,4.2], [1992,3.0], [1993,3.0], [1994,2.6], [1995,2.8], [1996,2.9], [1997,2.3], [1998,1.6], [1999,2.2], 
    [2000,3.4], [2001,2.8], [2002,1.6], [2003,2.3], [2004,2.7], [2005,3.4], [2006,3.2], [2007,2.9], [2008,3.8], [2009,-0.4], 
    [2010,1.6], [2011,3.2], [2012,2.1], [2013,1.5], [2014,1.6], [2015,0.1], [2016,1.3], [2017,2.1], [2018,2.4], [2019,1.8], 
    [2020,1.2], [2021,4.7], [2022,8.0],
]);

// https://www.ssa.gov/oact/cola/AWI.html
const averageWage = new Map([
    [1951,2799.16], [1952,2973.32], [1953,3139.44], [1954,3155.64], [1955,3301.44], [1956,3532.36], [1957,3641.72], [1958,3673.80], [1959,3855.80],
    [1960,4007.12], [1961,4086.76], [1962,4291.40], [1963,4396.64], [1964,4576.32], [1965,4658.72], [1966,4938.36], [1967,5213.44], [1968,5571.76], [1969,5893.76],
    [1970,6186.24], [1971,6497.08], [1972,7133.80], [1973,7580.16], [1974,8030.76], [1975,8630.92], [1976,9226.48], [1977,9779.44], [1978,10556.03], [1979,11479.46],
    [1980,12513.46], [1981,13773.10], [1982,14531.34], [1983,15239.24], [1984,16135.07], [1985,16822.51], [1986,17321.82], [1987,18426.51], [1988,19334.04], [1989,20099.55],
    [1990,21027.98], [1991,21811.60], [1992,22935.42], [1993,23132.67], [1994,23753.53], [1995,24705.66], [1996,25913.90], [1997,27426.00], [1998,28861.44], [1999,30469.84],
    [2000,32154.82], [2001,32921.92], [2002,33252.09], [2003,34064.95], [2004,35648.55], [2005,36952.94], [2006,38651.41], [2007,40405.48], [2008,41334.97], [2009,40711.61],
    [2010,41673.83], [2011,42979.61], [2012,44321.67], [2013,44888.16], [2014,46481.52], [2015,48098.63], [2016,48642.15], [2017,50321.89], [2018,52145.80], [2019,54099.99],
    [2020,55628.60], [2021,60575.07], [2022,60575.07],
]);

  
// https://www.ssa.gov/oact/cola/cbb.html
const maxTaxedIncome = new Map([
    [1937,3000], [1938,3000], [1939,3000],
    [1940,3000], [1941,3000], [1942,3000], [1943,3000], [1944,3000], [1945,3000], [1946,3000], [1947,3000], [1948,3000], [1949,3000],
    [1950,3000], [1951,3600], [1952,3600], [1953,3600], [1954,3600], [1955,4200], [1956,4200], [1957,4200], [1958,4200], [1959,4800],
    [1960,4800], [1961,4800], [1962,4800], [1963,4800], [1964,4800], [1965,4800], [1966,6600], [1967,6600], [1968,7800], [1969,7800],
    [1970,7800], [1971,7800], [1972,9000], [1972,9000], [1973,10800], [1974,13200], [1975,14100], [1976,15300], [1977,16500], [1978,17700], [1979,22900],
    [1980,25900], [1981,29700], [1982,32400], [1983,35700], [1984,37800], [1985,39600], [1986,42000], [1987,43800], [1988,45000], [1989,48000],
    [1990,51300], [1991,53400], [1992,55500], [1993,57600], [1994,60600], [1995,61200], [1996,62700], [1997,65400], [1998,68400], [1999,72600],
    [2000,76200], [2001,80400], [2002,84900], [2003,87000], [2004,87900], [2005,90000], [2006,94200], [2007,97500], [2008,102000], [2009,106800],
    [2010,106800], [2011,106800], [2012,110100], [2013,113700], [2014,117000], [2015,118500], [2016,118500], [2017,127200], [2018,128400], [2019,132900],
    [2020,137700], [2021,142800], [2022,147000], [2023,160200], [2024,160200],
]);

// https://www.ssa.gov/oact/STATS/table4c6.html
// exact age, male death probability (a), male num lives (b), male life expectancy, female death probability (a), female num lives (b), female life expectancy,
// a) Probability of dying within one year.
// b) Number of survivors out of 100,000 born alive.
const lifeExpectancy = [
    [0,0.005837,100000,74.12,0.004907,100000,79.78],
    [1,0.000410,99416,73.55,0.000316,99509,79.17],
    [2,0.000254,99376,72.58,0.000196,99478,78.19],
    [3,0.000207,99350,71.60,0.000160,99458,77.21],
    [4,0.000167,99330,70.62,0.000129,99442,76.22],
    [5,0.000141,99313,69.63,0.000109,99430,75.23],
    [6,0.000123,99299,68.64,0.000100,99419,74.24],
    [7,0.000113,99287,67.65,0.000096,99409,73.25],
    [8,0.000108,99276,66.65,0.000092,99399,72.25],
    [9,0.000114,99265,65.66,0.000089,99390,71.26],
    [10,0.000127,99254,64.67,0.000092,99381,70.27],
    [11,0.000146,99241,63.68,0.000104,99372,69.27],
    [12,0.000174,99227,62.69,0.000123,99362,68.28],
    [13,0.000228,99209,61.70,0.000145,99349,67.29],
    [14,0.000312,99187,60.71,0.000173,99335,66.30],
    [15,0.000435,99156,59.73,0.000210,99318,65.31],
    [16,0.000604,99113,58.76,0.000257,99297,64.32],
    [17,0.000814,99053,57.79,0.000314,99271,63.34],
    [18,0.001051,98972,56.84,0.000384,99240,62.36],
    [19,0.001250,98868,55.90,0.000440,99202,61.38],
    [20,0.001398,98745,54.97,0.000485,99159,60.41],
    [21,0.001524,98607,54.04,0.000533,99111,59.44],
    [22,0.001612,98456,53.12,0.000574,99058,58.47],
    [23,0.001682,98298,52.21,0.000617,99001,57.50],
    [24,0.001747,98132,51.30,0.000655,98940,56.54],
    [25,0.001812,97961,50.39,0.000700,98875,55.58],
    [26,0.001884,97783,49.48,0.000743,98806,54.61],
    [27,0.001974,97599,48.57,0.000796,98732,53.66],
    [28,0.002070,97406,47.66,0.000851,98654,52.70],
    [29,0.002172,97205,46.76,0.000914,98570,51.74],
    [30,0.002275,96994,45.86,0.000976,98480,50.79],
    [31,0.002368,96773,44.97,0.001041,98383,49.84],
    [32,0.002441,96544,44.07,0.001118,98281,48.89],
    [33,0.002517,96308,43.18,0.001186,98171,47.94],
    [34,0.002590,96066,42.29,0.001241,98055,47.00],
    [35,0.002673,95817,41.39,0.001306,97933,46.06],
    [36,0.002791,95561,40.50,0.001386,97805,45.12],
    [37,0.002923,95294,39.62,0.001472,97670,44.18],
    [38,0.003054,95016,38.73,0.001549,97526,43.24],
    [39,0.003207,94725,37.85,0.001637,97375,42.31],
    [40,0.003333,94422,36.97,0.001735,97215,41.38],
    [41,0.003464,94107,36.09,0.001850,97047,40.45],
    [42,0.003587,93781,35.21,0.001950,96867,39.52],
    [43,0.003735,93445,34.34,0.002072,96678,38.60],
    [44,0.003911,93096,33.46,0.002217,96478,37.68],
    [45,0.004137,92732,32.59,0.002383,96264,36.76],
    [46,0.004452,92348,31.73,0.002573,96035,35.85],
    [47,0.004823,91937,30.87,0.002777,95788,34.94],
    [48,0.005214,91493,30.01,0.002984,95522,34.04],
    [49,0.005594,91016,29.17,0.003210,95237,33.14],
    [50,0.005998,90507,28.33,0.003476,94931,32.24],
    [51,0.006500,89964,27.50,0.003793,94601,31.35],
    [52,0.007081,89380,26.67,0.004136,94242,30.47],
    [53,0.007711,88747,25.86,0.004495,93852,29.59],
    [54,0.008394,88062,25.06,0.004870,93430,28.72],
    [55,0.009109,87323,24.27,0.005261,92975,27.86],
    [56,0.009881,86528,23.48,0.005714,92486,27.01],
    [57,0.010687,85673,22.71,0.006227,91958,26.16],
    [58,0.011566,84757,21.95,0.006752,91385,25.32],
    [59,0.012497,83777,21.21,0.007327,90768,24.49],
    [60,0.013485,82730,20.47,0.007926,90103,23.67],
    [61,0.014595,81614,19.74,0.008544,89389,22.85],
    [62,0.015702,80423,19.03,0.009173,88625,22.04],
    [63,0.016836,79160,18.32,0.009841,87812,21.24],
    [64,0.017908,77828,17.63,0.010529,86948,20.45],
    [65,0.018943,76434,16.94,0.011265,86032,19.66],
    [66,0.020103,74986,16.26,0.012069,85063,18.88],
    [67,0.021345,73479,15.58,0.012988,84037,18.10],
    [68,0.022750,71910,14.91,0.014032,82945,17.34],
    [69,0.024325,70274,14.24,0.015217,81781,16.58],
    [70,0.026137,68565,13.59,0.016634,80537,15.82],
    [71,0.028125,66773,12.94,0.018294,79197,15.08],
    [72,0.030438,64895,12.30,0.020175,77748,14.36],
    [73,0.033249,62919,11.67,0.022321,76180,13.64],
    [74,0.036975,60827,11.05,0.025030,74479,12.94],
    [75,0.040633,58578,10.46,0.027715,72615,12.26],
    [76,0.044710,56198,9.88,0.030631,70603,11.60],
    [77,0.049152,53685,9.32,0.033900,68440,10.95],
    [78,0.054265,51047,8.77,0.037831,66120,10.31],
    [79,0.059658,48277,8.25,0.042249,63618,9.70],
    [80,0.065568,45397,7.74,0.047148,60931,9.10],
    [81,0.072130,42420,7.25,0.052545,58058,8.53],
    [82,0.079691,39360,6.77,0.058685,55007,7.98],
    [83,0.088578,36224,6.31,0.065807,51779,7.44],
    [84,0.098388,33015,5.88,0.074052,48372,6.93],
    [85,0.109139,29767,5.47,0.083403,44790,6.44],
    [86,0.120765,26518,5.07,0.093798,41054,5.99],
    [87,0.133763,23316,4.70,0.104958,37203,5.55],
    [88,0.148370,20197,4.35,0.117435,33299,5.15],
    [89,0.164535,17200,4.02,0.131540,29388,4.76],
    [90,0.182632,14370,3.72,0.146985,25522,4.41],
    [91,0.202773,11746,3.44,0.163592,21771,4.08],
    [92,0.223707,9364,3.18,0.181562,18209,3.78],
    [93,0.245124,7269,2.96,0.200724,14903,3.51],
    [94,0.266933,5487,2.75,0.219958,11912,3.27],
    [95,0.288602,4023,2.57,0.239460,9292,3.05],
    [96,0.309781,2862,2.42,0.258975,7067,2.85],
    [97,0.330099,1975,2.28,0.278225,5237,2.68],
    [98,0.349177,1323,2.15,0.296912,3780,2.52],
    [99,0.366635,861,2.04,0.314727,2657,2.37],
    [100,0.384967,545,1.93,0.333610,1821,2.23],
    [101,0.404215,335,1.83,0.353627,1214,2.09],
    [102,0.424426,200,1.73,0.374844,784,1.96],
    [103,0.445648,115,1.63,0.397335,490,1.84],
    [104,0.467930,64,1.54,0.421175,296,1.72],
    [105,0.491326,34,1.45,0.446446,171,1.61],
    [106,0.515893,17,1.36,0.473232,95,1.50],
    [107,0.541687,8,1.28,0.501626,50,1.40],
    [108,0.568772,4,1.20,0.531724,25,1.30],
    [109,0.597210,2,1.13,0.563627,12,1.21],
    [110,0.627071,1,1.05,0.597445,5,1.12],
    [111,0.658424,0,0.98,0.633292,2,1.03],
    [112,0.691346,0,0.92,0.671289,1,0.95],
    [113,0.725913,0,0.85,0.711567,0,0.88],
    [114,0.762209,0,0.79,0.754261,0,0.80],
    [115,0.800319,0,0.74,0.799516,0,0.74],
    [116,0.840335,0,0.68,0.840335,0,0.68],
    [117,0.882352,0,0.63,0.882352,0,0.63],
    [118,0.926469,0,0.58,0.926469,0,0.58],
    [119,0.972793,0,0.53,0.972793,0,0.53],
];

class YearInfo {
    constructor(year, fica, medicare) {
        this.year = year;
        this.fica = fica;
        this.medicare = medicare;
        this.adjMed = medicare;
        this.rank = 1;

        // The wage index is 1 from age 60 and later
        var wageIndex = 1;
        let curAverageWage = averageWage.get(year);

        // If the year is less than two years ago, we can calculate the wage index
        if ( year <= new Date().getFullYear() - 2 )
        {
            let finalAverageWage = averageWage.get(lastAWIYear);
            wageIndex = finalAverageWage / curAverageWage;
        }
        this.wageIndex = wageIndex;
        this.ficaAdjusted = wageIndex * fica;
        if ( year > lastYear ) lastYear = year;

    }

    setAdjustedMedicare(adjMed) {
        this.adjMed = adjMed;
    }

    setRank(rank) {
        this.rank = rank;
    }
}

function init()
{
    // Implement the accordian feature
    var acc = document.getElementsByClassName("accordion");
    var i;

    for (i = 0; i < acc.length; i++)
    {
        acc[i].addEventListener("click", function()
        {
            this.classList.toggle("active");
            var panel = this.nextElementSibling;
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    }

    // Enable the checkboxes
    $( ".checkbox" ).checkboxradio();


    $('input:checkbox').change(
        function()
        {
            createEarningsTable();
       }
    );
}

// Gets a map of estimated benefits by age for the given AIME
function getEstimatedBenefits(aime)
{
    // See https://www.ssa.gov/oact/quickcalc/early_late.html#calculator

    // In the case of early retirement, a benefit is reduced 5/9 of one percent for each month before normal retirement age,
    // up to 36 months. If the number of months exceeds 36, then the benefit is further reduced 5/12 of one percent per month.
    // 59 months early = 70.42 percent
    // 48 months early = 75%
    // 36 months early = 80%
    // 24 months early = 86.67%
    // 12 months early = 93.33%
    // 12 months late = 108%
    // 24 months late = 116%
    // 36 months late = 124%
    // Delayed retirement is 8.0% extra per year

    bensMap = new Map();

    let total = 0;
    if ( aime > firstCut)
    {
        // Exceeds firstCut, so start with 90% of first cut.
        total = 0.9 * firstCut;
        if ( aime > secondCut )
        {
            if ( aime > secondCut )
            {
                // Greater than second cut, so set total to 32% of amount between first and second cuts, and 15% of remaining
                total += (secondCut - firstCut) * .32;
                total += (aime - secondCut) * .15;
            }
            else
            {
                // More then first, but less than second.  Substract first from aime and multiply by 32%
                total += (aime - firstCut) * .32;
            }
        }
        else
        {
            // Greater than first, but less than second.
            total += (aime - firstCut) * .32;
        }
    }
    else
    {
        // Less than first cut, so just multiply by 90%
        total = 0.9 * aime;
    }

    bensMap.set(62, total * .7042);
    bensMap.set(63, total * .75);
    bensMap.set(64, total * .80);
    bensMap.set(65, total * .866667);
    bensMap.set(66, total * .933333);
    bensMap.set(67, total);
    bensMap.set(68, total * 1.08);
    bensMap.set(69, total * 1.16);
    bensMap.set(70, total * 1.24);

    return bensMap;
}

function addRowToBenefitsTable(benefitsTable, age, lastIncome, sortedFica)
{
    // Sum the sortedFica array
    const sum = sortedFica.reduce((partialSum, a) => partialSum + a, 0);

    // Divide by 35 years and 12 months to get the average indexed monthly earnings 
    let aime = Math.floor( sum / 35 / 12 );

    // Get the benefits for each starting year for receiving benefits
    let benefits = getEstimatedBenefits(aime);

    // Add row to the table
    var row = document.createElement("TR");
    benefitsTable.appendChild(row);

    // Add the row header
    var td = document.createElement("TH");
    let year = birthDate.getFullYear() + age;
    row.setAttribute("year", year);
    var cell = document.createTextNode(year);
    td.appendChild(cell);
    row.appendChild(td);

    // Create the age cell
    td = document.createElement("TH");
    cell = document.createTextNode(age);
    td.appendChild(cell);
    row.appendChild(td);

    // Create the estimated fica cell
    td = document.createElement("TH");
    let span = document.createElement("SPAN");
    span.appendChild(document.createTextNode("$"));
    td.appendChild(span);
    var inputCell = document.createElement("INPUT");
    inputCell.classList.add("estimatedFICA");
    inputCell.setAttribute("type", "number");
    inputCell.setAttribute("value", Math.trunc(lastIncome));
    inputCell.setAttribute("maxLength", 6);
    inputCell.setAttribute("max", maxTaxedIncome.get(lastYear));
    inputCell.setAttribute("year", year);

    // Listen to changes in this cell
    inputCell.addEventListener("change", estimateChanged);
    // Listen to clicks in this cell
    inputCell.addEventListener("click", estimateClicked);

    td.appendChild(inputCell);
    row.appendChild(td);

    const colorScale = new Map([[0,"color0"], [1,"color1"], [2,"color2"], [3,"color3"], [4,"color4"],[5,"color5"], [6,"color6"],]);
    
    for (let [claimedAge, value] of benefits)
    {
        // Create the benefits cell
        td = document.createElement("TD");
        let yearly = Math.floor(value) * monthMultiplier;
        td.setAttribute("benefit", yearly);
        let footnoteMarker = "";
        if ( age >= claimedAge && age < 67 )
            footnoteMarker = "*";
        cell = document.createTextNode(yearly.toLocaleString("en-US", {style:"currency", currency:"USD", maximumFractionDigits:"0"}) + footnoteMarker);

        let yearlyDecile = Math.floor((value * 12) / 10000);
        td.classList.add(colorScale.get(yearlyDecile));
        td.appendChild(cell);
        row.appendChild(td);


        if ( yearly < minSS ) minSS = yearly;
        if ( yearly > maxSS ) maxSS = yearly;
    }
    
    let minClaimAge = 62;
    let currentAge = new Date().getFullYear() - birthDate.getFullYear();
    if ( currentAge > 62 )
    {
        minClaimAge = currentAge;
        minSS = Math.floor((benefits.get(minClaimAge) * 12));
    }
    document.getElementById("claimAge").innerHTML = minClaimAge;
    document.getElementById("minSS").innerHTML = minSS.toLocaleString("en-US", {style:"currency", currency:"USD", maximumFractionDigits:"0"});
    document.getElementById("lastYear").innerHTML = earningsHistory.get(lastYear).ficaAdjusted.toLocaleString("en-US", {style:"currency", currency:"USD", maximumFractionDigits:"0"});
    document.getElementById("maxSS").innerHTML = maxSS.toLocaleString("en-US", {style:"currency", currency:"USD", maximumFractionDigits:"0"});
}

function estimateChanged(e) {
    let newFicaMap = new Map(adjustedFicaMap)
    let estimates = document.getElementsByClassName("estimatedFICA");
    for (let i = 0; i < estimates.length; i++)
    {
        newFicaMap.set(Number(estimates[i].getAttribute("year")), Number(estimates[i].value));
        predictedFicaMap.set(Number(estimates[i].getAttribute("year")), Number(estimates[i].value));
    }
    let sortedFica = new Map([...newFicaMap.entries()].sort((a, b) => b[1] - a[1]));
    addEstimatedBenefitsTable(sortedFica);
}

function estimateClicked(e) {
    e.currentTarget.focus();
    e.currentTarget.select();
}

// Add the table that esimtates earnings based on current and future earnings
function addEstimatedBenefitsTable(sortedFica)
{
    // Trim the sortedFica map until it has no more than 35 entries
    while ( sortedFica.size > 35 )
    {
        let lastYearIdx = [...sortedFica][sortedFica.size-1][0];
        sortedFica.delete(lastYearIdx);
    }
    let curYear = new Date().getFullYear();
    let testYear = curYear - 1;
    while ( ! sortedFica.has(testYear) )
        testYear--;
    let lastIncome = sortedFica.get(testYear);
    let top35Incomes = Array.from(sortedFica.values());
    top35Incomes.sort(function(a, b){return a - b});
    let curAge = curYear - birthDate.getFullYear();

    let benefitsTable = document.getElementById("estimatedBenefits");

    // Destroy the datatable if it exists
    if ( benefitsTableInitialized === true )
    {
        $('#estimatedBenefits').DataTable().clear();
        $('#estimatedBenefits').DataTable().destroy();
        $('#estimatedBenefits').find('thead tr th').remove();
    }
    benefitsTable.innerHTML = "";

    let caption = benefitsTable.createCaption();
    caption.textContent = "Estimated benefits based on Age Clamied by Last Working Year/Age (Assuming future FICA earnings as shown below)";
    var tableBody = document.createElement("TBODY");
    benefitsTable.appendChild(tableBody);

    // Create the column headers
    var header = document.createElement("THEAD");
    benefitsTable.appendChild(header);

    var topRow = document.createElement("TR");
    header.appendChild(topRow);

    var th = document.createElement("TH");
    cell = document.createTextNode("Last Worked");
    th.appendChild(cell);
    th.colSpan = "3";
    topRow.appendChild(th);

    var secondRow = document.createElement("TR");

    th = document.createElement("TH");
    cell = document.createTextNode("Year");
    th.appendChild(cell);
    secondRow.appendChild(th);

    th = document.createElement("TH");
    cell = document.createTextNode("Age");
    th.appendChild(cell);
    secondRow.appendChild(th);

    th = document.createElement("TH");
    cell = document.createTextNode("Estimated FICA Earnings");
    th.appendChild(cell);
    secondRow.appendChild(th);

    th = document.createElement("TH");
    cell = document.createTextNode("Age Social Security First Claimed");
    th.colSpan = "9";
    th.appendChild(cell);
    topRow.appendChild(th);

    header.appendChild(secondRow);

    // Iterate over every age from 62 to 70
    for (let claimedAge = 62; claimedAge <= 70; claimedAge++)
    {
        th = document.createElement("TH");
        th.setAttribute("claimedAge", claimedAge);
        cell = document.createTextNode(claimedAge);
        th.appendChild(cell);
        secondRow.appendChild(th);
    }

    // Iterate until age 70
    for ( age = curAge; age <= 70; age++)
    {
        let year = age + birthDate.getFullYear();
        let curIncome = lastIncome;
        if ( predictedFicaMap.has(year) )
            curIncome = predictedFicaMap.get(year);
        addRowToBenefitsTable(tableBody, age, curIncome, top35Incomes);

        if ( top35Incomes.length < 25 )
            top35Incomes.push(lastIncome);
        else
        {
            // Use last year's income as this year's income, if it is larger
            if ( top35Incomes[0] < lastIncome )
                top35Incomes[0] = lastIncome;
        }
        top35Incomes.sort(function(a, b){return a - b});
    }

    // Create a footnote for the table
    var footer = benefitsTable.createTFoot();
    var footRow = footer.insertRow(0);
    td = document.createElement("TD");
    cell = document.createTextNode("* Note benefits may be reduced if you continue to work after claiming Social Security and before full retirement age.");
    td.colSpan = "12";
    td.appendChild(cell);
    footRow.appendChild(td);

    var bTable = $('#estimatedBenefits').DataTable({
        dom: 'Bfrtip',
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ],
        bAutoWidth: false,
        bPaginate: false,
        searching: false,
        ordering: false,
        info: false,
        fixedHeader: true,
        scrollCollapse: true,
        paging:         false,
    });

    benefitsTableInitialized = true;

    var rows = document.querySelectorAll("#estimatedBenefits tr");

    for (var row of rows) {
        row.addEventListener('click', rowClicked)
    }

    function drawCumulativeLineChart(benAmounts, year)
    {
        google.charts.load('current', {'packages':['line']});
        google.charts.setOnLoadCallback(drawLineChart);

        function drawLineChart()
        {
            var data = new google.visualization.DataTable();
            data.addColumn('number', 'Claim Age');
            data.addColumn('number', 'Claimed at 62');
            data.addColumn('number', 'Claimed at 63');
            data.addColumn('number', 'Claimed at 64');
            data.addColumn('number', 'Claimed at 65');
            data.addColumn('number', 'Claimed at 66');
            data.addColumn('number', 'Claimed at 67');
            data.addColumn('number', 'Claimed at 68');
            data.addColumn('number', 'Claimed at 69');
            data.addColumn('number', 'Claimed at 70');
            data.addColumn('number', 'Taxes Paid');

            let firstYear = birthDate.getFullYear() + 62;
            let lastYearPlotted = birthDate.getFullYear() + 100;
            for ( let curYear = firstYear; curYear <= lastYearPlotted; curYear++ )
            {
                let multiplier = curYear - firstYear + 1;
                let curData = [];
                curData.push(curYear - birthDate.getFullYear() + 1);
                for ( let claimOffset = 0; claimOffset < 9; ++claimOffset )
                {
                    let cum = benAmounts[claimOffset] * (multiplier - claimOffset);
                    if ( claimOffset > curYear - firstYear)
                        cum = null;
                    curData.push(cum);
                }
                curData.push(totalTaxesPaid);
                data.addRow(curData);
            }

            
            var chartwidth = $('#Benefits').width() - 100;
            var chartheight = chartwidth / 3;
            var title = 'Cumulative Benefits if Last Year Worked is ';
            title += String(year) + " (age " + String(year - birthDate.getFullYear()) + ")";
            var options = {
                title: title,
                hAxis: {
                    title: 'Age',
                    minValue: 0,
                    format: "####"
                },
                vAxis: {
                    title: 'Cumulative Benefits',
                    minValue: 0,
                    format: "$#,###"
                },
                width: chartwidth,
                height: chartheight,
            }

            var chart = new google.charts.Line(document.getElementById('bensChart'));
            chart.draw(data, google.charts.Line.convertOptions(options));
        }
    }

    function rowClicked() {
        let yearStr = this.getAttribute("year");
        if ( yearStr !== null )
        {
            let year = Number(this.getAttribute("year"));
            let children = this.getElementsByTagName("TD");
            let benAmounts = [];
            for(let idx = 0; idx < children.length; idx++)
            {
                let child = children[idx];
                let yearlyBenefit = Number(child.getAttribute("benefit"));
                benAmounts.push(yearlyBenefit);
            }

            drawCumulativeLineChart(benAmounts, year);
        }
    }
}
  
function parseXMLFile(xml) {

    // Clear some globals
    earningsHistory.clear();
    medicareMap.clear();
    ficaMap.clear();
    adjustedFicaMap.clear();
    predictedFicaMap.clear();
    bensChart.innerHTML = "";
    lastYear = 0;

    parser = new DOMParser();
    xmlDoc = parser.parseFromString(xml,"text/xml");

    // Get the earnings Record in the XML document
    let earningsRecords = xmlDoc.getElementsByTagName("osss:EarningsRecord");

    const adjustedMedicareMap = new Map();
    let sumMedicare = 0;
    let sumFica = 0;
    let medicareNotFicaCount = 0;

    // Extract the User Information section
    let userInformation = xmlDoc.getElementsByTagName("osss:UserInformation");
    let userName = "";
    if ( userInformation.length === 1 ) {
        let user = userInformation[0].getElementsByTagName("osss:Name");
        userName = user[0].childNodes[0].data;
        setSummaryValue("summaryHeading", "Summary for " + userName);
        if ( userName.length > 0 )
        {
            userName = "Earnings History for " + userName;
        }
        let bdate = userInformation[0].getElementsByTagName("osss:DateOfBirth");
        birthDate = new Date(bdate[0].childNodes[0].data);

        // Figure out the year user turns 60.  This is used in the Average Wage Index.
        lastAWIYear = (new Date(birthDate.getFullYear() + 60, birthDate.getMonth(), birthDate.getDay())).getFullYear();
        let curYear = new Date().getFullYear();
        if ( lastAWIYear > curYear - 2 )
            // Year 60 is after this year.  Use this year instead.
            lastAWIYear = curYear - 2;
    }

    // Extract the fica and medicare earnings from the Earnings node of the XML
    let lastInflationYear = Array.from(inflationMap.keys()).pop();
    if (earningsRecords.length === 1 ) {

        var earnings = earningsRecords[0].getElementsByTagName("osss:Earnings");
        for ( let j = 0; j < earnings.length; j++ ) {
            var earning = earnings[j];

            // Fetch the year attributes, fica and medicare amounts
            var endYear = Number(earning.getAttribute("endYear"));

            var fica = Number(earning.getElementsByTagName("osss:FicaEarnings")[0].childNodes[0].data);
            var medicare = Number(earning.getElementsByTagName("osss:MedicareEarnings")[0].childNodes[0].data);
            if ( fica == 0 )
                // Ignore years with 0 earnings
                continue;

            let curInfo = new YearInfo(endYear, fica, medicare);

            let inflMedicare = medicare;
            for (let inflYear = endYear + 1; inflYear <= lastInflationYear; inflYear++ )
            {
                inflMedicare *= (1 + (inflationMap.get(inflYear)/100));
            }
            curInfo.setAdjustedMedicare(inflMedicare);

            earningsHistory.set(endYear, curInfo);

            if ( fica === medicare )
                // Keep a count of years where medicare doesnt' equal fica
                medicareNotFicaCount++;
            
            sumFica += fica;
            sumMedicare += medicare;

            ficaMap.set(endYear, fica);
            adjustedFicaMap.set(endYear, fica * curInfo.wageIndex);
            medicareMap.set(endYear, medicare);
            adjustedMedicareMap.set(endYear, inflMedicare);

        } // For each year of earnings recorded

        // Create a sorted Indexed FICA Earnings map
        const sortedFica = new Map([...adjustedFicaMap.entries()].sort((a, b) => b[1] - a[1]));
        let age = new Date().getFullYear() - birthDate.getFullYear();
        if ( age < 70 )
        {
            addEstimatedBenefitsTable(sortedFica);
            if ( birthDate.getFullYear() < 1960 )
                document.getElementById("full67").style.display = "block";
            else
                document.getElementById("full67").style.display = "none";
            document.getElementById("click67").style.display = "block";
        }
        else
        {
            // Hide this text, doesn't apply to people aged 70 and above already.
            document.getElementById("full67").style.display = "none";
            document.getElementById("click67").style.display = "none";
        }

        // Create a sorted Medicare Earnings map
        const sortedMedicare = new Map([...adjustedMedicareMap.entries()].sort((a, b) => b[1] - a[1]));
        sortedKeys = Array.from( sortedMedicare.keys( ) );

        createEarningsTable();

        var statisticsDiv = document.getElementById("statistics");
        createStatisticsOutput(statisticsDiv, xmlDoc, ficaMap, sortedMedicare, medicareMap);
        
        // Create the estimated earnings output.
        var tempFica = new Map(sortedFica)

        // Get the top35 years
        const top35 = sortedKeys.slice(0, 35);
        var sum = 0;

        // Sum the top 35 adjusted FICA earnings
        for ( let idx = 0; idx < Math.min(35, earningsHistory.size); idx++)
        {
            let year = top35[idx];
            let curYear = earningsHistory.get(year);
            sum += curYear.fica * curYear.wageIndex;
        }

        // AIME is the Average Indexed Monthly Earnings, so divide sum by 25 years and again by 12 months
        let aime = Math.floor( sum / 35 / 12 );
        document.getElementById("aime").innerHTML = aime.toLocaleString("en-US", {style:"currency", currency:"USD", maximumFractionDigits:"0"});
        let aimey = Math.floor( sum / 35 );
        document.getElementById("aimey").innerHTML = aimey.toLocaleString("en-US", {style:"currency", currency:"USD", maximumFractionDigits:"0"});
        let total = 0;
        if ( aime > firstCut)
        {
            total = 0.9 * firstCut;
            document.getElementById("firstCut").innerHTML = (0.9 * firstCut).toLocaleString("en-US", {style:"currency", currency:"USD", maximumFractionDigits:"0"});
            if ( aime > secondCut )
            {
                total += (secondCut - firstCut) * .32;
                document.getElementById("secondCut").innerHTML = ((secondCut - firstCut) * .32).toLocaleString("en-US", {style:"currency", currency:"USD", maximumFractionDigits:"0"});
                total += (aime - secondCut) * .15;
                document.getElementById("finalCut").innerHTML = ((aime - secondCut) * .15).toLocaleString("en-US", {style:"currency", currency:"USD", maximumFractionDigits:"0"});
            }
            else
            {
                // Greater than fist cut, but less than second cut.
                total += (aime - firstCut) * .32;
                document.getElementById("secondCut").innerHTML = ((aime - firstCut) * .32).toLocaleString("en-US", {style:"currency", currency:"USD", maximumFractionDigits:"0"});
                document.getElementById("finalCut").innerHTML = (0).toLocaleString("en-US", {style:"currency", currency:"USD", maximumFractionDigits:"0"});
            }
        }
        else
        {
            total = 0.9 * aime;
            document.getElementById("firstCut").innerHTML = (aime * 0.9).toLocaleString("en-US", {style:"currency", currency:"USD", maximumFractionDigits:"0"});
            document.getElementById("secondCut").innerHTML = (0).toLocaleString("en-US", {style:"currency", currency:"USD", maximumFractionDigits:"0"});
            document.getElementById("finalCut").innerHTML = (0).toLocaleString("en-US", {style:"currency", currency:"USD", maximumFractionDigits:"0"});
    }

        document.getElementById("pia").innerHTML = total.toLocaleString("en-US", {style:"currency", currency:"USD", maximumFractionDigits:"0"});
        document.getElementById("piay").innerHTML = (Math.floor(total) * 12).toLocaleString("en-US", {style:"currency", currency:"USD", maximumFractionDigits:"0"});

        let ficaTaxTotalEmployer = Number(earningsRecords[0].getElementsByTagName("osss:FicaTaxTotalEmployer")[0].childNodes[0].data);
        let ficaTaxTotalIndividual = Number(earningsRecords[0].getElementsByTagName("osss:FicaTaxTotalIndividual")[0].childNodes[0].data);
        totalTaxesPaid = ficaTaxTotalEmployer + ficaTaxTotalIndividual;

        $( "#tabs" ).tabs( "enable", "#Summary" );
        $( "#tabs" ).tabs( "enable", "#TaxesPaid" );
        $( "#tabs" ).tabs( "enable", "#Earnings" );
        $( "#tabs" ).tabs({
            activate: function(event ,ui)
            {
                if ( ui.newTab[0].innerText == "Earnings History" )
                {
                    drawIncomeHistoryChart();
                }
                else if ( ui.newTab[0].innerText == "Taxes Paid" )
                {
                    // Get the earnings Record in the XML document
                    let earningsRecords = xmlDoc.getElementsByTagName("osss:EarningsRecord");
                    let ficaTaxTotalEmployer = Number(earningsRecords[0].getElementsByTagName("osss:FicaTaxTotalEmployer")[0].childNodes[0].data);
                    let ficaTaxTotalIndividual = Number(earningsRecords[0].getElementsByTagName("osss:FicaTaxTotalIndividual")[0].childNodes[0].data);
                    let medicareTaxTotalEmployer = Number(earningsRecords[0].getElementsByTagName("osss:MedicareTaxTotalEmployer")[0].childNodes[0].data);
                    let medicareTaxTotalIndividual = Number(earningsRecords[0].getElementsByTagName("osss:MedicareTaxTotalIndividual")[0].childNodes[0].data);
                    totalTaxesPaid = ficaTaxTotalEmployer + ficaTaxTotalIndividual;
                    document.getElementById("taxTable").style.visibility = "visible";

                    // Set the summary values
                    setSummaryValue("fixaemployee", ficaTaxTotalIndividual);
                    setSummaryValue("medicareemployee", medicareTaxTotalIndividual);
                    setSummaryValue("employeeTotal", ficaTaxTotalIndividual + medicareTaxTotalIndividual);
                    setSummaryValue("ficaEmployer", ficaTaxTotalEmployer);
                    setSummaryValue("medicareEmployer",medicareTaxTotalEmployer );
                    setSummaryValue("employerTotal", ficaTaxTotalEmployer + medicareTaxTotalEmployer);
                    setSummaryValue("fixaTotal", ficaTaxTotalIndividual + ficaTaxTotalEmployer);
                    setSummaryValue("medicareTotal", medicareTaxTotalIndividual + medicareTaxTotalEmployer);
                    setSummaryValue("grandTotal", ficaTaxTotalIndividual + medicareTaxTotalIndividual + ficaTaxTotalEmployer + medicareTaxTotalEmployer);


                    drawTaxesPaidChart(ficaTaxTotalEmployer,ficaTaxTotalIndividual,medicareTaxTotalEmployer,medicareTaxTotalIndividual);
                }
            }
        });
        $( "#tabs" ).tabs( "enable", "#Benefits" );
        $( "#tabs" ).tabs( "option", "active", 1 );
    }
}


var openXMLFile = function(event) {
    // Get the file name
    var source = event.target;

    var reader = new FileReader();
    reader.addEventListener(
        "load",
        () => {
            content = reader.result;
            parseXMLFile(content);
        },
        false
    );
    reader.readAsText(source.files[0]);

};

function addRowToEarningsTable(earningsTable, bdate, year, medicarePercent) {
    var row = document.createElement("TR");
    earningsTable.appendChild(row);

    // Add the row header
    var td = document.createElement("TD");
    var cell = document.createTextNode(year);
    td.appendChild(cell);
    row.appendChild(td);

    let curYear = earningsHistory.get(year);

    // Create the age cell
    let curDate = new Date(year,1,1);
    let age = curDate.getFullYear() - bdate.getFullYear();
    td = document.createElement("TD");
    cell = document.createTextNode(age);
    td.appendChild(cell);
    row.appendChild(td);

    var showMedicare = document.getElementById('showMedicare');
    if (showMedicare.checked)
    {
        // Create the rank cell
        td = document.createElement("TD");
        cell = document.createTextNode(curYear.rank);
        td.appendChild(cell);
        row.appendChild(td);
    }
    if ( curYear.rank <= 35 ) {
        row.classList.add("top35");
    }
    else {
        row.classList.add("not35");
    }

    // Create the index cell
    td = document.createElement("TD");
    // The wage index is 1 from age 60 and later
    let wageIndex = 1;
    let curAverageWage = averageWage.get(year);
    // If the year is less than two years ago, we can calculate the wage index
    if ( year <= new Date().getFullYear() - 2 )
    {
        let finalAverageWage = averageWage.get(lastAWIYear);
        wageIndex = finalAverageWage / curAverageWage;
    }
    curYear.wageIndex = wageIndex;
    cell = document.createTextNode(formatter7.format(curYear.wageIndex));
    td.appendChild(cell);
    row.appendChild(td);

    // Create the fica cell
    let fica = curYear.fica;
    let medicare = curYear.medicare;
    td = document.createElement("TD");
    let dollars = fica.toLocaleString("en-US", {style:"currency", currency:"USD", maximumFractionDigits:"0"});
    cell = document.createTextNode(dollars);
    td.appendChild(cell);
    row.appendChild(td);

    // Create the average wage index adjusted fica cell
    td = document.createElement("TD");
    td.classList.add("AWI");
    dollars = (fica * wageIndex).toLocaleString("en-US", {style:"currency", currency:"USD"});
    cell = document.createTextNode(dollars);
    td.appendChild(cell);
    row.appendChild(td);

    var showAverageWage = document.getElementById('showAverageWage');
    if ( showAverageWage.checked )
    {
        // Create the average wage  cell
        td = document.createElement("TD");
        dollars = curAverageWage.toLocaleString("en-US", {style:"currency", currency:"USD"});
        cell = document.createTextNode(dollars);
        td.appendChild(cell);
        row.appendChild(td);

        // Create the % of average wage  cell
        td = document.createElement("TD");
        dollars = (medicare/curAverageWage).toLocaleString("en-US", {style:"percent"});
        cell = document.createTextNode(dollars);
        td.appendChild(cell);
        row.appendChild(td);
    }

    var showMaxTaxed = document.getElementById('showTaxMax');
    if ( showMaxTaxed.checked )
    {
        // Create the max taxed cell
        td = document.createElement("TD");
        let curMaxTaxedIncome =  Number(maxTaxedIncome.get(year));
        let pct = curMaxTaxedIncome.toLocaleString("en-US", {style:"currency", currency:"USD", maximumFractionDigits:"0"});
        cell = document.createTextNode(pct);
        td.appendChild(cell);
        row.appendChild(td);

        // Create the percent of max taxed cell
        td = document.createElement("TD");
        if ( isNaN(medicare) || ! isFinite(medicare) ) {
            cell = document.createTextNode("");
        }
        else {
            let pct = (medicare / curMaxTaxedIncome).toLocaleString("en-US", {style:"percent"});
            cell = document.createTextNode(pct);
        }
        td.appendChild(cell);
        row.appendChild(td);
    }

    if (showMedicare.checked)
    {
        // Create the medicare cell
        td = document.createElement("TD");
        dollars = medicare.toLocaleString("en-US", {style:"currency", currency:"USD", maximumFractionDigits:"0"});
        cell = document.createTextNode(dollars);
        td.appendChild(cell);
        row.appendChild(td);

        // Create the inflation adjusted medicare cell
        td = document.createElement("TD");
        dollars = (curYear.adjMed).toLocaleString("en-US", {style:"currency", currency:"USD"});
        cell = document.createTextNode(dollars);
        if ( medicare === fica )
        {
            td.classList.add("same");
        }
        td.appendChild(cell);
        row.appendChild(td);

        td = document.createElement("TD");
        
        if ( isNaN(medicarePercent) || ! isFinite(medicarePercent) ) {
            cell = document.createTextNode("");
        }
        else {
            let pct = medicarePercent.toLocaleString("en-US", {style:"percent"});
            cell = document.createTextNode(pct);
        }
        td.appendChild(cell);
        row.appendChild(td);
    }
}

function addZeroToEarningsTable(earningsTable, rank) {
    var row = document.createElement("TR");
    row.classList.add("top35");
    earningsTable.appendChild(row);

    // Add the row header
    var td = document.createElement("TD");
    var cell = document.createTextNode("");
    td.appendChild(cell);
    row.appendChild(td);

    // Create the age cell
    td = document.createElement("TD");
    cell = document.createTextNode("");
    td.appendChild(cell);
    row.appendChild(td);

    var showMedicare = document.getElementById('showMedicare');
    if (showMedicare.checked)
    {
        // Create the rank cell
        td = document.createElement("TD");
        cell = document.createTextNode(rank);
        td.appendChild(cell);
        row.appendChild(td);
    }
    
    // Create the index cell
    td = document.createElement("TD");
    cell = document.createTextNode("");
    td.appendChild(cell);
    row.appendChild(td);

    // Create the fica cell
    td = document.createElement("TD");
    cell = document.createTextNode("$0");
    td.appendChild(cell);
    row.appendChild(td);

    // Create the average wage index adjusted fica cell
    td = document.createElement("TD");
    td.classList.add("AWI");
    cell = document.createTextNode("$0");
    td.appendChild(cell);
    row.appendChild(td);

    var showAverageWage = document.getElementById('showAverageWage');
    if (showAverageWage.checked)
    {
        // Create the average wage cell
        td = document.createElement("TD");
        cell = document.createTextNode("$0");
        td.appendChild(cell);
        row.appendChild(td);

        // Create the % of average wage cell
        td = document.createElement("TD");
        cell = document.createTextNode("0%");
        td.appendChild(cell);
        row.appendChild(td);
    }

    var showTaxMax = document.getElementById('showTaxMax');
    if (showTaxMax.checked)
    {
        // Create the max taxed cell
        td = document.createElement("TD");
        cell = document.createTextNode("$0");
        td.appendChild(cell);
        row.appendChild(td);

        // Create the percent of max taxed cell
        td = document.createElement("TD");
        cell = document.createTextNode("");
        td.appendChild(cell);
        row.appendChild(td);
    }

    if (showMedicare.checked)
    {
        // Create the medicare cell
        td = document.createElement("TD");
        cell = document.createTextNode("$0");
        td.classList.add("same");
        td.appendChild(cell);
        row.appendChild(td);

        // Create the inflation adjusted medicare cell
        td = document.createElement("TD");
        cell = document.createTextNode("$0");
        td.classList.add("same");
        td.appendChild(cell);
        row.appendChild(td);

        td = document.createElement("TD");
        
        cell = document.createTextNode("");
        td.appendChild(cell);
        row.appendChild(td);
    }
}

function createHeader(row, header, tooltip)
{
    let th = document.createElement("TH");
    row.appendChild(th);
    let div = document.createElement("div");
    th.appendChild(div);
    if ( tooltip )
    {
        div.classList.add("tooltip");
        div.title = tooltip;
        var cell = document.createTextNode(header);
        div.appendChild(cell);
    }
    else
    {
        var cell = document.createTextNode(header);
        th.appendChild(cell);
    }

}


function createEarningsTable()
{
    // Destroy the datatable if it exists
    if ( earningsTableInitialized === true )
    {
        $('#earningsTable').DataTable().clear();
        $('#earningsTable').DataTable().destroy();
        $('#earningsTable').find('thead tr th').remove();
    }

    // Get the earnings table in the HTML we want to generate
    let earningsTable = document.getElementById("earningsTable");
    // Clear the table contents
    earningsTable.innerHTML = "";
    $( "#earningsTable" ).empty();

    var tableBody = document.createElement("TBODY");
    earningsTable.appendChild(tableBody);

    var header = document.createElement("THEAD");
    earningsTable.appendChild(header);
    var row = document.createElement("TR");
    header.appendChild(row);

    // Add the row header
    createHeader(row, "Year", "Start Year");
    createHeader(row, "Age", "Age as of 1-January of the year shown.");
    var showMedicare = document.getElementById('showMedicare');
    if (showMedicare.checked)
    {
        createHeader(row, "Rank", "The rank of Adjusted Medicare Earnings, where 1 is the highest.");
    }
    
    createHeader(row, "Average Wage Index (AWI)", "The Average Wage Index (AWI) derived from https://www.ssa.gov/oact/cola/AWI.html.");
    createHeader(row, "Fica Earnings", "Your Social Security taxed earnings.");
    createHeader(row, "AWI adjusted Fica Earnings", "Your Social Security taxed earnings, indexed by the AWI.  This is the value Social Security uses to calculate your benifit amount.");

    var showAverageWage = document.getElementById('showAverageWage');
    if (showAverageWage.checked)
    {
        createHeader(row, "Average Wage", "The US Average Wage for the given year, from https://www.ssa.gov/oact/cola/AWI.html.");
        createHeader(row, "% of Average Wage", "The percent of US Average Wage for the given year.");
    }
    
    var showTaxMax = document.getElementById('showTaxMax');
    if (showTaxMax.checked)
    {
        createHeader(row, "Taxable Maximum", "The social security maximum taxable income for the year.");
        createHeader(row, "% of Taxable Maximum", "The percent of the social security maximum taxable for the year.");
    }

    if (showMedicare.checked)
    {
        createHeader(row, "Medicare Earnings", "Your Medicare taxed earings (includes pre-tax 401K earnings, etc).");
        createHeader(row, "Inflation adjusted Medicare Earnings", "Your Medicare taxed earings, indexed by the consumer price index.");
        createHeader(row, "% Change", "The percent change in your Inflation adjusted Medicare taxed earnings from the prior year that you had earnings (i.e. your inflation adjusted raise).");
    }

    // Add all earnings records to the table
    let lastYearEarnings = 0;
    for (let [key, value] of ficaMap) {
        let rank = sortedKeys.findIndex(year => year === key);
        earningsHistory.get(key).setRank(rank + 1);
        let curMedicare = medicareMap.get(key);
        let percentChange = (curMedicare - lastYearEarnings) / lastYearEarnings;
        addRowToEarningsTable(tableBody, birthDate, key, percentChange);
        lastYearEarnings = curMedicare;
    }

    // Add zero rows if they exist
    if ( ficaMap.size < 35 )
    {
        for ( idx = ficaMap.size; idx < 35; ++idx)
        {
            addZeroToEarningsTable(earningsTable, idx + 1);
        }
    }

    var eTable = $('#earningsTable').DataTable({
        dom: 'Bfrtip',
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ],
        bAutoWidth: false,
        bPaginate: false,
        searching: false,
        info: false,
        fixedHeader: true,
        scrollCollapse: true,
        paging:         false,
    });

    earningsTableInitialized = true;

}

function timeUntil(futureDate) {

    var diff = new Date(futureDate - new Date());
    let yearStr = "";
    if ( diff.getFullYear() > 1970 )
        yearStr = (diff.toISOString().slice(0, 4) - 1970) + " years ";
    return " (in " + yearStr + (diff.getMonth()+1) + " months, " + diff.getDate() + " days)";
}

function timeSince(pastDate) {

    var diff = new Date(new Date() - pastDate);
    let yearStr = "";
    if ( diff.getFullYear() > 1970 )
        yearStr = (diff.toISOString().slice(0, 4) - 1970) + " years ";
    return " (" + yearStr + (diff.getMonth()+1) + " months, " + diff.getDate() + " days ago)";
}

function setSummaryValue(docId, value)
{
    document.getElementById(docId).innerHTML = value.toLocaleString("en-US", {style:"currency", currency:"USD", maximumFractionDigits:"0"});
}


function drawTaxesPaidChart(ficaTaxTotalEmployer,ficaTaxTotalIndividual,medicareTaxTotalEmployer,medicareTaxTotalIndividual)
{
    google.charts.load("current", {packages:['corechart', 'bar']});
    google.charts.setOnLoadCallback(drawChart);
    
    function drawChart()
    {
        var byEmployee = ['Employee'];
        byEmployee.push(ficaTaxTotalIndividual);
        byEmployee.push(medicareTaxTotalIndividual);

        var byEmployer = ['Employer'];
        byEmployer.push(ficaTaxTotalEmployer);
        byEmployer.push(medicareTaxTotalEmployer);

        var total = ['Total'];
        total.push(ficaTaxTotalIndividual + ficaTaxTotalEmployer);
        total.push(medicareTaxTotalIndividual + medicareTaxTotalEmployer);

        var data = google.visualization.arrayToDataTable(
            [
                ['Type', 'Fica', 'Medicare'],
                byEmployee,
                byEmployer,
                total
            ]
        );
    
        var view = new google.visualization.DataView(data);

        var options = {
            isStacked: true,
            width: 600,
            height: 400,
            hAxis: {
                title: 'Taxes',
                minValue: 0,
                format: "$#,###"
            },
        };

        var chart = new google.visualization.BarChart(document.getElementById("taxesPaidChart"));
        chart.draw(view, options);
    }
}

function drawIncomeHistoryChart()
{
    google.charts.load('current', {'packages':['line']});
    google.charts.setOnLoadCallback(drawLineChart);
    
    function drawLineChart()
    {
        var data = new google.visualization.DataTable();
        data.addColumn('number', 'Year');
        data.addColumn('number', 'Medicare Income');
        data.addColumn('number', 'Inflation Adjusted Medicare Income');
        data.addColumn('number', 'Fica');
        data.addColumn('number', 'Adjusted Fica');
        data.addColumn('number', 'US Average Wage');
        data.addColumn('number', 'Taxable Maximum');

        for (let [key, value] of earningsHistory) {
            let curInfo = earningsHistory.get(key);
            data.addRow([value.year, value.medicare, value.adjMed, value.fica, value.ficaAdjusted, averageWage.get(key), maxTaxedIncome.get(key)]);
        }
        
        var chartwidth = $('#Earnings').width() - 100;
        var chartheight = chartwidth / 3;
        var options = {
            hAxis: {
                title: 'Year',
                minValue: 0,
                format: "####"
            },
            vAxis: {
                title: 'Income',
                minValue: 0,
                format: "$#,###"
            },
            width: chartwidth,
            height: chartheight,
        }

        var chart = new google.charts.Line(document.getElementById('earningsChart'));
        chart.draw(data, google.charts.Line.convertOptions(options));
    }
}


function getExpectedLife(yearsLeft)
{
    let decimal = yearsLeft % 1;
    let days = decimal * 365;
    
    Date.prototype.addDays = function(days) {
        this.setDate(this.getDate() + parseInt(days));
        return this;
    };

    var expireDate = new Date();
    expireDate.addDays(days + (365 * Math.trunc(yearsLeft)));

    let timeLeft = timeUntil(expireDate);
    return expireDate.toDateString() + " at age " + (expireDate.getFullYear() - birthDate.getFullYear()) + " " + timeLeft;
   
}

function createStatisticsOutput(statisticsDiv, xmlDoc, fica, sortedMedicareAdjusted, medicareMap) {

    // Clear the existing div
    statisticsDiv.style.visibility = "visible";

    let numYearsWorked = fica.size;
    document.getElementById("incomeYears").innerHTML = numYearsWorked;

    if ( numYearsWorked >= 35 )
    {
        document.getElementById("notMet35").style.display = "none";
    }
    else
    {
        document.getElementById("notMet35").style.display = "block";
        document.getElementById("numYearsWorked").innerHTML = numYearsWorked;
        document.getElementById("zeroYears").innerHTML = 35 - numYearsWorked;
    }

    // Count the number of years earnings exceeded max, and sum the values
    let sumMedicare = 0;
    let exceededCount = 0;
    for (let [key, value] of medicareMap)
    {
        if ( maxTaxedIncome.has(key) )
        {
            if ( maxTaxedIncome.get(key) <= value )
            {
                exceededCount++;
            }
        }
        sumMedicare += value;
    }
    document.getElementById("totalIncome").innerHTML = sumMedicare.toLocaleString("en-US", {style:"currency", currency:"USD", maximumFractionDigits:"0"});

    let sumAdjustedMedicare = 0;
    for (let [key, value] of sortedMedicareAdjusted)
    {
        sumAdjustedMedicare += value;
    }
    document.getElementById("totalIncomeAdjusted").innerHTML = sumAdjustedMedicare.toLocaleString("en-US", {style:"currency", currency:"USD"});
    

    if ( exceededCount > 0 )
    {
        document.getElementById("exceeded").style.display = "block";
        document.getElementById("exceededCount").innerHTML = exceededCount;
    }
    else
    {
        document.getElementById("exceeded").style.display = "none";
    }

    const sortedMedicare = new Map([...medicareMap.entries()].sort((a, b) => b[1] - a[1]));

    let medicareMax = Array.from(sortedMedicare.values())[0];
    let medicareMaxYear = Array.from(sortedMedicare.keys())[0];

    let ficaMin = 0;
    let ficaMinYear = 0;
    let showMin = false;
    const sortedFica = new Map([...adjustedFicaMap.entries()].sort((a, b) => b[1] - a[1]));
    if ( exceededCount < 35 && numYearsWorked >= 35 )
    {
        ficaMin = Array.from(sortedFica.values())[34];
        ficaMinYear = Array.from(sortedFica.keys())[34];
        showMin = true;
    }

    let adjustedMedicareMax = Array.from(sortedMedicareAdjusted.values())[0];
    let adjustedMedicareMaxYear = Array.from(sortedMedicareAdjusted.keys())[0];

    let appendNote = "";
    if ( medicareMaxYear === adjustedMedicareMaxYear && medicareMax !== adjustedMedicareMax )
        appendNote = " (" + adjustedMedicareMax.toLocaleString("en-US", {style:"currency", currency:"USD"}) + " inflation adjusted)";
    
    document.getElementById("highestYear").innerHTML = medicareMaxYear;
    document.getElementById("highestedIncome").innerHTML = medicareMax.toLocaleString("en-US", {style:"currency", currency:"USD", maximumFractionDigits:"0"}) + appendNote;
    if ( showMin )
    {
        document.getElementById("lowestYear").innerHTML = ficaMinYear;
        document.getElementById("lowestIncome").innerHTML = ficaMin.toLocaleString("en-US", {style:"currency", currency:"USD"}) + appendNote;
    }
    else
    {
        document.getElementById("minInfo").style.display = "block";
    }

    if ( medicareMaxYear !== adjustedMedicareMaxYear )
    {
        document.getElementById("highestInflation").style.display = "block";
        document.getElementById("highestYearAdjusted").innerHTML = adjustedMedicareMaxYear;
        document.getElementById("highestedIncomeAdjusted").innerHTML = adjustedMedicareMax.toLocaleString("en-US", {style:"currency", currency:"USD"});
    }
    else
    {
        document.getElementById("highestInflation").style.display = "none";
    }

    // Get the user information portion of the XML document
    let userInformation = xmlDoc.getElementsByTagName("osss:UserInformation");
    let birthDate;
    if ( userInformation.length === 1 ) {
        let bdate = userInformation[0].getElementsByTagName("osss:DateOfBirth");
        birthDate = new Date(bdate[0].childNodes[0].data);
    }

    let bYear = birthDate.getFullYear();
    let bMonth = birthDate.getMonth();
    let bDay = birthDate.getDay();
    // You are eligible on the first full month of being 62.
    if ( bMonth === 12 && bDay !== 1 )
    {
        bMonth = 1;
        bYear += 1;
    }
    else
        bMonth += 1;

    let firstEligibleDate = new Date(bYear + 62, bMonth, 1);
    let lastEligibleDate = new Date(firstEligibleDate.getFullYear() + 8, firstEligibleDate.getMonth(), firstEligibleDate.getDay());

    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let togo = timeUntil(firstEligibleDate);
    if ( today.getFullYear() - bYear < 70 )
    {
        // Display this information
        document.getElementById("maxPossible").style.display = "block";
        document.getElementById("priorStop").style.display = "block";
        document.getElementById("seventyStop").style.display = "block";
        if ( today.getFullYear() - bYear > 62 )
        {
            togo = timeSince(firstEligibleDate);
            document.getElementById("eligible62PastDate").innerHTML = firstEligibleDate.toLocaleDateString(undefined, options);
            document.getElementById("eligiblePast62Diff").innerHTML = togo;
            document.getElementById("eligibleFuture").style.display = "none";
            document.getElementById("eligiblePast").style.display = "block";
        }
        else
        {
            document.getElementById("eligible62Date").innerHTML = firstEligibleDate.toLocaleDateString(undefined, options);
            document.getElementById("eligible62Diff").innerHTML = togo;
            document.getElementById("eligiblePast").style.display = "none";
            document.getElementById("eligibleFuture").style.display = "block";
        }
        togo = timeUntil(lastEligibleDate);
        document.getElementById("eligible70Date").innerHTML = lastEligibleDate.toLocaleDateString(undefined, options);
        document.getElementById("eligible70Diff").innerHTML = togo;
    }
    else
    {
        // Hide this information
        document.getElementById("eligibleFuture").style.display = "none";
        document.getElementById("eligiblePast").style.display = "none";
        document.getElementById("maxPossible").style.display = "none";
        document.getElementById("priorStop").style.display = "none";
        document.getElementById("seventyStop").style.display = "none";
    }

    let curAge = new Date().getFullYear() - bYear;
    document.getElementById("maleLife").innerHTML = getExpectedLife(lifeExpectancy[curAge][3]);
    document.getElementById("femaleLife").innerHTML = getExpectedLife(lifeExpectancy[curAge][6]);

}

