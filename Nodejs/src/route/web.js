import express from "express";
import homeControllers from "../controllers/homeController";
import userControllers from "../controllers/userController";
import doctorControllers from "../controllers/doctorController";
import patientController from "../controllers/patientController";
import specialtyController from "../controllers/specialtyController";
import clinicController from "../controllers/clinicController";
import statisticController from "../controllers/statisticController";
let router = express.Router();

let initWebRoutes = (app) => {

    router.get('/', homeControllers.getHomePage);
    router.get('/crud', homeControllers.getCRUD);
    router.post('/post-crud', homeControllers.postCRUD);
    router.get('/get-crud', homeControllers.displayGetCRUD);
    router.get('/edit-crud', homeControllers.getEditCRUD);
    router.post('/put-crud', homeControllers.putCRUD);
    router.get('/delete-crud', homeControllers.deleteCRUD);

    router.post('/api/login', userControllers.handleLogin);
    router.get('/api/get-all-users', userControllers.handleGetAllUsers);
    router.post('/api/create-new-user', userControllers.handleCreateNewUser);
    router.put('/api/edit-user', userControllers.handleEditUser);
    router.delete('/api/delete-user', userControllers.handleDeleteUser); //restApi
    router.get('/api/allcode', userControllers.getAllCode);

    //doctor
    router.get('/api/top-doctor-home', doctorControllers.getTopDoctorHome);
    router.get('/api/get-all-doctors', doctorControllers.getAllDoctors);
    router.post('/api/save-infor-doctors', doctorControllers.postInforDoctor);
    router.get('/api/get-detail-doctor-by-id', doctorControllers.getDetailDoctorById);
    router.post('/api/bulk-create-schedule', doctorControllers.bulkCreateSchedule);
    router.get('/api/get-schedule-doctor-by-date', doctorControllers.getScheduleByDate);
    router.get('/api/get-extra-infor-doctor-by-id', doctorControllers.getExtraInforDoctorById);
    router.get('/api/get-profile-doctor-by-id', doctorControllers.getProfileDoctorById);

    router.get('/api/get-list-patient-for-doctor', doctorControllers.getListPatientForDoctor);
    router.post('/api/send-remedy', doctorControllers.sendRemedy);

    router.post('/api/patient-book-appointment', patientController.postBookAppointment);
    router.post('/api/verify-book-appointment', patientController.postVerifyBookAppointment);

    //specialty
    router.post('/api/create-new-specialty', specialtyController.createSpecialty);
    router.get('/api/get-specialty', specialtyController.getAllSpecialty);
    router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById);
    router.get('/api/get-specialty-by-id', specialtyController.getDetailSpecialtyById2);
    router.get('/api/delete-specialty-by-id', specialtyController.deleteSpecialtyById);
    router.post('/api/update-specialty', specialtyController.updateSpecialty);

    // clinic
    router.post('/api/create-new-clinic', clinicController.createClinic);
    router.get('/api/get-clinic', clinicController.getAllClinic);
    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById);

    // checkboking 
    router.get('/api/getbookingByDateAndDoctorId', patientController.callBooking);// trả ra dữ danh sách đã đặt bởi id của doctor và ngày đặt
    //deletebooked
    router.get('/api/deleteBookingById', patientController.deleteBooking);

    // Statistic
    router.get('/api/get-statistic', statisticController.getStatistic);

    return app.use("/", router);

}
module.exports = initWebRoutes;