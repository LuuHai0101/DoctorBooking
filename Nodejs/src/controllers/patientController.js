import patientService from '../services/patientServices';
import db from '../models/index'

let postBookAppointment = async (req, res) => {
    try {
        let infor = await patientService.postBookAppointment(req.body);
        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let postVerifyBookAppointment = async (req, res) => {
    try {
        let infor = await patientService.postVerifyBookAppointment(req.body);
        return res.status(200).json(
            infor
        )
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let callBooking = async (req, res) => {
    try {
        let doctorId = req.query.doctorId;
        let date = req.query.date;
        console.log(req);
        let bookings = await db.Booking.findAll({
            where: {
                doctorId: doctorId,
                date: date,
            },
        });

        res.status(200).json(bookings);
        
    } catch (e) {
        console.log("lloix call api: ",e);
        res.json(1);
    }
}

let deleteBooking = async (req, res) => {
    try{
        let id = req.query.Id;
        
        const item = await db.Booking.findByPk(id);
    if (!item) {
      return res.status(404).json({ error: 'Mục không tồn tại' });
    }

    // Xóa mục từ cơ sở dữ liệu
    await db.Booking.destroy({ where: { id: id } });

    return res.status(204).json({ error: 'Mục không tồn tại' })

    }
    catch (e){
        console.log("Lỗi xóa: ", e)
    }
}

module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment,
    callBooking: callBooking,
    deleteBooking: deleteBooking
}