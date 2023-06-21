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

//https://www.ssa.gov/oact/cola/AWI.html
const wageIndex = new Map();
wageIndex.set(1962,14.1154565);
wageIndex.set(1963,13.7775824);
wageIndex.set(1964,13.2366334);
wageIndex.set(1965,13.0025136);
wageIndex.set(1966,12.2662321);
wageIndex.set(1967,11.6190212);
wageIndex.set(1968,10.8718017);
wageIndex.set(1969,10.2778311);
wageIndex.set(1970,9.7919043);
wageIndex.set(1971,9.3234299);
wageIndex.set(1972,8.4912767);
wageIndex.set(1973,7.9912654);
wageIndex.set(1974,7.5428814);
wageIndex.set(1975,7.0183793);
wageIndex.set(1976,6.5653499);
wageIndex.set(1977,6.1941246);
wageIndex.set(1978,5.7384329);
wageIndex.set(1979,5.2768223);
wageIndex.set(1980,4.8407930);
wageIndex.set(1981,4.3980709);
wageIndex.set(1982,4.1685811);
wageIndex.set(1983,3.9749404);
wageIndex.set(1984,3.7542490);
wageIndex.set(1985,3.6008342);
wageIndex.set(1986,3.4970384);
wageIndex.set(1987,3.2873870);
wageIndex.set(1988,3.1330788);
wageIndex.set(1989,3.0137525);
wageIndex.set(1990,2.8806890);
wageIndex.set(1991,2.7771952);
wageIndex.set(1992,2.6411145);
wageIndex.set(1993,2.6185940);
wageIndex.set(1994,2.5501502);
wageIndex.set(1995,2.4518701);
wageIndex.set(1996,2.3375513);
wageIndex.set(1997,2.2086732);
wageIndex.set(1998,2.0988236);
wageIndex.set(1999,1.9880337);
wageIndex.set(2000,1.8838566);
wageIndex.set(2001,1.8399616);
wageIndex.set(2002,1.8216921);
wageIndex.set(2003,1.7782228);
wageIndex.set(2004,1.6992296);
wageIndex.set(2005,1.6392490);
wageIndex.set(2006,1.5672150);
wageIndex.set(2007,1.4991796);
wageIndex.set(2008,1.4654679);
wageIndex.set(2009,1.4879065);
wageIndex.set(2010,1.4535518);
wageIndex.set(2011,1.4093909);
wageIndex.set(2012,1.3667145);
wageIndex.set(2013,1.3494665);
wageIndex.set(2014,1.3032076);
wageIndex.set(2015,1.2593928);
wageIndex.set(2016,1.2453206);
wageIndex.set(2017,1.2037519);
wageIndex.set(2018,1.1616481);
wageIndex.set(2019,1.1196873);
wageIndex.set(2020,1.0889195);
wageIndex.set(2021,1.0000000);
wageIndex.set(2022,1.0000000);

// https://www.ssa.gov/oact/cola/cbb.html
const maxTaxed = new Map();
maxTaxed.set(1937,3000);
maxTaxed.set(1938,3000);
maxTaxed.set(1939,3000);
maxTaxed.set(1940,3000);
maxTaxed.set(1941,3000);
maxTaxed.set(1942,3000);
maxTaxed.set(1943,3000);
maxTaxed.set(1944,3000);
maxTaxed.set(1945,3000);
maxTaxed.set(1946,3000);
maxTaxed.set(1947,3000);
maxTaxed.set(1948,3000);
maxTaxed.set(1949,3000);
maxTaxed.set(1950,3000);
maxTaxed.set(1951,3600);
maxTaxed.set(1952,3600);
maxTaxed.set(1953,3600);
maxTaxed.set(1954,3600);
maxTaxed.set(1955,4200);
maxTaxed.set(1956,4200);
maxTaxed.set(1957,4200);
maxTaxed.set(1958,4200);
maxTaxed.set(1959,4800);
maxTaxed.set(1960,4800);
maxTaxed.set(1961,4800);
maxTaxed.set(1962,4800);
maxTaxed.set(1963,4800);
maxTaxed.set(1964,4800);
maxTaxed.set(1965,4800);
maxTaxed.set(1966,6600);
maxTaxed.set(1967,6600);
maxTaxed.set(1968,7800);
maxTaxed.set(1969,7800);
maxTaxed.set(1970,7800);
maxTaxed.set(1971,7800);
maxTaxed.set(1972,9000);
maxTaxed.set(1972,9000);
maxTaxed.set(1973,10800);
maxTaxed.set(1974,13200);
maxTaxed.set(1975,14100);
maxTaxed.set(1976,15300);
maxTaxed.set(1977,16500);
maxTaxed.set(1978,17700);
maxTaxed.set(1979,22900);
maxTaxed.set(1980,25900);
maxTaxed.set(1981,29700);
maxTaxed.set(1982,32400);
maxTaxed.set(1983,35700);
maxTaxed.set(1984,37800);
maxTaxed.set(1985,39600);
maxTaxed.set(1986,42000);
maxTaxed.set(1987,43800);
maxTaxed.set(1988,45000);
maxTaxed.set(1989,48000);
maxTaxed.set(1990,51300);
maxTaxed.set(1991,53400);
maxTaxed.set(1992,55500);
maxTaxed.set(1993,57600);
maxTaxed.set(1994,60600);
maxTaxed.set(1995,61200);
maxTaxed.set(1996,62700);
maxTaxed.set(1997,65400);
maxTaxed.set(1998,68400);
maxTaxed.set(1999,72600);
maxTaxed.set(2000,76200);
maxTaxed.set(2001,80400);
maxTaxed.set(2002,84900);
maxTaxed.set(2003,87000);
maxTaxed.set(2004,87900);
maxTaxed.set(2005,90000);
maxTaxed.set(2006,94200);
maxTaxed.set(2007,97500);
maxTaxed.set(2008,102000);
maxTaxed.set(2009,106800);
maxTaxed.set(2010,106800);
maxTaxed.set(2011,106800);
maxTaxed.set(2012,110100);
maxTaxed.set(2013,113700);
maxTaxed.set(2014,117000);
maxTaxed.set(2015,118500);
maxTaxed.set(2016,118500);
maxTaxed.set(2017,127200);
maxTaxed.set(2018,128400);
maxTaxed.set(2019,132900);
maxTaxed.set(2020,137700);
maxTaxed.set(2021,142800);
maxTaxed.set(2022,147000);
maxTaxed.set(2023,160200);

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
    const adjustedFicaMap = new Map();
    let sumMedicare = 0;
    let sumFica = 0;
    let sumIAFica = 0;
    let medicareNotFicaCount = 0;

    // Extract the fica and medicare earnings from the Earnings node of the XML
    if (earningsRecords.length === 1 ) {
        var earnings = earningsRecords[0].getElementsByTagName("osss:Earnings");
        for ( j = 0; j < earnings.length; j++ ) {
            var earning = earnings[j];

            // Fetch the year attributes, fica and medicare amounts
            var endYear = Number(earning.getAttribute("endYear"));
            //var startYear = Number(earning.getAttribute("startYear"));
            var fica = Number(earning.getElementsByTagName("osss:FicaEarnings")[0].childNodes[0].data);
            var medicare = Number(earning.getElementsByTagName("osss:MedicareEarnings")[0].childNodes[0].data);
            if ( fica == 0 )
                continue;

            if ( fica === medicare )
                medicareNotFicaCount++;
            
            let curIndex = wageIndex.get(endYear);

            sumFica += fica;
            sumIAFica += curIndex * fica;
            sumMedicare += medicare;

            ficaMap.set(endYear, fica);
            medicareMap.set(endYear, medicare);
            adjustedMedicareMap.set(endYear, medicare * curIndex);
            adjustedFicaMap.set(endYear, fica * curIndex);

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
        }

        // Create the table
        let caption = earningsTable.createCaption();
        caption.textContent = userName;
        var body = document.createElement("TBODY");
        earningsTable.appendChild(body);

        let lastYearEarnings = 0;
        for (let [key, value] of ficaMap) {
            let index = wageIndex.get(key);
            let rank = sortedKeys.findIndex(year => year === key);
            let curMedicare = medicareMap.get(key);
            let percentChange = (curMedicare - lastYearEarnings) / lastYearEarnings;
            addRowToEarningsTable(body, birthDate, key, value, curMedicare, percentChange, index, index * value, index * curMedicare, rank + 1, medicareNotFicaCount);
            lastYearEarnings = curMedicare;
        }

        var statisticsDiv = document.getElementById("statistics");
        createStatisticsOutput(statisticsDiv, xmlDoc, ficaMap, sortedMedicare, medicareMap);
        
        // Scroll to the output div
        document.getElementById("outputStart").scrollIntoView(true, { behavior: "smooth" });


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
            paging:         false
        });
        tableInitialized = true;

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

function addRowToEarningsTable(earningsTable, bdate, year, fica, medicare, medicarePercent, indexingFactor, ifica, imedicare, rank, medicareNotFicaCount) {
    var row = document.createElement("TR");
    earningsTable.appendChild(row);

    // Add the row header
    var td = document.createElement("TD");
    var cell = document.createTextNode(year);
    td.appendChild(cell);
    row.appendChild(td);

    // Create the age cell
    let curDate = new Date(year,1,1);
    let age = curDate.getFullYear() - bdate.getFullYear();
    td = document.createElement("TD");
    cell = document.createTextNode(age);
    td.appendChild(cell);
    row.appendChild(td);

    // Create the rank cell
    td = document.createElement("TD");
    cell = document.createTextNode(rank);
    td.appendChild(cell);
    if ( rank <= 35 ) {
        row.classList.add("top35");
    }
    else {
        row.classList.add("not35");
    }
    row.appendChild(td);
    
    // Create the index cell
    td = document.createElement("TD");
    let index = Number(wageIndex.get(year));
    cell = document.createTextNode(index);
    td.appendChild(cell);
    row.appendChild(td);

    // Create the fica cell
    td = document.createElement("TD");
    let dollars = fica.toLocaleString("en-US", {style:"currency", currency:"USD"});

    cell = document.createTextNode(dollars);
    td.appendChild(cell);
    row.appendChild(td);

    // Create the inflation adjusted fica cell
    td = document.createElement("TD");
    dollars = (ifica).toLocaleString("en-US", {style:"currency", currency:"USD"});
    cell = document.createTextNode(dollars);
    td.appendChild(cell);
    row.appendChild(td);

    // Create the max taxed cell
    td = document.createElement("TD");
    let curMaxTaxed =  Number(maxTaxed.get(year));
    let pct = curMaxTaxed.toLocaleString("en-US", {style:"currency", currency:"USD"});
    cell = document.createTextNode(pct);
    td.appendChild(cell);
    row.appendChild(td);

    // Create the percent of max taxed cell
    td = document.createElement("TD");
    if ( isNaN(fica) || ! isFinite(fica) ) {
        cell = document.createTextNode("");
    }
    else {
        let pct = (fica / curMaxTaxed).toLocaleString("en-US", {style:"percent"});
        cell = document.createTextNode(pct);
    }
    td.appendChild(cell);
    row.appendChild(td);

    // Create the medicare cell
    if ( medicareNotFicaCount > 0 )
    {
        td = document.createElement("TD");
        dollars = medicare.toLocaleString("en-US", {style:"currency", currency:"USD"});
        cell = document.createTextNode(dollars);
        if ( medicare === fica )
        {
            td.classList.add("same");
        }
        td.appendChild(cell);
        row.appendChild(td);

        // Create the inflation adjusted medicare cell
        td = document.createElement("TD");
        dollars = (imedicare).toLocaleString("en-US", {style:"currency", currency:"USD"});
        cell = document.createTextNode(dollars);
        if ( medicare === fica )
        {
            td.classList.add("same");
        }
        td.appendChild(cell);
        row.appendChild(td);
    }

    // Create the percent change cell
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

function calculateSum(inMap) {
    if ( inMap instanceof Map )
    {
        let sum = 0;
        for (let [key, value] of inMap) {
            sum += value;
        }

        return sum;

    } else
        return NaN;
}



function calculateMean(inMap) {
    if ( inMap instanceof Map )
    {
        let sum = 0;
        let length = 0;
        for (let [key, value] of inMap) {
            sum += value;
            length += 1;
        }

        return sum / length;

    } else
        return NaN;
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
    createHeader(row, "Rank", "The rank of Adjusted Medicare Earnings, where 1 is the highest");
    createHeader(row, "Indexing Factor", "The inflation factor, or National Average Wage Index from https://www.ssa.gov/oact/cola/awifactors.html");
    createHeader(row, "Fica Earnings", "Your Social Security taxed earnings");
    createHeader(row, "Adjusted Fica Earnings", "Your Social Security taxed earnings, indexed for inflation");
    createHeader(row, "Maximum Taxable", "The maximum taxable income for the year");
    createHeader(row, "% of Max Taxed", "The percent of maximum taxable for the year");
    createHeader(row, "Medicare Earnings", "Your Medicare taxed earings");
    createHeader(row, "Adjusted Medicare Earnings", "Your Medicare taxed earings, indexed for inflation");
    createHeader(row, "% Change", "The percent change in your Medicare taxed earnings from the prior year (i.e. your inflation adjusted raise)");
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
        if ( maxTaxed.has(key) )
        {
            if ( maxTaxed.get(key) <= value )
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

    let adjustedMedicareMax = Array.from(sortedMedicareAdjusted.values())[0];
    let adjustedMedicareMaxYear = Array.from(sortedMedicareAdjusted.keys())[0];

    let appendNote = "";
    if ( medicareMaxYear === adjustedMedicareMaxYear && medicareMax !== adjustedMedicareMax )
        appendNote = " (" + adjustedMedicareMax.toLocaleString("en-US", {style:"currency", currency:"USD"}) + " inflation adjusted)";
    
    document.getElementById("highestYear").innerHTML = medicareMaxYear;
    document.getElementById("highestedIncome").innerHTML = medicareMax.toLocaleString("en-US", {style:"currency", currency:"USD"}) + appendNote;
    
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

    document.getElementById("totalIncome").innerHTML = sumMedicare.toLocaleString("en-US", {style:"currency", currency:"USD"});
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
    document.getElementById("fixaemployee").innerHTML = ficaTaxTotalIndividual.toLocaleString("en-US", {style:"currency", currency:"USD"});
    document.getElementById("medicareemployee").innerHTML = medicareTaxTotalIndividual.toLocaleString("en-US", {style:"currency", currency:"USD"});
    document.getElementById("employeeTotal").innerHTML = (ficaTaxTotalIndividual + medicareTaxTotalIndividual).toLocaleString("en-US", {style:"currency", currency:"USD"});
    document.getElementById("ficaEmployer").innerHTML = ficaTaxTotalEmployer.toLocaleString("en-US", {style:"currency", currency:"USD"});
    document.getElementById("medicareEmployer").innerHTML = medicareTaxTotalEmployer.toLocaleString("en-US", {style:"currency", currency:"USD"});
    document.getElementById("employerTotal").innerHTML = (ficaTaxTotalEmployer + medicareTaxTotalEmployer).toLocaleString("en-US", {style:"currency", currency:"USD"});
    document.getElementById("fixaTotal").innerHTML = (ficaTaxTotalIndividual + ficaTaxTotalEmployer).toLocaleString("en-US", {style:"currency", currency:"USD"});
    document.getElementById("medicareTotal").innerHTML = (medicareTaxTotalIndividual + medicareTaxTotalEmployer).toLocaleString("en-US", {style:"currency", currency:"USD"});
    document.getElementById("grandTotal").innerHTML = (ficaTaxTotalIndividual + medicareTaxTotalIndividual + ficaTaxTotalEmployer + medicareTaxTotalEmployer).toLocaleString("en-US", {style:"currency", currency:"USD"});;
    
}

