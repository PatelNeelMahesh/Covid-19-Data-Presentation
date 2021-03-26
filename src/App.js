import React, { useEffect, useState } from "react";
import './App.css';
import {FormControl,Select,MenuItem,Card,CardContent} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData } from "./util";
import LineGraph from "./LineGraph";
//import "leaflet/dist/leaflet.css";

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  //state = how we write a variable in react
  
  //all data of countries from disease.sh
  /*(https://disease.sh/v3/covid-19/countries)*/

  /*useeffect = runs a block of code based on a given condition*/

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    //the code here will run once when component loads not again

    //async ->send a request, wait for it, do something with info
  const getContriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country)=>({
            name: country.country, //india, united states,..
            value: country.countryInfo.iso2,// in,us,uk 
          }));
          
        const sortedData = sortData(data);  
        setTableData(sortedData);
        setCountries(countries);  
      });
    };
    getContriesData();
  }, []);

  const onCountryChange = async(event) => {
    const countryCode = event.target.value;

    //console.log("well it works: ",countryCode);

    setCountry(countryCode);

    const url = 
      countryCode === "worldwide"
      ? "https://disease.sh/v3/covid-19/all"
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    // https://disease.sh/v3/covid-19/all
    // https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]

    await fetch(url)
    .then(response => response.json())
    .then(data => {
        setCountry(countryCode);
        // all of the data...
        // from the country response
        setCountryInfo(data);
    });

  };
  //console.log("Country Information ---->",countryInfo);

  return (
  <div className="app"> {/*bem naming convention*/}

    <div className="app_left">

      {/*Header*/}
      <div className="app_header">
        <h1>COVID-19 TRACKER</h1>

        {/*Title + Select input dropdown field*/}
        <FormControl className="app_dropdown">
          <Select variant="outlined" onChange={onCountryChange} value={country}>
            <MenuItem value="worldwide">Worldwide</MenuItem>

              {/*loop through list of countries and 
              show a drop down list of all the options */}

            {countries.map((country)=>(
              <MenuItem value={country.value}>{country.name}</MenuItem>
            ))}

             {/*
                  <MenuItem value="worldwide">Worldwide</MenuItem>
                  <MenuItem value="worldwide">Option 2</MenuItem>
                  <MenuItem value="worldwide">Option 3</MenuItem>
                  <MenuItem value="worldwide">Option 4</MenuItem>
            */}
      
          </Select>
        </FormControl>
      </div>  

      <div className="app_stats">

          {/*Infoboxes title="total cases"*/}
          <InfoBox title="Coronavirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases}/>
          {/*Infoboxes title="total recovered"*/}
          <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered}/>
          {/*Infoboxes title="total deaths"*/}
          <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths}/>
      </div>
        {/*maps*/}
        <Map />
    </div>
    
    <Card className="app_right">
      {/*Table*/}
      
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3>Worldwide new cases</h3>
          {/*Graphs*/}
          <LineGraph />
        </CardContent>
    
    </Card>
  </div>

  );
}

export default App;
