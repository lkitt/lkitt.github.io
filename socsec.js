var tableInitialized = false;

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
}

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

const averageWage = new Map([
    [1951,2799.16], [1952,2973.32], [1953,3139.44], [1954,3155.64], [1955,3301.44], [1956,3532.36], [1957,3641.72], [1958,3673.80], [1959,3855.80],
    [1960,4007.12], [1961,4086.76], [1962,4291.40], [1963,4396.64], [1964,4576.32], [1965,4658.72], [1966,4938.36], [1967,5213.44], [1968,5571.76], [1969,5893.76],
    [1970,6186.24], [1971,6497.08], [1972,7133.80], [1973,7580.16], [1974,8030.76], [1975,8630.92], [1976,9226.48], [1977,9779.44], [1978,10556.03], [1979,11479.46],
    [1980,12513.46], [1981,13773.10], [1982,14531.34], [1983,15239.24], [1984,16135.07], [1985,16822.51], [1986,17321.82], [1987,18426.51], [1988,19334.04], [1989,20099.55],
    [1990,21027.98], [1991,21811.60], [1992,22935.42], [1993,23132.67], [1994,23753.53], [1995,24705.66], [1996,25913.90], [1997,27426.00], [1998,28861.44], [1999,30469.84],
    [2000,32154.82], [2001,32921.92], [2002,33252.09], [2003,34064.95], [2004,35648.55], [2005,36952.94], [2006,38651.41], [2007,40405.48], [2008,41334.97], [2009,40711.61],
    [2010,41673.83], [2011,42979.61], [2012,44321.67], [2013,44888.16], [2014,46481.52], [2015,48098.63], [2016,48642.15], [2017,50321.89], [2018,52145.80], [2019,54099.99],
    [2020,55628.60], [2021,60575.07],
]);

//https://www.ssa.gov/oact/cola/AWI.html
const wageIndices = new Map([
    [1962,14.1154565], [1963,13.7775824], [1964,13.2366334], [1965,13.0025136], [1966,12.2662321], [1967,11.6190212], [1968,10.8718017], [1969,10.2778311],
    [1970,9.7919043],  [1971,9.3234299],  [1972,8.4912767],  [1973,7.9912654],  [1974,7.5428814],  [1975,7.0183793],  [1976,6.5653499],  [1977,6.1941246], [1978,5.7384329], [1979,5.2768223],
    [1980,4.8407930],  [1981,4.3980709],  [1982,4.1685811],  [1983,3.9749404],  [1984,3.7542490],  [1985,3.6008342],  [1986,3.4970384],  [1987,3.2873870], [1988,3.1330788], [1989,3.0137525],
    [1990,2.8806890],  [1991,2.7771952],  [1992,2.6411145],  [1993,2.6185940],  [1994,2.5501502],  [1995,2.4518701],  [1996,2.3375513],  [1997,2.2086732], [1998,2.0988236], [1999,1.9880337],
    [2000,1.8838566],  [2001,1.8399616],  [2002,1.8216921],  [2003,1.7782228],  [2004,1.6992296],  [2005,1.6392490],  [2006,1.5672150],  [2007,1.4991796], [2008,1.4654679], [2009,1.4879065],
    [2010,1.4535518],  [2011,1.4093909],  [2012,1.3667145],  [2013,1.3494665],  [2014,1.3032076],  [2015,1.2593928],  [2016,1.2453206],  [2017,1.2037519], [2018,1.1616481], [2019,1.1196873],
    [2020,1.0889195],  [2021,1.0000000],  [2022,1.0000000],
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

class YearInfo {
    constructor(year, fica, medicare) {
        this.year = year;
        this.fica = fica;
        this.medicare = medicare;
        this.adjMed = medicare;
        this.rank = 1;
    }

    setAdjustedMedicare(adjMed) {
        this.adjMed = adjMed;
    }

    setRank(rank) {
        this.rank = rank;
    }
}

var earningsHistory = new Map();

function createEstimatedBeniftsTable(xmlDoc)
{
    let age62bens = getEstimatedBenefit(xmlDoc, "osss:Age62RetirementEstimate");
    let age63bens = getEstimatedBenefit(xmlDoc, "osss:Age63RetirementEstimate");
    let age64bens = getEstimatedBenefit(xmlDoc, "osss:Age64RetirementEstimate");
    let age65bens = getEstimatedBenefit(xmlDoc, "osss:Age65RetirementEstimate");
    let age66bens = getEstimatedBenefit(xmlDoc, "osss:Age66RetirementEstimate");
    let age67bens = getEstimatedBenefit(xmlDoc, "osss:Age67RetirementEstimate");
    let age68bens = getEstimatedBenefit(xmlDoc, "osss:Age68RetirementEstimate");
    let age69bens = getEstimatedBenefit(xmlDoc, "osss:Age69RetirementEstimate");
    let age70bens = getEstimatedBenefit(xmlDoc, "osss:Age70RetirementEstimate");

    let userInformation = xmlDoc.getElementsByTagName("osss:UserInformation");
    let birthDate;
    let userName = "";
    if ( userInformation.length === 1 ) {
        let bdate = userInformation[0].getElementsByTagName("osss:DateOfBirth");
        birthDate = new Date(bdate[0].childNodes[0].data);

        // Figure out the year user turns various ages
        var year62 = (new Date(birthDate.getFullYear() + 62, birthDate.getMonth(), birthDate.getDay())).getFullYear();
        var year63 = (new Date(birthDate.getFullYear() + 63, birthDate.getMonth(), birthDate.getDay())).getFullYear();
        var year64 = (new Date(birthDate.getFullYear() + 64, birthDate.getMonth(), birthDate.getDay())).getFullYear();
        var year65 = (new Date(birthDate.getFullYear() + 65, birthDate.getMonth(), birthDate.getDay())).getFullYear();
        var year66 = (new Date(birthDate.getFullYear() + 66, birthDate.getMonth(), birthDate.getDay())).getFullYear();
        var year67 = (new Date(birthDate.getFullYear() + 67, birthDate.getMonth(), birthDate.getDay())).getFullYear();
        var year68 = (new Date(birthDate.getFullYear() + 68, birthDate.getMonth(), birthDate.getDay())).getFullYear();
        var year69 = (new Date(birthDate.getFullYear() + 69, birthDate.getMonth(), birthDate.getDay())).getFullYear();
        var year70 = (new Date(birthDate.getFullYear() + 70, birthDate.getMonth(), birthDate.getDay())).getFullYear();
    }

    // Get the earnings table in the HTML we want to generate
    let benifitsTable = document.getElementById("estimatedBenefits");

    // Clear the table contents
    benifitsTable.innerHTML = "";

    var header = document.createElement("THEAD");
    benifitsTable.appendChild(header);
    var row = document.createElement("TR");
    header.appendChild(row);

    // Add the row header
    createHeader(row, "Year", "The year when benifits started");
    createHeader(row, "Age Benifits Start", "The age when benifits started");
    createHeader(row, "Monthly Benifit", "Monthly benefits");
    createHeader(row, "Yearly equivalent", "Monthly benefits multiplied by 12");

    addRowToBenifitsTable(benifitsTable, year62, 62, age62bens);
    addRowToBenifitsTable(benifitsTable, year63, 63, age63bens);
    addRowToBenifitsTable(benifitsTable, year64, 64, age64bens);
    addRowToBenifitsTable(benifitsTable, year65, 65, age65bens);
    addRowToBenifitsTable(benifitsTable, year66, 66, age66bens);
    addRowToBenifitsTable(benifitsTable, year67, 67, age67bens);
    addRowToBenifitsTable(benifitsTable, year68, 68, age68bens);
    addRowToBenifitsTable(benifitsTable, year69, 69, age69bens);
    addRowToBenifitsTable(benifitsTable, year70, 70, age70bens);

}

  
function parseXMLFile(xml) {
    parser = new DOMParser();
    xmlDoc = parser.parseFromString(xml,"text/xml");

    // Get the earnings Record in the XML document
    let earningsRecords = xmlDoc.getElementsByTagName("osss:EarningsRecord");

    // Get the earnings table in the HTML we want to generate
    let earningsTable = document.getElementById("earningsTable");
    createEarningsTable(earningsTable);

    const medicareMap = new Map();
    const ficaMap = new Map();
    const adjustedMedicareMap = new Map();
    let sumMedicare = 0;
    let sumFica = 0;
    let medicareNotFicaCount = 0;

    // Extract the fica and medicare earnings from the Earnings node of the XML
    let lastInflationYear = Array.from(inflationMap.keys()).pop();
    if (earningsRecords.length === 1 ) {
        var earnings = earningsRecords[0].getElementsByTagName("osss:Earnings");
        for ( j = 0; j < earnings.length; j++ ) {
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
            medicareMap.set(endYear, medicare);
            adjustedMedicareMap.set(endYear, inflMedicare);

        } // For each year of earnings recorded

        // Create a sorted Medicare Earnings map
        const sortedMedicare = new Map([...adjustedMedicareMap.entries()].sort((a, b) => b[1] - a[1]));
        let sortedKeys = Array.from( sortedMedicare.keys( ) );

        let userInformation = xmlDoc.getElementsByTagName("osss:UserInformation");
        let birthDate;
        let userName = "";
        if ( userInformation.length === 1 ) {
            let user = userInformation[0].getElementsByTagName("osss:Name");
            userName = user[0].childNodes[0].data;
            if ( userName.length > 0 )
            {
                userName = "Earnings History for " + userName;
            }
            let bdate = userInformation[0].getElementsByTagName("osss:DateOfBirth");
            birthDate = new Date(bdate[0].childNodes[0].data);

            // Figure out the year user turns 60.  This is used in the Average Wage Index.
            var year60 = (new Date(birthDate.getFullYear() + 60, birthDate.getMonth(), birthDate.getDay())).getFullYear();
            let curYear = new Date().getFullYear();
            if ( year60 > curYear - 2 )
                // Year 60 is after this year.  Use this year instead.
                year60 = curYear - 2;
        }

        // Create the table
        let caption = earningsTable.createCaption();
        caption.textContent = userName;
        var tableBody = document.createElement("TBODY");
        earningsTable.appendChild(tableBody);

        // Add all earnings records to the table
        let lastYearEarnings = 0;
        for (let [key, value] of ficaMap) {
            let rank = sortedKeys.findIndex(year => year === key);
            earningsHistory.get(key).setRank(rank + 1);
            let curMedicare = medicareMap.get(key);
            let percentChange = (curMedicare - lastYearEarnings) / lastYearEarnings;
            addRowToEarningsTable(tableBody, birthDate, key, year60, percentChange);
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

        var statisticsDiv = document.getElementById("statistics");
        createStatisticsOutput(statisticsDiv, xmlDoc, ficaMap, sortedMedicare, medicareMap);
        
        if ( tableInitialized === true )
        {
            $('#earningsTable').DataTable().clear().destroy();
        }
        $('#earningsTable').DataTable({
            bPaginate: false,
            searching: false,
            info: false,
            fixedHeader: true,
            scrollY:        500,
            scrollCollapse: true,
            paging:         false,
        });
        tableInitialized = true;

        createEstimatedBeniftsTable(xmlDoc);

        $( "#tabs" ).tabs( "enable", "#Summary" );
        $( "#tabs" ).tabs( "enable", "#TaxesPaid" );
        $( "#tabs" ).tabs( "enable", "#Earnings" );
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

function addRowToEarningsTable(earningsTable, bdate, year, year60, medicarePercent) {
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

    // Create the rank cell
    td = document.createElement("TD");
    cell = document.createTextNode(curYear.rank);
    td.appendChild(cell);
    if ( curYear.rank <= 35 ) {
        row.classList.add("top35");
    }
    else {
        row.classList.add("not35");
    }
    row.appendChild(td);
    
    // Create the index cell
    td = document.createElement("TD");
    let wageIndex = 1;
    if ( year <= new Date().getFullYear() - 2 )
    {
        let curAverageWage = averageWage.get(year);
        let finalAverageWage = averageWage.get(year60);
        wageIndex = finalAverageWage / curAverageWage;
    }
    cell = document.createTextNode(formatter7.format(wageIndex));
    td.appendChild(cell);
    row.appendChild(td);

    // Create the fica cell
    let fica = curYear.fica;
    td = document.createElement("TD");
    let dollars = fica.toLocaleString("en-US", {style:"currency", currency:"USD", maximumFractionDigits:"0"});
    cell = document.createTextNode(dollars);
    td.appendChild(cell);
    row.appendChild(td);

    // Create the average wage index adjusted fica cell
    td = document.createElement("TD");
    dollars = (fica * wageIndex).toLocaleString("en-US", {style:"currency", currency:"USD"});
    cell = document.createTextNode(dollars);
    td.appendChild(cell);
    row.appendChild(td);

    // Create the max taxed cell
    td = document.createElement("TD");
    let curMaxTaxedIncome =  Number(maxTaxedIncome.get(year));
    let pct = curMaxTaxedIncome.toLocaleString("en-US", {style:"currency", currency:"USD", maximumFractionDigits:"0"});
    cell = document.createTextNode(pct);
    td.appendChild(cell);
    row.appendChild(td);

    // Create the percent of max taxed cell
    td = document.createElement("TD");
    if ( isNaN(fica) || ! isFinite(fica) ) {
        cell = document.createTextNode("");
    }
    else {
        let pct = (fica / curMaxTaxedIncome).toLocaleString("en-US", {style:"percent"});
        cell = document.createTextNode(pct);
    }
    td.appendChild(cell);
    row.appendChild(td);

    // Create the medicare cell
    td = document.createElement("TD");
    let medicare = curYear.medicare;
    dollars = medicare.toLocaleString("en-US", {style:"currency", currency:"USD", maximumFractionDigits:"0"});
    cell = document.createTextNode(dollars);
    if ( medicare === fica )
    {
        td.classList.add("same");
    }
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

function addZeroToEarningsTable(earningsTable, rank) {
    var row = document.createElement("TR");
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

    // Create the rank cell
    td = document.createElement("TD");
    cell = document.createTextNode(rank);
    td.appendChild(cell);
    row.classList.add("top35");
    row.appendChild(td);
    
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
    cell = document.createTextNode("$0");
    td.appendChild(cell);
    row.appendChild(td);

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

function addRowToBenifitsTable(benifitsTable, year, age, monthly) {
    var row = document.createElement("TR");
    benifitsTable.appendChild(row);

    // Add the row header
    var td = document.createElement("TD");
    var cell = document.createTextNode(year);
    td.appendChild(cell);
    row.appendChild(td);

    // Create the age cell
    td = document.createElement("TD");
    cell = document.createTextNode(age);
    td.appendChild(cell);
    row.appendChild(td);

    // Create the monthly cell
    td = document.createElement("TD");
    cell = document.createTextNode(monthly.toLocaleString("en-US", {style:"currency", currency:"USD", maximumFractionDigits:"0"}));
    td.appendChild(cell);
    row.appendChild(td);

    // Create the yearly cell
    td = document.createElement("TD");
    cell = document.createTextNode((monthly * 12).toLocaleString("en-US", {style:"currency", currency:"USD", maximumFractionDigits:"0"}));
    td.appendChild(cell);
    row.appendChild(td);
    
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

function createDollarCell(row, dollarValue)
{
    var td = document.createElement("TD");
    var dollars = dollarValue.toLocaleString("en-US", {style:"currency", currency:"USD"});
    var cell = document.createTextNode(dollars);
    td.appendChild(cell);
    row.appendChild(td);
}

function createEarningsTable(earningsTable) {

    // Clear the table contents
    earningsTable.innerHTML = "";

    var header = document.createElement("THEAD");
    earningsTable.appendChild(header);
    var row = document.createElement("TR");
    header.appendChild(row);

    // Add the row header
    createHeader(row, "Year", "Start Year");
    createHeader(row, "Age", "Age as of 1-January of the year shown.");
    createHeader(row, "Rank", "The rank of Adjusted Medicare Earnings, where 1 is the highest.");
    createHeader(row, "Average Wage Index (AWI)", "The Average Wage Index (AWI) from https://www.ssa.gov/oact/cola/awifactors.html.");
    createHeader(row, "Fica Earnings", "Your Social Security taxed earnings.");
    createHeader(row, "AWI adjusted Fica Earnings", "Your Social Security taxed earnings, indexed by the AWI.  This is the value Social Security uses to calculate your benifit amount.");
    createHeader(row, "Taxable Maximum", "The maximum taxable income for the year.");
    createHeader(row, "% of Taxable Maximum", "The percent of maximum taxable for the year.");
    createHeader(row, "Medicare Earnings", "Your Medicare taxed earings.");
    createHeader(row, "Inflation adjusted Medicare Earnings", "Your Medicare taxed earings, indexed by the consumer price.");
    createHeader(row, "% Change", "The percent change in your Inflation adjusted Medicare taxed earnings from the prior year that you had earnings (i.e. your inflation adjusted raise).");
}

function createParagraph(div, text)
{
    let pText = document.createTextNode(text);
    var paragaph = document.createElement("p");
    paragaph.appendChild(pText);
    div.appendChild(paragaph);
}

function timeUntil(futureDate) {

    var diff = new Date(futureDate - new Date());
    let yearStr = "";
    if ( diff.getFullYear() > 1970 )
        yearStr = (diff.toISOString().slice(0, 4) - 1970) + " years ";
    return " (in " + yearStr + (diff.getMonth()+1) + " months, " + diff.getDate() + " days)";
}

function setSummaryValue(docId, value)
{
    document.getElementById(docId).innerHTML = value.toLocaleString("en-US", {style:"currency", currency:"USD", maximumFractionDigits:"0"});

}

function getEstimatedBenefit(xmlDoc, key)
{
    let estimatedBenefits = xmlDoc.getElementsByTagName("osss:EstimatedBenefits");
    let estimate = estimatedBenefits[0].getElementsByTagName(key)[0].getElementsByTagName("osss:Estimate")[0].childNodes[0].data;
    return Number(estimate);
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

    let sumAdjustedMedicare = 0;
    for (let [key, value] of sortedMedicareAdjusted)
    {
        sumAdjustedMedicare += value;
    }
    

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

    let medicareMin = 0;
    let medicareMinYear = 0;
    let showMin = false;
    if ( exceededCount < 35 && numYearsWorked >= 35 )
    {
        medicareMin = Array.from(sortedMedicareAdjusted.values())[34];
        medicareMinYear = Array.from(sortedMedicareAdjusted.keys())[34];
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
        document.getElementById("lowestYear").innerHTML = medicareMinYear;
        document.getElementById("lowestIncome").innerHTML = medicareMin.toLocaleString("en-US", {style:"currency", currency:"USD"}) + appendNote;
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

    document.getElementById("totalIncome").innerHTML = sumMedicare.toLocaleString("en-US", {style:"currency", currency:"USD", maximumFractionDigits:"0"});
    document.getElementById("totalIncomeAdjusted").innerHTML = sumAdjustedMedicare.toLocaleString("en-US", {style:"currency", currency:"USD"});

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
    let togo = timeUntil(firstEligibleDate, today);
    document.getElementById("eligible62Date").innerHTML = firstEligibleDate.toLocaleDateString(undefined, options);
    document.getElementById("eligible62Diff").innerHTML = togo;
    togo = timeUntil(lastEligibleDate, today);
    document.getElementById("eligible70Date").innerHTML = lastEligibleDate.toLocaleDateString(undefined, options);
    document.getElementById("eligible70Diff").innerHTML = togo;


    // Get the earnings Record in the XML document
    let earningsRecords = xmlDoc.getElementsByTagName("osss:EarningsRecord");
    let ficaTaxTotalEmployer = Number(earningsRecords[0].getElementsByTagName("osss:FicaTaxTotalEmployer")[0].childNodes[0].data);
    let ficaTaxTotalIndividual = Number(earningsRecords[0].getElementsByTagName("osss:FicaTaxTotalIndividual")[0].childNodes[0].data);
    let medicareTaxTotalEmployer = Number(earningsRecords[0].getElementsByTagName("osss:MedicareTaxTotalEmployer")[0].childNodes[0].data);
    let medicareTaxTotalIndividual = Number(earningsRecords[0].getElementsByTagName("osss:MedicareTaxTotalIndividual")[0].childNodes[0].data);
    document.getElementById("taxTable").style.visibility = "visible";

    // Set the values
    setSummaryValue("fixaemployee", ficaTaxTotalIndividual);
    setSummaryValue("medicareemployee", medicareTaxTotalIndividual);
    setSummaryValue("employeeTotal", ficaTaxTotalIndividual + medicareTaxTotalIndividual);
    setSummaryValue("ficaEmployer", ficaTaxTotalEmployer);
    setSummaryValue("medicareEmployer",medicareTaxTotalEmployer );
    setSummaryValue("employerTotal", ficaTaxTotalEmployer + medicareTaxTotalEmployer);
    setSummaryValue("fixaTotal", ficaTaxTotalIndividual + ficaTaxTotalEmployer);
    setSummaryValue("medicareTotal", medicareTaxTotalIndividual + medicareTaxTotalEmployer);
    setSummaryValue("grandTotal", ficaTaxTotalIndividual + medicareTaxTotalIndividual + ficaTaxTotalEmployer + medicareTaxTotalEmployer);

}

