import moment from "moment";
import React from "react";
import { Bar } from 'react-chartjs-2';

const FeedbackChart = (props) => {
    const feedback = props.feedback;
    const days = [];
    const yAxis = [];

    for (let i = 6; i >= 0; i--) {
        let day = moment(new Date()).subtract(i, 'days');
        days.push(day.format('ll'));
        yAxis.push(feedback[day.format('L')]);
    }
    const chartColor = '#FFFFFF';

    const data = (canvas) => {
        var ctx = canvas.getContext("2d");
    
        var gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
        gradientStroke.addColorStop(0, '#80b6f4');
        gradientStroke.addColorStop(1, chartColor);
    
        var gradientFill = ctx.createLinearGradient(0, 170, 0, 50);
        gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
        gradientFill.addColorStop(1, "rgb(230, 245, 255)");
        return {
            labels: days,
            datasets: [{
                label: "Feedback",
                borderColor: "rgb(102, 194, 255)",
                pointBorderColor: "#FFF",
                pointBackgroundColor: "rgb(230, 245, 255)",
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
        <Bar data={data} options={options} />
    )
};

export default FeedbackChart;