import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStatistic } from "../../../store/actions/adminActions";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';


function Dashboard(props) {
    const options = {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Thống kê số lượng Bác sĩ và Bệnh nhân trong 30 ngày gần nhất'
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Số lượng (người)'
            }
        },
        series: []
    }

    const dispatch = useDispatch();
    const [total, setTotal] = useState({ doctor: 0, patient: 0 });
    const [topDoctor, setTopDoctor] = useState([]);
    const [chart, setChart] = useState(options);
    const statistic = useSelector((state) => state.admin.statisticData);

    useEffect(() => {
        dispatch(getStatistic());
    }, []);

    useEffect(() => {
        if (statistic) {
            setTotal({ doctor: statistic.statistic.totalDoctor, patient: statistic.statistic.totalPatient });
            setTopDoctor(statistic.statistic.topDoctor);

            const chartData = statistic.chartData;

            const chartOptions = {
                ...options,
                xAxis: {
                    categories: chartData.dates,
                    crosshair: true
                },
                series: [{
                    name: 'Bác sĩ',
                    data: chartData.doctor
            
                }, {
                    name: 'Bệnh nhân',
                    data: chartData.patient
            
                }]
            };
            
            setChart(chartOptions);
            console.log('data----', chartOptions)

        }
    }, [statistic]);

    return <div className="container mt-2">
        <div className="row">
            <div className="col-6">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Bác sĩ</h5>
                        <p className="card-text">Tổng số bác sĩ: {total.doctor}</p>
                    </div>
                </div>
            </div>
            <div className="col-6">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Người khám bệnh</h5>
                        <p className="card-text">Tổng số bệnh nhân: {total.patient}</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="row mt-5">
            <div className="col-8 chart">
                <HighchartsReact
                    highcharts={Highcharts}
                    options={chart}
                />
            </div>
            <div className="col-4 top-doctor">
                <table className="table table-stripped">
                    <thead>
                        <tr>
                            <td>#</td>
                            <td>Tên bác sĩ</td>
                            <td>Số lượt đặt khám</td>
                        </tr>
                    </thead>
                    <tbody>
                        {topDoctor.map((item, index)=><tr key={item.doctorId}>
                            <td>{index+1}</td>
                            <td>{item.doctor.lastName} {item.doctor.firstName}</td>
                            <td>{item.total}</td>
                        </tr>)}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
}

export default Dashboard