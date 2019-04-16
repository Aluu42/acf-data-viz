import React, { Component } from 'react';
import './App.css';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_usaLow from "@amcharts/amcharts4-geodata/usaLow";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import Papa from 'papaparse';
import zipcodes from 'zipcodes';

var csv = require('./data.csv');
const dataObjects = [];

am4core.useTheme(am4themes_animated);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { visible: false, data: null, university: "" };
    this.renderMap = this.renderMap.bind(this);
    this.renderSchoolData = this.renderSchoolData.bind(this);
    this.loadData = this.loadData.bind(this);
    this.dataCallback = this.dataCallback.bind(this);
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
            if (currState === "US-") {
              console.log(results.data[i]);
            }
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
        value: 4447100
      },
      {
        id: "US-AK",
        value: 626932
      },
      {
        id: "US-AZ",
        value: 5130632
      },
      {
        id: "US-AR",
        value: 2673400
      },
      {
        id: "US-CA",
        value: 33871648
      },
      {
        id: "US-CO",
        value: 4301261
      },
      {
        id: "US-CT",
        value: 3405565
      },
      {
        id: "US-DE",
        value: 783600
      },
      {
        id: "US-FL",
        value: 15982378
      },
      {
        id: "US-GA",
        value: 8186453
      },
      {
        id: "US-HI",
        value: 1211537
      },
      {
        id: "US-ID",
        value: 1293953
      },
      {
        id: "US-IL",
        value: 12419293
      },
      {
        id: "US-IN",
        value: 6080485
      },
      {
        id: "US-IA",
        value: 2926324
      },
      {
        id: "US-KS",
        value: 2688418
      },
      {
        id: "US-KY",
        value: 4041769
      },
      {
        id: "US-LA",
        value: 4468976
      },
      {
        id: "US-ME",
        value: 1274923
      },
      {
        id: "US-MD",
        value: 5296486
      },
      {
        id: "US-MA",
        value: 6349097
      },
      {
        id: "US-MI",
        value: 9938444
      },
      {
        id: "US-MN",
        value: 4919479
      },
      {
        id: "US-MS",
        value: 2844658
      },
      {
        id: "US-MO",
        value: 5595211
      },
      {
        id: "US-MT",
        value: 902195
      },
      {
        id: "US-NE",
        value: 1711263
      },
      {
        id: "US-NV",
        value: 1998257
      },
      {
        id: "US-NH",
        value: 1235786
      },
      {
        id: "US-NJ",
        value: 8414350
      },
      {
        id: "US-NM",
        value: 1819046
      },
      {
        id: "US-NY",
        value: 18976457
      },
      {
        id: "US-NC",
        value: 8049313
      },
      {
        id: "US-ND",
        value: 642200
      },
      {
        id: "US-OH",
        value: 11353140
      },
      {
        id: "US-OK",
        value: 3450654
      },
      {
        id: "US-OR",
        value: 3421399
      },
      {
        id: "US-PA",
        value: 12281054
      },
      {
        id: "US-RI",
        value: 1048319
      },
      {
        id: "US-SC",
        value: 4012012
      },
      {
        id: "US-SD",
        value: 754844
      },
      {
        id: "US-TN",
        value: 5689283
      },
      {
        id: "US-TX",
        value: 20851820
      },
      {
        id: "US-UT",
        value: 2233169
      },
      {
        id: "US-VT",
        value: 608827
      },
      {
        id: "US-VA",
        value: 7078515
      },
      {
        id: "US-WA",
        value: 5894121
      },
      {
        id: "US-WV",
        value: 1808344
      },
      {
        id: "US-WI",
        value: 5363675
      },
      {
        id: "US-WY",
        value: 493782
      }
    ];

    let minValue = 0;
    let maxValue = 0;
    var i; 
    for (i = 0; i < polygonSeries.data.length; i++) {

      // filter array by each state id
      let currState = polygonSeries.data[i].id;
      let stateArr = dataObjects.filter((obj) => {
        return obj.state === polygonSeries.data[i].id;
      });
      
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
      maxValue: maxValue/100,
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

    polygonTemplate.events.on("hit", function (ev) {
      ev.target.series.chart.zoomToMapObject(ev.target);
      console.log(ev.target);
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
      this.setState({
        visible: true,
        university: school,
      });
    }, this);
  }

  renderSchoolData = (city) => {
    this.setState({
      visible: true
    });
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
      cityInfo = <text>{this.state.university}</text>;
    }
    return (
      <div class="contents">
        <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
        <div class="cityInfo">
          {cityInfo}
        </div>
        <label class="infoText">Click on a state to view more info</label>
      </div>
    );
  }
}

export default App;