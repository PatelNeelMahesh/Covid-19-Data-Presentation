import React, {useState, useEffect} from 'react';
import {Line} from "react-chartjs-2";
import numeral from "numeral"; //npm i numeral
//react chartjs 2
//npm install --save react-chartjs-2 chart.js
//npm i react-chartjs-2 {chart.js is saperate dependency}
 
const options = {
    legend: {
        display:false,
    },
    elements: {
        point: {
            radius: 0,
        },
      },
    maintainAspactRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data){
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll",
                },
            },
        ],
        yAxes: [
            {
                gridLines:{
                    display:false,
                },
                ticks:{
                    //Include a dollar sigh in the ticks
                    callbacks: function(value, index, values) {
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    },
};

function LineGraph() {

    const [data, setData] = useState({});

    const buildChartData = (data, casesType="cases") => {
        const chartData = [];
        let lastDataPoint;

        //data[casesType].forEach(date => 
        for (let date in data.cases)  {
            if(lastDataPoint){
                const newDataPoint = {
                    x: date,
                    y: data[casesType][date]-lastDataPoint
                }
                chartData.push(newDataPoint);
            }
            lastDataPoint = data[casesType][date];
        }
        return chartData;
    }

    //https://disease.sh/v3/covid-19/historical/all?lastdays=120

    useEffect(() => {
        const fetchData = async () => {
            await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
            .then((response) => response.json())
            .then((data) => {
                //smart things happend here ...
                //console.log(data);
                const chartData = buildChartData(data, "cases");
                setData(chartData);
            });
        }

        fetchData();

    }, []);


    return (
        <div>
            {data?.length>0 &&(
                <Line
                options={options}
                data={{
                    datasets: [
                        {
                            backgroundColor: "rgba(204, 16, 52, 0.5)",
                            borderColor: "#CC1034",
                            data: data,
                        },
                        ],
                    }}
                />
            )}    
        </div>
    );
}

export default LineGraph; 
