import React, { Component } from 'react';
import './App.css';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4geodata_usaLow from "@amcharts/amcharts4-geodata/usaLow";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import Papa from 'papaparse';
import zipcodes from 'zipcodes';
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
import {Typeahead} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

var csv = require('./data.csv');
const dataObjects = [];
const states = [];
const schools = [];

am4core.useTheme(am4themes_animated);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      data: null,
      university: "",
      grantamt: "",
    };
    this.renderMap = this.renderMap.bind(this);
    this.renderSchoolData = this.renderSchoolData.bind(this);
    this.loadData = this.loadData.bind(this);
    this.dataCallback = this.dataCallback.bind(this);
    this.renderChart = this.renderChart.bind(this);
  }

  dataCallback = (results, file) => {
    let currSchool = results.data[0].Institution;
    let totalGrant = 0;
    let latitude = results.data[0].Latitude;
    let longitude = results.data[0].Longitude;
    let currState = zipcodes.lookup(results.data[0].PayeeZip).state;

    var i = 0;
    while (i < results.data.length) {
      let grantAmount = results.data[i].GrantAmt.substring(1);
      grantAmount = grantAmount.replace(',', "");
      grantAmount = parseFloat(grantAmount);

      if (currSchool === results.data[i].Institution) {
        let currLat = results.data[i].Latitude;
        if (currLat != null) {
          let lat = currLat.substring(0, currLat.length - 2);
          latitude = parseFloat(lat);
        }

        let currLong = results.data[i].Longitude;
        if (currLong != null) {
          let long = currLong.substring(0, currLong.length - 2);
          longitude = -1 * parseFloat(long);
        }

        let state = zipcodes.lookup(parseInt(results.data[i].PayeeZip));
        if (state === null) {
          currState = "";
        }
        else {
          if (state != null) {
            currState = "US-" + state.state;
          }
          else {
            let parseCity = results.data[i].PayeeCityStZip.split(',')[1].trim();
            parseCity = parseCity.split(' ')[0];
            currState = "US-" + parseCity;
          }
        }

        totalGrant += grantAmount;
        i++;
      }
      else {
        dataObjects.push({
          "zoomLevel": 5,
          "scale": 0.5,
          "title": currSchool,
          "latitude": latitude,
          "longitude": longitude,
          "totalGrant": totalGrant,
          "state": currState,
        });
        currSchool = results.data[i].Institution;
        schools.push(currSchool);
        totalGrant = 0;
      }
    }
    this.setState({ data: dataObjects }, (updatedState) => {
      this.renderMap();
    });
  }

  loadData = () => {
    let config = {
      delimiter: ",",	// auto-detect
      newline: "",	// auto-detect
      header: true,
      dynamicTyping: true,
      complete: this.dataCallback,
      download: true,
      delimitersToGuess: [',', '\t', '|', ';', Papa.RECORD_SEP, Papa.UNIT_SEP]
    };
    Papa.parse(csv, config);
  }

  renderMap() {
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create map instance
    let chart = am4core.create("chartdiv", am4maps.MapChart);

    // Set map definition
    chart.geodata = am4geodata_usaLow;

    // Set projection
    chart.projection = new am4maps.projections.Albers();

    chart.zoomControl = new am4maps.ZoomControl();
    chart.zoomControl.align = "left";

    // Create map polygon series
    let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

    // Make map load polygon data (state shapes and names) from GeoJSON
    polygonSeries.useGeodata = true;

    // Set heatmap values for each state
    polygonSeries.data = [
      {
        id: "US-AL",
        value: 4447100,
        schools: [],
      },
      {
        id: "US-AK",
        value: 626932,
        schools: [],
      },
      {
        id: "US-AZ",
        value: 5130632,
        schools: [],
      },
      {
        id: "US-AR",
        value: 2673400,
        schools: [],
      },
      {
        id: "US-CA",
        value: 33871648,
        schools: [],
      },
      {
        id: "US-CO",
        value: 4301261,
        schools: [],
      },
      {
        id: "US-CT",
        value: 3405565,
        schools: [],
      },
      {
        id: "US-DE",
        value: 783600,
        schools: [],
      },
      {
        id: "US-FL",
        value: 15982378,
        schools: [],
      },
      {
        id: "US-GA",
        value: 8186453,
        schools: [],
      },
      {
        id: "US-HI",
        value: 1211537,
        schools: [],
      },
      {
        id: "US-ID",
        value: 1293953,
        schools: [],
      },
      {
        id: "US-IL",
        value: 12419293,
        schools: [],
      },
      {
        id: "US-IN",
        value: 6080485,
        schools: [],
      },
      {
        id: "US-IA",
        value: 2926324,
        schools: [],
      },
      {
        id: "US-KS",
        value: 2688418,
        schools: [],
      },
      {
        id: "US-KY",
        value: 4041769,
        schools: [],
      },
      {
        id: "US-LA",
        value: 4468976,
        schools: [],
      },
      {
        id: "US-ME",
        value: 1274923,
        schools: [],
      },
      {
        id: "US-MD",
        value: 5296486,
        schools: [],
      },
      {
        id: "US-MA",
        value: 6349097,
        schools: [],
      },
      {
        id: "US-MI",
        value: 9938444,
        schools: [],
      },
      {
        id: "US-MN",
        value: 4919479,
        schools: [],
      },
      {
        id: "US-MS",
        value: 2844658,
        schools: [],
      },
      {
        id: "US-MO",
        value: 5595211,
        schools: [],
      },
      {
        id: "US-MT",
        value: 902195,
        schools: [],
      },
      {
        id: "US-NE",
        value: 1711263,
        schools: [],
      },
      {
        id: "US-NV",
        value: 1998257,
        schools: [],
      },
      {
        id: "US-NH",
        value: 1235786,
        schools: [],
      },
      {
        id: "US-NJ",
        value: 8414350,
        schools: [],
      },
      {
        id: "US-NM",
        value: 1819046,
        schools: [],
      },
      {
        id: "US-NY",
        value: 18976457,
        schools: [],
      },
      {
        id: "US-NC",
        value: 8049313,
        schools: [],
      },
      {
        id: "US-ND",
        value: 642200,
        schools: [],
      },
      {
        id: "US-OH",
        value: 11353140,
        schools: [],
      },
      {
        id: "US-OK",
        value: 3450654,
        schools: [],
      },
      {
        id: "US-OR",
        value: 3421399,
        schools: [],
      },
      {
        id: "US-PA",
        value: 12281054,
        schools: [],
      },
      {
        id: "US-RI",
        value: 1048319,
        schools: [],
      },
      {
        id: "US-SC",
        value: 4012012,
        schools: [],
      },
      {
        id: "US-SD",
        value: 754844,
        schools: [],
      },
      {
        id: "US-TN",
        value: 5689283,
        schools: [],
      },
      {
        id: "US-TX",
        value: 20851820,
        schools: [],
      },
      {
        id: "US-UT",
        value: 2233169,
        schools: [],
      },
      {
        id: "US-VT",
        value: 608827,
        schools: [],
      },
      {
        id: "US-VA",
        value: 7078515,
        schools: [],
      },
      {
        id: "US-WA",
        value: 5894121,
        schools: [],
      },
      {
        id: "US-WV",
        value: 1808344,
        schools: [],
      },
      {
        id: "US-WI",
        value: 5363675,
        schools: [],
      },
      {
        id: "US-WY",
        value: 493782,
        schools: [],
      }
    ];

    let minValue = 0;
    let maxValue = 0;
    var i;

    for (i = 0; i < polygonSeries.data.length; i++) {

      // filter array by each state id
      let currState = polygonSeries.data[i].id;
      states.push(polygonSeries.data[i].id.substring(3));

      let stateArr = dataObjects.filter((obj) => {
        return obj.state === currState;
      });
      polygonSeries.data[i].schools = stateArr;

      // sum up the values in each subarray
      let sum = stateArr.reduce((a, b) => a + b.totalGrant, 0);

      // put sum in value of data array 
      polygonSeries.data[i].value = sum;

      if (sum < minValue) {
        minValue = sum;
      }
      if (sum > maxValue) {
        maxValue = sum;
      }
    }

    polygonSeries.heatRules.push({
      property: "fill",
      target: polygonSeries.mapPolygons.template,
      min: chart.colors.getIndex(1).brighten(1),
      max: chart.colors.getIndex(1).brighten(-0.3),
      minValue: minValue,
      maxValue: maxValue / 100,
    });

    // Set up heat legend
    let heatLegend = chart.createChild(am4maps.HeatLegend);
    heatLegend.series = polygonSeries;
    heatLegend.align = "right";
    heatLegend.valign = "bottom";
    heatLegend.width = am4core.percent(15);
    heatLegend.marginRight = am4core.percent(4);
    heatLegend.minValue = 0;
    heatLegend.maxValue = 40000000;

    // Set up custom heat map legend labels using axis ranges
    let minRange = heatLegend.valueAxis.axisRanges.create();
    minRange.value = heatLegend.minValue;
    minRange.label.text = "smallest value";
    let maxRange = heatLegend.valueAxis.axisRanges.create();
    maxRange.value = heatLegend.maxValue;
    maxRange.label.text = "largest value";

    // Blank out internal heat legend value axis labels
    heatLegend.valueAxis.renderer.labels.template.adapter.add("text", function (labelText) {
      return "";
    });

    // Configure series tooltip
    let polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}: ${value}";
    polygonTemplate.nonScalingStroke = true;
    polygonTemplate.strokeWidth = 0.5;

    // Create hover state and set alternative fill color
    let hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color("#3c5bdc");

    polygonTemplate.events.on("hit", (ev) => {
      ev.target.series.chart.zoomToMapObject(ev.target);
      console.log(ev.target);
      let state = ev.target.dataItem.dataContext;
      // this.renderChart(state, polygonSeries.data);
    });

    let imageSeries = chart.series.push(new am4maps.MapImageSeries());
    imageSeries.mapImages.template.propertyFields.longitude = "longitude";
    imageSeries.mapImages.template.propertyFields.latitude = "latitude";
    imageSeries.mapImages.template.propertyFields.value = "value";
    imageSeries.data = this.state.data;
    // imageSeries.data = [
    //   {
    //     "zoomLevel": 5,
    //     "scale": 0.5,
    //     "title": "San Antonio",
    //     "latitude": 29.4241,
    //     "longitude": -98.4936,
    //     "value": 100,
    //     "state": "Texas",
    //   },
    //   {
    //     "zoomLevel": 5,
    //     "scale": 0.5,
    //     "title": "Austin",
    //     "latitude": 30.2672,
    //     "longitude": -97.7431,
    //     "value": 10000,
    //     "state": "Texas",
    //   },
    //   {
    //     "zoomLevel": 5,
    //     "scale": 0.5,
    //     "title": "San Francisco",
    //     "latitude": 37.7749,
    //     "longitude": -122.4194,
    //     "value": 4000,
    //     "state": "California",
    //   },
    // ];
    let circle = imageSeries.mapImages.template.createChild(am4core.Circle);
    circle.radius = 2;
    circle.fill = am4core.color("#000000");
    circle.stroke = am4core.color("#000000");
    circle.strokeWidth = 2;
    circle.nonScaling = true;
    circle.tooltipText = "{title}: ${totalGrant}";

    circle.events.on("hit", function (ev) {
      let school = ev.target.dataItem.dataContext.title;
      let grant = ev.target.dataItem.dataContext.totalGrant;
      this.setState({
        visible: true,
        university: school,
        totalGrant: grant,
      });
    }, this);
    
  }

  renderSchoolData = (city) => {
    this.setState({
      visible: true
    });
  }

  renderChart = (state, stateData) => {
    console.log(state);
    state = state.id.substring(3);
    
    let chart2 = am4core.create("chartdiv2", am4charts.XYChart);

    // Add data
    chart2.data = stateData[4].schools[0];

    // Create axes
    let categoryAxis = chart2.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "title";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;

    categoryAxis.renderer.labels.template.adapter.add("dy", function (dy, target) {
      if (target.dataItem && target.dataItem.index & 2 == 2) {
        return dy + 25;
      }
      return dy;
    });

    let valueAxis = chart2.yAxes.push(new am4charts.ValueAxis());

    // Create series
    let series = chart2.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "value";
    series.dataFields.categoryX = "title";
    series.name = "Visits";
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = .8;

    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
  }

  componentDidMount() {
    this.loadData();
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  render() {
    let cityInfo;
    if (this.state.visible) {
      cityInfo = <text>{this.state.university}: ${this.state.totalGrant}</text>;
    }
    return (
      <div class="contents">
        <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
        <div class="cityInfo">
          {cityInfo}
        </div>
        {/* <label class="infoText">Click on a state to view more info</label> */}
        {/* <div id="chartdiv2" style={{ width: "100%", height: "500px" }}></div> */}
        <Typeahead id="search-bar" placeholder="search by state" onChange={(selected) => {
    			// var states = this.listMovieRatings(selected);
    			// this.setState({value: movieDetails});
  			}} options={states} />
        <Typeahead id="search-bar" placeholder="search by school" onChange={(selected) => {
    			// var states = this.listMovieRatings(selected);
          // this.setState({value: movieDetails});
          console.log(selected.toString());
          let schoolGrant;
          dataObjects.filter((obj) => {
            if (obj.title === selected.toString()) {
              schoolGrant = obj.totalGrant;
              return obj.totalGrant;
            }
          });
          this.setState({
            visible: true,
            university: selected,
            totalGrant: schoolGrant,
          });
  			}} options={schools} />
      </div>
    );
  }
}

export default App;