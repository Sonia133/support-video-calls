import moment from "moment";
import React from "react";
import { Line } from 'react-chartjs-2';

const CallChart = (props) => {
    const calls = props.calls;
    const days = [];
    const yAxis = [];

    for (let i = 6; i >= 0; i--) {
        let day = moment(new Date()).subtract(i, 'days');
        days.push(day.format('ll'));
        yAxis.push(calls[day.format('L')]);
    }
    
    const data = (canvas) => {
        var ctx = canvas.getContext("2d");
    
        var gradientFill = ctx.createLinearGradient(0, 170, 0, 50);
        gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
        gradientFill.addColorStop(1, "rgb(230, 255, 230)");
        
        return {
            labels: days,
            datasets: [{
                label: "Calls",
                borderColor: "rgb(153, 255, 153)",
                pointBorderColor: "#FFF",
                pointBackgroundColor: "rgb(230, 255, 230)",
                pointBorderWidth: 2,
                pointHoverRadius: 4,
                pointHoverBorderWidth: 1,
                pointRadius: 4,
                fill: true,
                backgroundColor: gradientFill,
                borderWidth: 2,
                data: yAxis
            }]
        }
    };
    const options = {
        maintainAspectRatio: false,
        tooltips: {
            bodySpacing: 4,
            mode:"nearest",
            intersect: 0,
            position:"nearest",
            xPadding:10,
            yPadding:10,
            caretPadding:10
        },
        legend: {
            labels: {
               fontColor: 'whitesmoke'
            }
        },
        scales: {
            yAxes: [{
                ticks: {
                    fontColor: 'whitesmoke'
                },
            }],
            xAxes: [{
                ticks: {
                    fontColor: 'whitesmoke'
                },
            }]
        },
        responsive: 1,
        layout:{
            padding:{left:15,right:15,top:15,bottom:15}
        }
    };
    return (
        <Line data={data} options={options} />
    )
};

export default CallChart;