// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = { top: 40, right: 100, bottom: 40, left: 175 };

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = MAX_WIDTH / 2 - 10,
  graph_1_height = 250;
let graph_2_width = MAX_WIDTH / 2 - 10,
  graph_2_height = 275;
let graph_3_width = MAX_WIDTH / 2,
  graph_3_height = 575;

let start_date_2018 = new Date("2018-6-14");
let end_date_2018 = new Date("2018-7-15");
let start_date_2014 = new Date("2014-6-12");
let end_date_2014 = new Date("2014-7-13");
let start_date_2010 = new Date("2010-6-11");
let end_date_2010 = new Date("2010-7-11");

/*
date        home_team  away_team  home_score  away_score  tournament  city     country   neutral
1872-11-30  Scotland   England    0           0           Friendly    Glasgow  Scotland  FALSE
*/

/*
Part 1
Your boss wants to know the number of football games by year. 
You should show at minimum 5 years, but you can choose which years to show
*/

/* 
Body and header style transition
*/
const t = d3.transition().duration(4000);
d3.select("body").transition(t).style("background-color", "#f7e0e2");
d3.select("h3").transition(t).style("color", "#0e0f19");

// var div = d3
//   .select("body")
//   .append("div")
//   .attr("class", "tooltip")
//   .style("opacity", 0);

const fileName = "./data/football.csv";

let svg = d3
  .select("#graph1")
  .append("svg")
  .attr("width", graph_1_width)
  .attr("height", graph_1_height)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

console.log("Graph 1 width: " + graph_1_width); // 530
console.log("Graph 1 height: " + graph_1_height); // 250

let svg2 = d3
  .select("#graph2")
  .append("svg")
  .attr("width", graph_2_width)
  .attr("height", graph_2_height)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

let svg3 = d3
  .select("#graph3")
  .append("svg")
  .attr("width", graph_3_width + margin.left + margin.right)
  .attr("height", graph_3_height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

console.log("Graph 3 width: " + graph_3_width); // 840
console.log("Graph 3 height: " + graph_3_height); // 575

let countRef = svg.append("g");

d3.csv(fileName).then(function (data) {
  data = cleanData(data, (a, b) => {
    let aDate = parseInt(a.date.split("-")[0]);
    let bDate = parseInt(b.date.split("-")[0]);
    // console.log("aDate, bDate: " + aDate, bDate);
    return bDate - aDate;
  });

  let count2016 = 0;
  let count2017 = 0;
  let count2018 = 0;
  let count2019 = 0;
  let count2020 = 0;

  data.forEach((row) => {
    row.year = getYear(row);

    switch (row.year) {
      case 2020:
        count2020++;
        break;
      case 2019:
        count2019++;
        break;
      case 2018:
        count2018++;
        break;
      case 2017:
        count2017++;
        break;
      case 2016:
        count2016++;
        break;
      default:
        break;
    }
  });

  let countStore = {
    2020: count2020,
    2019: count2019,
    2018: count2018,
    2017: count2017,
    2016: count2016,
  };

  countStore = d3.map(countStore);

  let maxElement = Math.max(
    count2016,
    count2017,
    count2018,
    count2019,
    count2020
  );
  console.log("Max element: " + maxElement);

  let rangeX = graph_1_width - margin.left - margin.right;
  console.log("Range X: " + rangeX);

  rangeY = graph_1_height - margin.bottom - margin.top;
  console.log("Range Y: " + rangeY);

  let x = d3.scaleLinear().domain([0, maxElement]).range([0, rangeX]);

  let y = d3
    .scaleBand()
    .domain(["2016", "2017", "2018", "2019", "2020"])
    .range([0, rangeY])
    .padding(0.1);

  let y_axis = d3.axisLeft(y).tickSize(0).tickPadding(10);

  svg.append("g").call(y_axis);

  let bars = svg.selectAll("rect").data(countStore.entries(), function (d) {
    return d.keys;
  });

  let color = d3
    .scaleOrdinal()
    .domain(["2020", "2019", "2018", "2107", "2016"])
    .range(d3.quantize(d3.interpolateHcl("#81a684", "#466060"), 5));

  bars
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("fill", function (d) {
      return color(d.key);
    })
    .transition(t)
    .attr("x", x(0))
    .attr("width", function (d) {
      return x(d.value);
    })
    .attr("y", function (d) {
      return y(d.key);
    })
    .attr("height", y.bandwidth());

  let counts = countRef
    .selectAll("text")
    .data(countStore.entries(), function (d) {
      return d.keys;
    });

  counts
    .enter()
    .append("text")
    .merge(counts)
    .transition(t)
    .attr("x", function (d) {
      return x(d.value) + 5;
    })
    .attr("y", function (d) {
      return y(d.key) + 20;
    })
    .style("text-anchor", "start")
    .text(function (d) {
      return d.value;
    });

  let distY = 190;
  let distX = -90;

  svg
    .append("text")
    .attr("transform", `translate(${margin.left + 45}, ${distY})`)
    .style("text-anchor", "middle")
    .text("Count");

  svg
    .append("text")
    .attr("transform", `translate(${distX + 10}, ${margin.top + 50})`)
    .style("text-anchor", "middle")
    .text("Year");

  svg
    .append("text")
    .attr("transform", `translate(${margin.left + 40}, ${margin.top - 60})`)
    .style("text-anchor", "middle")
    .style("font-size", 15)
    .text("Number Of Intl. Football Games Per Year (2016 - 2020)");

  /*
Part 2
Your boss wants to understand the top winning nations.
Winning percentage for the top 10 nations.
Map Form.
*/

  /*
date        home_team  away_team  home_score  away_score  tournament  city     country   neutral
1872-11-30  Scotland   England    0           0           Friendly    Glasgow  Scotland  FALSE
*/

  let threshold = 500;
  let gameCounts = {};
  let winCounts = {};
  let winPercentages = {};

  console.log("Graph 2 width: " + graph_2_width); // 582.5
  console.log("Graph 2 height: " + graph_2_height); // 275

  data.forEach((d) => {
    let home_team = d.home_team;
    let away_team = d.away_team;

    if (!(home_team in gameCounts)) {
      gameCounts[home_team] = 0;
    }
    if (!(away_team in gameCounts)) {
      gameCounts[away_team] = 0;
    }
    if (!(home_team in winCounts)) {
      winCounts[home_team] = 0;
    }
    if (!(away_team in winCounts)) {
      winCounts[away_team] = 0;
    }

    gameCounts[home_team] = gameCounts[home_team] + 1;
    gameCounts[away_team] = gameCounts[away_team] + 1;

    if (d.home_score > d.away_score) {
      winCounts[home_team] = winCounts[home_team] + 1;
    } else if (d.away_score > d.home_score) {
      winCounts[away_team] = winCounts[away_team] + 1;
    }
  });

  for (var key in winCounts) {
    if (gameCounts[key] > threshold) {
      winPercentages[key] = winCounts[key] / gameCounts[key];
    }
  }

  let topWinningTeams = {};
  topWinningTeams = sort_slice__object(winPercentages);
  console.log("Top winning teams obj: " + JSON.stringify(topWinningTeams));

  /*
  NOTE: 
  As seen via the ABOVE LOG to the console, I am able to clean and organize the required data.
  However, I was struggling with both, trying to render a choropleth map with the color weights 
  mapped to the winning percentage values, as well as trying a different approach wherein I tried 
  to scrape data off a site (https://developers.google.com/public-data/docs/canonical/countries_csv)
  in order to get the latitude and longitude of the countries so that I could place markers on my map.
  Due to the above two implementations failing and lack of time to continue trying, I ended up 
  hard-coding the latitude and longitude of the countries below. 
  I understand the loss of points incurred.
  */
  var markers = [
    { long: -51.92528, lat: -14.235004 }, // brazil
    { long: -3.74922, lat: 40.463667 }, // spain
    { long: 10.451526, lat: 51.165691 }, // germany
    { long: -3.435973, lat: 55.378051 }, // uk
    { long: -63.616672, lat: -38.416097 }, // argentina
    { long: 12.56738, lat: 41.87194 }, // italy
    { long: 127.766922, lat: 35.907757 }, // south korea
    { long: 105.318756, lat: 61.52401 }, // russia
    { long: 5.291266, lat: 52.132633 }, // netherlands
    { long: -102.552784, lat: 23.634501 }, // mexico
  ];
  var projection = d3
    .geoNaturalEarth()
    .scale(graph_2_width / 2 / Math.PI)
    .translate([graph_2_width / 5, graph_2_height / 2]);

  // Load external data and boot
  d3.json(
    "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
  ).then(function (data) {
    svg2
      .append("g")
      .selectAll("path")
      .data(data.features)
      .enter()
      .append("path")
      .attr("fill", "#466060")
      .attr("d", d3.geoPath().projection(projection))
      .style("stroke", "#fff");

    svg2
      .selectAll("myCircles")
      .data(markers)
      .enter()
      .append("circle")
      // .transition(t)
      .attr("cx", function (d) {
        return projection([d.long, d.lat])[0];
      })
      .attr("cy", function (d) {
        return projection([d.long, d.lat])[1];
      })
      .attr("r", 5)
      .style("fill", "#ff6663")
      .attr("stroke", "#ff6663")
      .attr("stroke-width", 3)
      .attr("fill-opacity", 0.4)
      .on("mouseover", function () {
        return tooltip.style("visibility", "visible");
      })
      .on("mouseover", function (d) {
        d3.select(this).transition().duration(1000).attr("stroke-width", 50);
      })
      .on("mouseout", function () {
        d3.select(this).transition().duration(1000).attr("stroke-width", 3);
      });
  });

  /*
Part 3
We are trying to bet on which team will win the world cup 2022.
Over the last 2 world cups, which teams were top performing. 
Winning percentage in the world cup OR victory strength, strength of opponent.
*/

  /*
date        home_team  away_team  home_score  away_score  tournament  city     country   neutral
1872-11-30  Scotland   England    0           0           Friendly    Glasgow  Scotland  FALSE
*/

  // Last 2 world cups: 2018, 2014

  let wc_gameCounts = {};
  let wc_winCounts = {};
  let wc_winPercentages = {};
  let wc_threshold = 5;

  data.forEach((d) => {
    let game_date = new Date(d.date);
    let start_date_2018 = new Date("2018-6-14");
    let end_date_2018 = new Date("2018-7-15");
    let start_date_2014 = new Date("2014-6-12");
    let end_date_2014 = new Date("2014-7-13");

    if (
      (game_date >= start_date_2018 && game_date <= end_date_2018) ||
      (game_date >= start_date_2014 && game_date <= end_date_2014)
    ) {
      let wc_home_team = d.home_team;
      let wc_away_team = d.away_team;

      if (!(wc_home_team in wc_gameCounts)) {
        wc_gameCounts[wc_home_team] = 0;
      }
      if (!(wc_away_team in wc_gameCounts)) {
        wc_gameCounts[wc_away_team] = 0;
      }
      if (!(wc_home_team in wc_winCounts)) {
        wc_winCounts[wc_home_team] = 0;
      }
      if (!(wc_away_team in wc_winCounts)) {
        wc_winCounts[wc_away_team] = 0;
      }

      wc_gameCounts[wc_home_team] = wc_gameCounts[wc_home_team] + 1;
      wc_gameCounts[wc_away_team] = wc_gameCounts[wc_away_team] + 1;

      if (d.home_score > d.away_score) {
        wc_winCounts[wc_home_team] = wc_winCounts[wc_home_team] + 1;
      } else if (d.away_score > d.home_score) {
        wc_winCounts[wc_away_team] = wc_winCounts[wc_away_team] + 1;
      }
    }
  });

  for (var key in wc_winCounts) {
    if (wc_gameCounts[key] > wc_threshold) {
      wc_winPercentages[key] = wc_winCounts[key] / wc_gameCounts[key];
    }
  }

  let wc_topWinningTeams = {};
  wc_topWinningTeams = sort_slice__object(wc_winPercentages);

  console.log(
    "Top world cup winning teams obj: " + JSON.stringify(wc_topWinningTeams)
  );

  let myWords = [];

  Object.keys(wc_topWinningTeams).forEach(function (key) {
    myWords.push({
      word: key,
      size: parseFloat(
        wc_winPercentages[key] > 0.7
          ? wc_winPercentages[key] * 70
          : wc_winPercentages[key] * 35
      ),
    });
  });

  console.log("myWords: " + myWords[0].word + ", " + myWords[0].size);

  var layout = d3.layout
    .cloud()
    .size([graph_3_width, graph_3_height])
    .words(
      myWords.map(function (d) {
        return { text: d.word, size: d.size };
      })
    )
    .padding(5)
    .rotate(function () {
      return ~~(Math.random() * 2) * 90;
    })
    .fontSize(function (d) {
      return d.size;
    })
    .on("end", draw);

  layout.start();

  function draw(words) {
    svg3
      .append("g")
      .attr(
        "transform",
        "translate(" + layout.size()[0] / 5 + "," + layout.size()[1] / 3 + ")"
      )
      .selectAll("text")
      .data(words)
      .enter()
      .append("text")
      .style("font-size", function (d) {
        return d.size;
      })
      .style("fill", "#466060")
      .transition(t)
      .attr("text-anchor", "middle")
      .style("font-family", "Impact")
      .attr("transform", function (d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function (d) {
        return d.text;
      });
  }
});

function cleanData(data, comparator) {
  data = data.sort(comparator);
  return data;
}

function getYear(row) {
  return parseInt(row.date.split("-")[0]);
}

function sort_slice__object(obj) {
  items = Object.keys(obj).map(function (key) {
    return [key, obj[key]];
  });
  items.sort(function (first, second) {
    return second[1] - first[1];
  });

  sorted_obj = {};

  items = items.slice(0, 10);

  items.forEach(function (k, v) {
    use_key = String(k).split(",")[0];
    use_value = String(k).split(",")[1];
    sorted_obj[use_key] = use_value;
  });

  return sorted_obj;
}

function renderGraph3(is2018, is2014) {
  console.log(is2018, is2014);

  d3.csv(fileName).then(function (data) {
    data = cleanData(data, (a, b) => {
      let aDate = parseInt(a.date.split("-")[0]);
      let bDate = parseInt(b.date.split("-")[0]);
      // console.log("aDate, bDate: " + aDate, bDate);
      return bDate - aDate;
    });

    svg3.selectAll("*").remove();
    document.getElementById("graph3").innerHTML = "";

    svg3 = d3
      .select("#graph3")
      .append("svg")
      .attr("width", graph_3_width + margin.left + margin.right)
      .attr("height", graph_3_height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    console.log("Graph 3 width: " + graph_3_width); // 840
    console.log("Graph 3 height: " + graph_3_height); // 575

    let wc_gameCounts = {};
    let wc_winCounts = {};
    let wc_winPercentages = {};
    let wc_threshold = 5;

    data.forEach((d) => {
      let game_date = new Date(d.date);

      if (is2018 && is2014) {
        if (
          (game_date >= start_date_2018 && game_date <= end_date_2018) ||
          (game_date >= start_date_2014 && game_date <= end_date_2014)
        ) {
          let wc_home_team = d.home_team;
          let wc_away_team = d.away_team;

          if (!(wc_home_team in wc_gameCounts)) {
            wc_gameCounts[wc_home_team] = 0;
          }
          if (!(wc_away_team in wc_gameCounts)) {
            wc_gameCounts[wc_away_team] = 0;
          }
          if (!(wc_home_team in wc_winCounts)) {
            wc_winCounts[wc_home_team] = 0;
          }
          if (!(wc_away_team in wc_winCounts)) {
            wc_winCounts[wc_away_team] = 0;
          }

          wc_gameCounts[wc_home_team] = wc_gameCounts[wc_home_team] + 1;
          wc_gameCounts[wc_away_team] = wc_gameCounts[wc_away_team] + 1;

          if (d.home_score > d.away_score) {
            wc_winCounts[wc_home_team] = wc_winCounts[wc_home_team] + 1;
          } else if (d.away_score > d.home_score) {
            wc_winCounts[wc_away_team] = wc_winCounts[wc_away_team] + 1;
          }
        }
      } else if (is2018 && !is2014) {
        if (game_date >= start_date_2018 && game_date <= end_date_2018) {
          let wc_home_team = d.home_team;
          let wc_away_team = d.away_team;

          if (!(wc_home_team in wc_gameCounts)) {
            wc_gameCounts[wc_home_team] = 0;
          }
          if (!(wc_away_team in wc_gameCounts)) {
            wc_gameCounts[wc_away_team] = 0;
          }
          if (!(wc_home_team in wc_winCounts)) {
            wc_winCounts[wc_home_team] = 0;
          }
          if (!(wc_away_team in wc_winCounts)) {
            wc_winCounts[wc_away_team] = 0;
          }

          wc_gameCounts[wc_home_team] = wc_gameCounts[wc_home_team] + 1;
          wc_gameCounts[wc_away_team] = wc_gameCounts[wc_away_team] + 1;

          if (d.home_score > d.away_score) {
            wc_winCounts[wc_home_team] = wc_winCounts[wc_home_team] + 1;
          } else if (d.away_score > d.home_score) {
            wc_winCounts[wc_away_team] = wc_winCounts[wc_away_team] + 1;
          }
        }
      } else if (is2014 && !is2018) {
        if (game_date >= start_date_2014 && game_date <= end_date_2014) {
          let wc_home_team = d.home_team;
          let wc_away_team = d.away_team;

          if (!(wc_home_team in wc_gameCounts)) {
            wc_gameCounts[wc_home_team] = 0;
          }
          if (!(wc_away_team in wc_gameCounts)) {
            wc_gameCounts[wc_away_team] = 0;
          }
          if (!(wc_home_team in wc_winCounts)) {
            wc_winCounts[wc_home_team] = 0;
          }
          if (!(wc_away_team in wc_winCounts)) {
            wc_winCounts[wc_away_team] = 0;
          }

          wc_gameCounts[wc_home_team] = wc_gameCounts[wc_home_team] + 1;
          wc_gameCounts[wc_away_team] = wc_gameCounts[wc_away_team] + 1;

          if (d.home_score > d.away_score) {
            wc_winCounts[wc_home_team] = wc_winCounts[wc_home_team] + 1;
          } else if (d.away_score > d.home_score) {
            wc_winCounts[wc_away_team] = wc_winCounts[wc_away_team] + 1;
          }
        }
      } else {
        document.getElementById(
          "graph3"
        ).innerHTML = `<br><p style="font-size: large; font-style: bold; margin-left: 270px">Please select a checkbox!</p>`;
      }
    });

    for (var key in wc_winCounts) {
      if (wc_gameCounts[key] > wc_threshold) {
        wc_winPercentages[key] = wc_winCounts[key] / wc_gameCounts[key];
      }
    }

    let wc_topWinningTeams = {};
    wc_topWinningTeams = sort_slice__object(wc_winPercentages);

    console.log(
      "Top world cup winning teams obj: " + JSON.stringify(wc_topWinningTeams)
    );

    let myWords = [];

    Object.keys(wc_topWinningTeams).forEach(function (key) {
      myWords.push({
        word: key,
        size: parseFloat(
          wc_winPercentages[key] > 0.7
            ? wc_winPercentages[key] * 70
            : wc_winPercentages[key] * 35
        ),
      });
    });

    console.log("myWords: " + myWords[0].word + ", " + myWords[0].size);

    var layout = d3.layout
      .cloud()
      .size([graph_3_width, graph_3_height])
      .words(
        myWords.map(function (d) {
          return { text: d.word, size: d.size };
        })
      )
      .padding(5)
      .rotate(function () {
        return ~~(Math.random() * 2) * 90;
      })
      .fontSize(function (d) {
        return d.size;
      })
      .on("end", draw);

    layout.start();

    function draw(words) {
      svg3
        .append("g")
        .attr(
          "transform",
          "translate(" + layout.size()[0] / 5 + "," + layout.size()[1] / 3 + ")"
        )
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-size", function (d) {
          return d.size;
        })
        .style("fill", "#466060")
        .transition(t)
        .attr("text-anchor", "middle")
        .style("font-family", "Impact")
        .attr("transform", function (d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function (d) {
          return d.text;
        });
    }
  });
}

var checkbox2018 = document.getElementById("checkbox2018");
var checkbox2014 = document.getElementById("checkbox2014");

checkbox2018.addEventListener("change", function () {
  renderGraph3(checkbox2018.checked, checkbox2014.checked);
});

checkbox2014.addEventListener("change", function () {
  renderGraph3(checkbox2018.checked, checkbox2014.checked);
});
