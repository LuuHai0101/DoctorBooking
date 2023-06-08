import db from '../models/index';
require('dotenv').config();
import emailService from './emailService';
import { v4 as uuidv4 } from 'uuid';

let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`
    return result;
}

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // 1. Check dữ liệu nhân được có rỗng hay ko?
            // Nếu dữ liệu rỗng -> trả về lỗi
            // Nếu dữ liệu ko rỗng -> đến bước 2
            // 2. Check user có tồn tại trong DB hay ko?
            // Nếu user ko tồn tại trong DB -> Tạo user mới -> đến bước 3
            // Nếu user  có tồn tại -> đến bước 3
            // 3. Check khung giờ đó đã có người book chưa?
            // Nếu khugn giờ đã có ng book -> trả về lỗi là đã có ng book
            // Nếu khung giờ chưa có ng book -> đến bước 4
            // 4. Tạo bản ghi booking
            // Nếu tạo thành công -> đến bước 5
            // Nếu ko tạo thành công -> trả về lỗi 
            // 5. Send mail thông báo đã book
            // Send mail thành công thì kết thúc ctrinh, tả về success 
            //bằng nodejs return new Promise(async (resolve, reject)


            // 1. Check dữ liệu nhân được có rỗng hay ko?
            if (!data.email || !data.doctorId || !data.timeType || !data.date
                || !data.fullName || !data.selectedGender
                || !data.address
                || !data.phoneNumber
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter book'
                })
            } else {
                // // bước 2
                // let doctor;
                // try {
                //     doctor = await db.User.findOne({
                //         where: {
                //             email: data.email
                //         }
                //     });
                // } catch (e) {
                //     return reject(e);
                // }

                // if (!doctor) {
                //     try {
                //         doctor = await db.User.create({
                //             email: data.email,
                //             roleId: 'R3',
                //             gender: data.selectedGender,
                //             address: data.address,
                //             firstName: data.fullName,
                //             phonenumber: data.phoneNumber
                //         });
                //     } catch (e) {
                //         return reject(e);
                //     }
                // }
                // // bươccs 3
                // let bookingExists;
                // try {
                //     bookingExists = await db.Booking.findOne({
                //         where: {
                //             date: data.date
                //         }
                //     });
                // } catch (e) {
                //     return reject(e);
                // }

                // if (bookingExists) {
                //     return reject('This time slot is already booked');
                // }

                // // 4. Create a new booking
                // let booking;
                // try {
                //     booking = await db.Booking.create({
                //         where: { patientId: user[0].id },
                //         defaults: {
                //             statusId: 'S1',
                //             doctorId: data.doctorId,
                //             patientId: user[0].id,
                //             date: data.date,
                //             timeType: data.timeType,
                //             token: token,
                //         }
                //     });
                // } catch (e) {
                //     return reject(e);
                // }

                // try {
                //     await emailService.sendSimpleEmail({
                //         reciverEmail: data.email,
                //         patientName: data.fullName,
                //         time: data.timeString,
                //         doctorName: data.doctorName,
                //         language: data.language,
                //         redirectLink: buildUrlEmail(data.doctorId, token)
                //     })
                // } catch (e) {
                //     return reject(e);
                // }

                // resolve({
                //         errCode: 0,
                //         errMessage: 'Save infor patient succeed!'
                //     });

                let token = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
                // 
                let user = await db.User.findOrCreate({
                    where: { email: data.email },
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                        gender: data.selectedGender,
                        address: data.address,
                        firstName: data.fullName,
                        phonenumber: data.phoneNumber
                    }
                });
                //create a booking record
                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: { patientId: user[0].id },
                        defaults: {
                            statusId: 'S1',
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token,
                            reason:data.reason,
                            insuranceCardCode:data.insuranceCardCode
                        }

                    })
                }
                await emailService.sendSimpleEmail({
                    reciverEmail: data.email,
                    patientName: data.fullName,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: buildUrlEmail(data.doctorId, token)
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Save infor patient succeed!'
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

let postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.token || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter token'
                })
            } else {

                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: 'S1'
                    },
                    raw: false
                })

                if (appointment) {
                    appointment.statusId = 'S2'
                    await appointment.save();

                    resolve({
                        errCode: 0,
                        errMessage: 'Update the appointment succeed'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Appointment has been activated or does not exist'
                    })
                }
            }

        } catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    postBookAppointment: postBookAppointment,
    postVerifyBookAppointment: postVerifyBookAppointment
}