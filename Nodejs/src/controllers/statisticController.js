import db, { sequelize } from '../models/index';

let getStatistic = async (req, res) => {

    try {
        const today = new Date();
        const startDate = new Date(today.setDate(today.getDate() - 30));
        const endDate = new Date();

        const date = new Date(startDate.getTime());

        const dates = [];

        while (date <= endDate) {
            const time = new Date(date);
            dates.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }

        let conditions = {};

        const doctors = await db.User.findAll({
            where: {
                ...conditions,
                roleId: "R2"
            },
        });

        const obDoctors = {};
        const obIdDoctors = {};
        for (let i = 0; i < doctors.length; i++) {
            const doctor = doctors[i];
            const time = new Date(doctor.createdAt);
            const date = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`;
            if (obDoctors[date]) {
                obDoctors[date].push(doctor);
            } else {
                obDoctors[date] = [doctor];
            }

            obIdDoctors[doctor.id] = doctor;
        }

        const patients = await db.User.findAll({
            where: {
                ...conditions,
                roleId: "R3"
            },
        });

        const obPatients = {};
        for (let i = 0; i < patients.length; i++) {
            const patient = patients[i];
            const time = new Date(patient.createdAt);
            const date = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`;
            if (obPatients[date]) {
                obPatients[date].push(patient);
            } else {
                obPatients[date] = [patient];
            }
        }

        const topDoctor =  await db.Booking.findAll({
            attributes: ["doctorId", [sequelize.fn("COUNT", sequelize.col("id")), "total"],],
            group: "doctorId",
            order: [['total', 'DESC']],
        });

        const topDoctorRs = [];
        for(let i = 0; i<topDoctor.length; i++){
            const item = topDoctor[i];
            topDoctorRs.push({...item, doctor:obIdDoctors[item.doctorId]});
        }

        const statistic = {
            totalDoctor: doctors.length,
            totalPatient: patients.length,
            topDoctor:topDoctorRs
        };

        const obRsDoctors = [];
        const obRsPatients = [];
        const newDates = [];
        for(let i = 0; i<dates.length;i++){
            const time = new Date(dates[i]);
            const timeFormat = `${time.getFullYear()}-${time.getMonth() + 1}-${time.getDate()}`;
            newDates.push(`${time.getDate()}/${time.getMonth() + 1}`);
            obRsDoctors.push(obDoctors[timeFormat]?obDoctors[timeFormat].length:0);
            obRsPatients.push(obPatients[timeFormat]?obPatients[timeFormat].length:0);
        }

        const chartData = { doctor: obRsDoctors, patient: obRsPatients, dates:newDates };

        return res.json({ data: { statistic, chartData }, errCode: 0 });

    } catch (e) {
        console.log(e)
    }

}

module.exports = {
    getStatistic: getStatistic
}