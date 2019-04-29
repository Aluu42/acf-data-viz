import React, { Component } from 'react';
import './App.css';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4geodata_usaLow from "@amcharts/amcharts4-geodata/usaLow";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import Papa from 'papaparse';
import zipcodes from 'zipcodes';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Banner from 'react-js-banner';
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

import AL from "@amcharts/amcharts4-geodata/region/usa/alLow";
import AK from "@amcharts/amcharts4-geodata/region/usa/akLow";
import AR from "@amcharts/amcharts4-geodata/region/usa/arLow";
import AZ from "@amcharts/amcharts4-geodata/region/usa/azLow";
import CA from "@amcharts/amcharts4-geodata/region/usa/caLow";

import CO from "@amcharts/amcharts4-geodata/region/usa/coLow";
import CT from "@amcharts/amcharts4-geodata/region/usa/ctLow";
import DE from "@amcharts/amcharts4-geodata/region/usa/deLow";
import FL from "@amcharts/amcharts4-geodata/region/usa/flLow";

import GA from "@amcharts/amcharts4-geodata/region/usa/gaLow";
import HI from "@amcharts/amcharts4-geodata/region/usa/hiLow";
import ID from "@amcharts/amcharts4-geodata/region/usa/idLow";
import IL from "@amcharts/amcharts4-geodata/region/usa/ilLow";
import IN from "@amcharts/amcharts4-geodata/region/usa/inLow";

import IA from "@amcharts/amcharts4-geodata/region/usa/iaLow";
import KS from "@amcharts/amcharts4-geodata/region/usa/ksLow";
import KY from "@amcharts/amcharts4-geodata/region/usa/kyLow";
import LA from "@amcharts/amcharts4-geodata/region/usa/laLow";
import ME from "@amcharts/amcharts4-geodata/region/usa/meLow";

import MD from "@amcharts/amcharts4-geodata/region/usa/mdLow";
import MA from "@amcharts/amcharts4-geodata/region/usa/maLow";
import MI from "@amcharts/amcharts4-geodata/region/usa/miLow";
import MN from "@amcharts/amcharts4-geodata/region/usa/mnLow";
import MS from "@amcharts/amcharts4-geodata/region/usa/msLow";

import MO from "@amcharts/amcharts4-geodata/region/usa/moLow";
import MT from "@amcharts/amcharts4-geodata/region/usa/mtLow";
import NE from "@amcharts/amcharts4-geodata/region/usa/neLow";
import NV from "@amcharts/amcharts4-geodata/region/usa/nvLow";
import NH from "@amcharts/amcharts4-geodata/region/usa/nhLow";

import NJ from "@amcharts/amcharts4-geodata/region/usa/njLow";
import NM from "@amcharts/amcharts4-geodata/region/usa/nmLow";
import NY from "@amcharts/amcharts4-geodata/region/usa/nyLow";
import NC from "@amcharts/amcharts4-geodata/region/usa/ncLow";
import ND from "@amcharts/amcharts4-geodata/region/usa/ndLow";

import OH from "@amcharts/amcharts4-geodata/region/usa/ohLow";
import OK from "@amcharts/amcharts4-geodata/region/usa/okLow";
import OR from "@amcharts/amcharts4-geodata/region/usa/orLow";
import PA from "@amcharts/amcharts4-geodata/region/usa/paLow";
import RI from "@amcharts/amcharts4-geodata/region/usa/riLow";

import SC from "@amcharts/amcharts4-geodata/region/usa/scLow";
import SD from "@amcharts/amcharts4-geodata/region/usa/sdLow";
import TN from "@amcharts/amcharts4-geodata/region/usa/tnLow";
import TX from "@amcharts/amcharts4-geodata/region/usa/txLow";
import UT from "@amcharts/amcharts4-geodata/region/usa/utLow";

import VT from "@amcharts/amcharts4-geodata/region/usa/vtLow";
import VA from "@amcharts/amcharts4-geodata/region/usa/vaLow";
import WA from "@amcharts/amcharts4-geodata/region/usa/waLow";
import WV from "@amcharts/amcharts4-geodata/region/usa/wvLow";
import WI from "@amcharts/amcharts4-geodata/region/usa/wiLow";
import WY from "@amcharts/amcharts4-geodata/region/usa/wyLow";
import { CardHeader } from '@material-ui/core';


var csv = require('./data.csv');
const dataObjects = [];
const statesMap = new Map();
let statesArray = [];
let schoolsArray = [];
const schoolsMap = new Map();
let sData = [];

am4core.useTheme(am4themes_animated);
const initialState = {
  visible: false,
  data: null,
  university: "",
  grantamt: "",
  bannerCSS: { color: "#FFF", backgroundColor: "#282c34", fontSize: 500 },
};
class App extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.renderMap = this.renderMap.bind(this);
    this.renderSchoolData = this.renderSchoolData.bind(this);
    this.loadData = this.loadData.bind(this);
    this.dataCallback = this.dataCallback.bind(this);
    this.renderChart = this.renderChart.bind(this);
    this.renderSchoolChart = this.renderSchoolChart.bind(this);
  }

  resetState = () => {
    window.location.reload();
  }

  dataCallback = (results, file) => {
    let currSchool = results.data[0].Institution;
    let totalGrant = 0;
    let latitude = results.data[0].Latitude;
    let longitude = results.data[0].Longitude;
    let currState = zipcodes.lookup(results.data[0].PayeeZip).state;
    let yearByYearGrant = [];

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
        var exists = false;
        var j;
        var currYear = "20" + results.data[i].GrantDate.substring(results.data[i].GrantDate.length - 2);
        for(j = 0; j < yearByYearGrant.length; j++){
          if(yearByYearGrant[j].year == currYear){
            yearByYearGrant[j].grantAmount += grantAmount;
            exists = true;
          }
        }
        if(!exists){
          var yearGrant = { year: currYear, grantAmount: grantAmount };
          yearByYearGrant.push(yearGrant);
        }

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
          "yearlyList": yearByYearGrant,
        });
        currSchool = results.data[i].Institution;
        schoolsArray.push(currSchool);
        yearByYearGrant = [];
        totalGrant = 0;
      }
    }

    let index;
    for (index = 0; index < dataObjects.length; index++) {
      schoolsMap.set(dataObjects[index].title, dataObjects[index].totalGrant);
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
    chart.centerMap = true;

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
        stateMap: AL,
      },
      {
        id: "US-AK",
        value: 626932,
        schools: [],
        stateMap: AK,
      },
      {
        id: "US-AZ",
        value: 5130632,
        schools: [],
        stateMap: AZ,
      },
      {
        id: "US-AR",
        value: 2673400,
        schools: [],
        stateMap: AR,
      },
      {
        id: "US-CA",
        value: 33871648,
        schools: [],
        stateMap: CA,
      },
      {
        id: "US-CO",
        value: 4301261,
        schools: [],
        stateMap: CO,
      },
      {
        id: "US-CT",
        value: 3405565,
        schools: [],
        stateMap: CT,
      },
      {
        id: "US-DE",
        value: 783600,
        schools: [],
        stateMap: DE,
      },
      {
        id: "US-FL",
        value: 15982378,
        schools: [],
        stateMap: FL,
      },
      {
        id: "US-GA",
        value: 8186453,
        schools: [],
        stateMap: GA,
      },
      {
        id: "US-HI",
        value: 1211537,
        schools: [],
        stateMap: HI,
      },
      {
        id: "US-ID",
        value: 1293953,
        schools: [],
        stateMap: ID,
      },
      {
        id: "US-IL",
        value: 12419293,
        schools: [],
        stateMap: IL,
      },
      {
        id: "US-IN",
        value: 6080485,
        schools: [],
        stateMap: IN,
      },
      {
        id: "US-IA",
        value: 2926324,
        schools: [],
        stateMap: IA,
      },
      {
        id: "US-KS",
        value: 2688418,
        schools: [],
        stateMap: KS,
      },
      {
        id: "US-KY",
        value: 4041769,
        schools: [],
        stateMap: KY,
      },
      {
        id: "US-LA",
        value: 4468976,
        schools: [],
        stateMap: LA,
      },
      {
        id: "US-ME",
        value: 1274923,
        schools: [],
        stateMap: ME,
      },
      {
        id: "US-MD",
        value: 5296486,
        schools: [],
        stateMap: MD,
      },
      {
        id: "US-MA",
        value: 6349097,
        schools: [],
        stateMap: MA,
      },
      {
        id: "US-MI",
        value: 9938444,
        schools: [],
        stateMap: MI,
      },
      {
        id: "US-MN",
        value: 4919479,
        schools: [],
        stateMap: MN,
      },
      {
        id: "US-MS",
        value: 2844658,
        schools: [],
        stateMap: MS,
      },
      {
        id: "US-MO",
        value: 5595211,
        schools: [],
        stateMap: MO,
      },
      {
        id: "US-MT",
        value: 902195,
        schools: [],
        stateMap: MT,
      },
      {
        id: "US-NE",
        value: 1711263,
        schools: [],
        stateMap: NE,
      },
      {
        id: "US-NV",
        value: 1998257,
        schools: [],
        stateMap: NV,
      },
      {
        id: "US-NH",
        value: 1235786,
        schools: [],
        stateMap: NH,
      },
      {
        id: "US-NJ",
        value: 8414350,
        schools: [],
        stateMap: NJ,
      },
      {
        id: "US-NM",
        value: 1819046,
        schools: [],
        stateMap: NM,
      },
      {
        id: "US-NY",
        value: 18976457,
        schools: [],
        stateMap: NY,
      },
      {
        id: "US-NC",
        value: 8049313,
        schools: [],
        stateMap: NC,
      },
      {
        id: "US-ND",
        value: 642200,
        schools: [],
        stateMap: ND,
      },
      {
        id: "US-OH",
        value: 11353140,
        schools: [],
        stateMap: OH,
      },
      {
        id: "US-OK",
        value: 3450654,
        schools: [],
        stateMap: OK,
      },
      {
        id: "US-OR",
        value: 3421399,
        schools: [],
        stateMap: OR,
      },
      {
        id: "US-PA",
        value: 12281054,
        schools: [],
        stateMap: PA,
      },
      {
        id: "US-RI",
        value: 1048319,
        schools: [],
        stateMap: RI,
      },
      {
        id: "US-SC",
        value: 4012012,
        schools: [],
        stateMap: SC,
      },
      {
        id: "US-SD",
        value: 754844,
        schools: [],
        stateMap: SD,
      },
      {
        id: "US-TN",
        value: 5689283,
        schools: [],
        stateMap: TN,
      },
      {
        id: "US-TX",
        value: 20851820,
        schools: [],
        stateMap: TX,
      },
      {
        id: "US-UT",
        value: 2233169,
        schools: [],
        stateMap: UT,
      },
      {
        id: "US-VT",
        value: 608827,
        schools: [],
        stateMap: VT,
      },
      {
        id: "US-VA",
        value: 7078515,
        schools: [],
        stateMap: VA,
      },
      {
        id: "US-WA",
        value: 5894121,
        schools: [],
        stateMap: WA,
      },
      {
        id: "US-WV",
        value: 1808344,
        schools: [],
        stateMap: WV,
      },
      {
        id: "US-WI",
        value: 5363675,
        schools: [],
        stateMap: WI,
      },
      {
        id: "US-WY",
        value: 493782,
        schools: [],
        stateMap: WY,
      }
    ];

    let minValue = 0;
    let maxValue = 0;
    var i;

    for (i = 0; i < polygonSeries.data.length; i++) {

      // filter array by each state id
      let currState = polygonSeries.data[i].id;

      let stateArr = dataObjects.filter((obj) => {
        return obj.state === currState;
      });
      polygonSeries.data[i].schools = stateArr;

      // sum up the values in each subarray
      let sum = stateArr.reduce((a, b) => a + b.totalGrant, 0);

      // put sum in value of data array
      polygonSeries.data[i].value = sum;
      statesArray.push(polygonSeries.data[i].id.substring(3));
      let stateString = polygonSeries.data[i].id.substring(3);
      statesMap.set(stateString, sum);

      if (sum < minValue) {
        minValue = sum;
      }
      if (sum > maxValue) {
        maxValue = sum;
      }
    }
    sData = polygonSeries.data;

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
    heatLegend.align = "left";
    heatLegend.valign = "top";
    heatLegend.width = am4core.percent(25);
    heatLegend.marginRight = am4core.percent(4);
    heatLegend.minValue = 0;
    heatLegend.maxValue = 40000000;

    // Set up custom heat map legend labels using axis ranges
    let minRange = heatLegend.valueAxis.axisRanges.create();
    minRange.value = heatLegend.minValue;
    minRange.label.text = "$0";
    let maxRange = heatLegend.valueAxis.axisRanges.create();
    maxRange.value = heatLegend.maxValue;
    maxRange.label.text = "$4 million";

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
      // ev.target.series.chart.zoomToMapObject(ev.target);
      // console.log(ev.target);
      let state = ev.target.dataItem.dataContext;
      this.renderState(state);
      // console.log(state);
      // this.showSchoolsByState(state.id.substring(3));
      //console.log(state);
      //this.showSchoolsByState(state.id.substring(3));
      this.renderChart(state, polygonSeries.data);
    });

    let imageSeries = chart.series.push(new am4maps.MapImageSeries());
    imageSeries.mapImages.template.propertyFields.longitude = "longitude";
    imageSeries.mapImages.template.propertyFields.latitude = "latitude";
    imageSeries.mapImages.template.propertyFields.value = "value";
    imageSeries.data = this.state.data;

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
        university: school + ": ",
        totalGrant: "$" + grant,
      });
      this.renderSchoolChart(ev.target.dataItem.dataContext);
    }, this);

  }

  renderSchoolData = (city) => {
    this.setState({
      visible: true
    });
  }

  renderSchoolChart = (school) => {
    // state = state.id.substring(3);
    let chart3 = am4core.create("chartdiv3", am4charts.XYChart);

    // Add data
    chart3.data = school.yearlyList;
    // Create axes
    let categoryAxis = chart3.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "year";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;

    categoryAxis.renderer.labels.template.fontSize = 10;
    // categoryAxis.renderer.labels.template.horizontalCenter = "right";
    // categoryAxis.renderer.labels.template.verticalCenter = "middle";
    // categoryAxis.renderer.labels.template.rotation = 270;

    let valueAxis = chart3.yAxes.push(new am4charts.ValueAxis());
    valueAxis.calculateTotals = true;
    // Create series
    let series = chart3.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "grantAmount";
    series.dataFields.categoryX = "year";
    series.name = "Year";
    series.stacked = true;
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY.total}[/]";
    series.columns.template.fillOpacity = .8;


    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
  }

  renderChart = (state, stateData) => {
    console.log(state);

    let chart2 = am4core.create("chartdiv2", am4charts.XYChart);

    let schoolData = state.schools;
    schoolData.sort(function (a, b) {
      return parseInt(b.totalGrant) - parseInt(a.totalGrant);
    });
    // Add data
    chart2.data = schoolData.slice(0, 5);

    // Create axes
    let categoryAxis = chart2.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "title";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;



    categoryAxis.renderer.labels.template.fontSize = 10;
    //categoryAxis.renderer.labels.template.horizontalCenter = "right";
    //categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.renderer.labels.template.wrap = true;
    categoryAxis.renderer.labels.template.maxWidth = 75;
    //categoryAxis.renderer.labels.template.rotation = 270;

    let valueAxis = chart2.yAxes.push(new am4charts.ValueAxis());
    // Create series
    let series = chart2.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "totalGrant";
    series.dataFields.categoryX = "title";
    series.name = "Visits";
    series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = .8;

    series.columns.template.events.on("hit", function (ev) {
      console.log("clicked on ", ev.target._dataItem.categories.categoryX);
      let school = dataObjects.filter((obj) => {
        if (obj.title === ev.target._dataItem.categories.categoryX) {
          return obj;
        }
      });
      this.setState({
        visible: true,
        university: school[0].title + ":",
        totalGrant: "$" + school[0].totalGrant,
      });
      this.renderSchoolChart(school[0]);
    }, this);

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

  renderState = (state) => {
    var chart = am4core.create("chartdiv", am4maps.MapChart);
    console.log(state);
    // Set map definition
    chart.geodata = state.stateMap;

    // Set projection
    chart.projection = new am4maps.projections.Miller();

    // Create map polygon series
    var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

    // Exclude Antartica
    polygonSeries.exclude = ["AQ"];

    // Make map load polygon (like country names) data from GeoJSON
    polygonSeries.useGeodata = true;

    chart.zoomControl = new am4maps.ZoomControl();
    chart.zoomControl.align = "left";

    // Configure series
    var polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";
    polygonTemplate.fill = am4core.color("#64B5F6");

    // Create hover state and set alternative fill color
    var hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color("#455890");

    polygonTemplate.events.on("hit", (ev) => {
      ev.target.series.chart.zoomToMapObject(ev.target);
    });

    let imageSeries = chart.series.push(new am4maps.MapImageSeries());
    imageSeries.mapImages.template.propertyFields.longitude = "longitude";
    imageSeries.mapImages.template.propertyFields.latitude = "latitude";
    imageSeries.mapImages.template.propertyFields.value = "value";
    imageSeries.data = dataObjects.filter((obj) => {
      if (obj.state === state.id) {
        return obj;
      }
    });

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
        university: school + ": ",
        totalGrant: "$" + grant,
      });
      this.renderSchoolChart(ev.target.dataItem.dataContext);
    }, this);
  }

  showSchools = (selected) => {
    let schoolGrant;
    let yearlyList;
    dataObjects.filter((obj) => {
      if (obj.title === selected.toString()) {
        schoolGrant = obj.totalGrant;
        yearlyList = obj.yearlyList;
        return obj.totalGrant;
      }
    });
    this.setState({
      visible: true,
      university: selected + ":",
      totalGrant: "$" + schoolGrant,
    });
  }

  showSchoolsByState = (selected) => {
    let schoolsString = "";
    sData.filter((obj) => {
      if (obj.id.substring(3) === selected.toString()) {
        let i;
        for (i = 0; i < obj.schools.length; i++) {
          let amount = schoolsMap.get(obj.schools[i].title.toString());
          schoolsString += obj.schools[i].title.toString() + ": $" + amount + '*';
        }
        schoolsString = schoolsString.split('*').map(t => {
          return <div>{t}</div>;
        });
      }
    });
    this.setState({
      visible: true,
      university: schoolsString,
    });
  }

  render() {
    let cityInfo;
    if (this.state.visible) {
      cityInfo = <Card><text>
        <div>  {this.state.university} </div>
         Total Grants: {this.state.totalGrant} </text><br /></Card>;
    }

    return (
      <div class="wrap">
        <div class="contents">
          <div id="bannerimage"></div>
          <div class="floatleft">
            <div class="searchBars" style={{marginLeft: '5%', marginRight: '5%',marginTop: '3.5%'}} >
              <Typeahead id="search-bar" placeholder="search by state" onChange={(selected) => {
                if (selected.length === 0) {
                  this.setState({ visible: false, university: "", totalGrant: "" });
                }
                else {
                  let state = sData.filter((obj) => {
                    if (obj.id.substring(3) === selected.toString()) {
                      return obj;
                    }
                  });
                  this.renderState(state[0]);
                  this.renderChart(state[0], []);
                }
              }} options={statesArray} />
              <Typeahead id="search-bar" placeholder="search by school" onChange={(selected) => {
                if (selected.length === 0) {
                  this.setState({ visible: false, university: "", totalGrant: "" });
                }
                else {
                  this.showSchools(selected);
                  let school = dataObjects.filter((obj) => {
                    if (obj.title === selected.toString()) {
                      return obj;
                    }
                  });
                  console.log(school[0]);
                  this.renderSchoolChart(school[0]);
                }
              }} options={schoolsArray} />
            </div>
            <div style={{ marginLeft: '5%', marginRight: '5%', marginTop: '5%', marginBottom: '5%' }}>
              <Card>
              <CardHeader title="Click on a state or school for more info" />
                <CardMedia>
                  <div id="chartdiv" style={{ width: "100%", height: "400px" }}></div>
                  {/* <label class="infoText">Click on a state to view more info</label> */}
                </CardMedia>
              </Card>

              <button onClick={this.resetState}>Return to United States Map</button>

            </div>
          </div>
          <div class="cityInfo floatright">
            <div style={{ marginLeft: '5%', marginRight: '5%', marginTop: '5%', marginBottom: '5%' }}>
              <Card>
                <CardHeader title="Top 5 Schools in State" />
                <div id="chartdiv2" style={{ width: "100%", height: "400px" }}></div>
              </Card>
            </div>
            <div style={{marginLeft: '5%', marginRight: '5%'}}>
            {cityInfo}
            </div>
            <div style={{ marginLeft: '5%', marginRight: '5%', marginTop: '5%', marginBottom: '5%' }}>
              <Card>
                <CardHeader title="School Historical Scholarships" />
                <div id="chartdiv3" style={{ width: "100%", height: "400px" }}></div>
              </Card>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default App;
