(function() {

  "use strict";

  // URL for this js to query
  let url = "analyze.php?type=all";
  let urlUsa = "analyze.php?type=usa";
  let urlRussia = "analyze.php?type=russia";
  let deleteUrl = "delete.php?type=delete";
  let rendUrl = "analyze.php?points";

  window.addEventListener("load", init);


  /*
   * Initializes given methods when the page loads
   */
  function init() {
    let allGraph = document.getElementById("all");
    allGraph.addEventListener("click", makeAll);
    let usaGraph = document.getElementById("usa");
    usaGraph.addEventListener("click", makeUsa);
    let russiaGraph = document.getElementById("russia");
    russiaGraph.addEventListener("click", makeRussia);
    let deleteData = document.getElementById("delete");
    deleteData.addEventListener("click", deleteAll);
    let renderGraph = document.getElementById("render");
    renderGraph.addEventListener("click", rendGraph);
  }

  // Deletes all data in the server
  function deleteAll() {
    fetch(deleteUrl)
      .then(checkStatus)
      .then(JSON.parse)
      .then(printMessage)
      .catch(console.error());
  }

  // Checks to see whether there are data for the html to render
  function rendGraph() {
    fetch(rendUrl)
      .then(checkStatus)
      .then(JSON.parse)
      .then(rendDet)
      .then(console.error());
  }

  // If there are no rows in the database(no data), alerts the user
  // Else, displays the hidden buttons
  function rendDet(data) {
    if (data["COUNT(*)"] != 0) {
      let theDisplay = document.getElementById("buttons");
      theDisplay.classList.remove("hidden");
    } else {
      window.alert("No data to plot.");
    }
  }

  // Queries for all satellite data
  function makeAll() {
    let theGraph = document.getElementById("tester");
    theGraph.classList.toggle("hidden");
    fetch(url)
      .then(checkStatus)
      .then(JSON.parse)
      .then(makeGraph)
      .catch(console.error());
  }

  // Queries for American satellite data
  function makeUsa() {
    let theGraph = document.getElementById("tester");
    theGraph.classList.toggle("hidden");
    fetch(urlUsa)
      .then(checkStatus)
      .then(JSON.parse)
      .then(makeGraph)
      .catch(console.error());
  }

  // Queries for Russain satellite data
  function makeRussia() {
    let theGraph = document.getElementById("tester");
    theGraph.classList.toggle("hidden");
    fetch(urlRussia)
      .then(checkStatus)
      .then(JSON.parse)
      .then(makeGraph)
      .catch(console.error());
  }

  // Checks the status of what's returned from the server
  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response.text();
    } else {
      return Promise.reject(new Error(response.status + ": " + response.statusText));
    }
  }

  // Alerts a user once the data is removed/no data to remove
  function printMessage(data) {
    if (data["rows"] === 0) {
      window.alert("No data to remove");
    } else {
      window.alert(data["success"]);
    }
  }

  // Makes a graph according to the data
  function makeGraph(data) {
    let rusTimeArray = [];
    let rusSatArray = [];
    let usTimeArray = [];
    let usSatArray = [];
    let jsonNum = data["Information"].length;
    let plotPoint = data["Information"];
    let indicator = 0;
    for (let i = 0; i < jsonNum; i++) {
      if (plotPoint[i]["Type"] >= 200) {
        rusTimeArray.push(Math.round((((plotPoint[i]["Times"]) % 86400) / 3600) * 1000) / 1000);
        rusSatArray.push(parseInt(plotPoint[i]["Satellite"]) + 32);
        indicator++;
      } else {
        usTimeArray.push(Math.round((((plotPoint[i]["Times"]) % 86400) / 3600) * 1000) / 1000);
        usSatArray.push(plotPoint[i]["Satellite"]);
        indicator++;
      }
    }
    // Prints a respective graph depending on the number of indicators
    if (indicator > 30000) {
      makePlot(rusSatArray, rusTimeArray, usSatArray, usTimeArray);
    } else if (indicator > 20000) {
      makeUs(usSatArray, usTimeArray);
    } else if (indicator < 20000) {
      makeRus(rusSatArray, rusTimeArray);
    }
  }

  // Makes plots for all satellites
  function makePlot(rusSatArray, rusTimeArray, usSatArray, usTimeArray) {
    let Tester = document.getElementById("tester");

    // For Russian satellite
    let trace1 = {
      x: rusTimeArray,
      y: rusSatArray,
      mode: 'markers',
      type: 'scatter',
      name: 'GLONASS',
      marker: {
        size: 5,
        color: 'Blue',
        opacity: 0.1
      },
      hoverinfo: 'none'
    };
    // For American satellite
    let trace2 = {
      x: usTimeArray,
      y: usSatArray,
      mode: 'markers',
      type: 'scatter',
      name: 'GPS',
      marker: {
        size: 5,
        color: 'Red',
        opacity: 0.1
      },
      hoverinfo: 'none'
    };
    let layout = {
      width: 5000,
      height: 5000,
      margin: {
        l: 100,
        r: 100,
        b: 100,
        t: 100,
        pad: 4
      },
      paper_bgcolor: 'White',
      xaxis: {
        title: 'Time',
        titlefont: {
          size: 30
        },
        tickfont: {
          size: 20
        },
        tickangle: 45
      },
      yaxis: {
        title: 'Satellite',
        titlefont: {
          size: 30
        },
        tickfont: {
          size: 20
        },
        tickangle: 45,
        dtick: 1
      },
    };

    let data = [trace1, trace2];
    Plotly.newPlot(Tester, data, layout, {showSendToCloud: true});
  }

  // Plot for US satellites
  function makeUs(usSatArray, usTimeArray) {
    let Tester = document.getElementById("tester");
    let trace = {
      x: usTimeArray,
      y: usSatArray,
      mode: 'markers',
      type: 'scatter',
      name: 'GPS',
      marker: {
        size: 10,
        color: 'Red',
        opacity: 0.2
      },
      hoverinfo: 'none'
    };
    let layout = {
      width: 5000,
      height: 5000,
      margin: {
        l: 100,
        r: 100,
        b: 100,
        t: 100,
        pad: 4
      },
      paper_bgcolor: 'White',
      textfont: {
        family: 'Times New Roman'
      },
      xaxis: {
        title: 'Time',
        titlefont: {
          size: 30
        },
        ticks: 'inside',
        tickfont: {
          size: 20
        },
        tickangle: 45
      },
      yaxis: {
        title: 'Satellite',
        titlefont: {
          size: 30
        },
        ticks: 'inside',
        tickfont: {
          size: 20
        },
        tickangle: 45
      }
    };
    let data = [trace];
    Plotly.newPlot(Tester, data, layout, {showSendToCloud: true});
  }

  // Plot for Russian satellites
  function makeRus(rusSatArray, rusTimeArray) {
    let Tester = document.getElementById("tester");
    let trace = {
      x: rusTimeArray,
      y: rusSatArray,
      mode: 'markers',
      type: 'scatter',
      name: 'GLONASS',
      marker: {
        size: 10,
        color: 'Blue',
        opacity: 0.2
      },
      hoverinfo: 'none'
    };
    let layout = {
      width: 5000,
      height: 5000,
      margin: {
        l: 100,
        r: 100,
        b: 100,
        t: 100,
        pad: 4
      },
      paper_bgcolor: 'White',
      textfont: {
        family: 'Times New Roman'
      },
      xaxis: {
        title: 'Time',
        titlefont: {
          size: 30
        },
        ticks: 'inside',
        tickfont: {
          size: 20
        },
        tickangle: 45
      },
      yaxis: {
        title: 'Satellite',
        titlefont: {
          size: 30
        },
        ticks: 'inside',
        tickfont: {
          size: 20
        },
        tickangle: 45
      }
    };
    let data = [trace];
    Plotly.newPlot(Tester, data, layout, {showSendToCloud: true});
  }

})();
