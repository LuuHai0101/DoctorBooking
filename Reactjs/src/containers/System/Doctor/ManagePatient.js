import React, { Component } from 'react';
import { connect } from "react-redux";
import { FormattedMessage } from 'react-intl';
import './ManagePatient.scss';
import DatePicker from '../../../components/Input/DatePicker';
import { getAllPatientForDoctor, postSendRemedy, deleteBookingById } from '../../../services/userService';
import moment from 'moment';
import { LANGUAGES } from '../../../utils';
import RemedyModal from './RemedyModal';
import { toast } from 'react-toastify';

class ManagePatient extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentDate: moment(new Date()).startOf('day').valueOf(),
            dataPatient: [],
            isOpenRemedyModal: false,
            dataModal: {}
        }
    }

    async componentDidMount() {

        this.getDataPatient()

    }

    getDataPatient = async () => {
        let { user } = this.props;
        let { currentDate } = this.state;
        let formatedDate = new Date(currentDate).getTime();

        let res = await getAllPatientForDoctor({
            doctorId: user.id,
            date: formatedDate
        })
        if (res && res.errCode === 0) {
            this.setState({
                dataPatient: res.data
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.language !== prevProps.language) {

        }
    }

    handleOnChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        }, async () => {
            await this.getDataPatient()
        })
    }

    handleBtnConfirm = (item) => {
        console.log('check btn: ', item)
        let data = {
            doctorId: item.doctorId,
            patientId: item.patientId,
            email: item.patientData.email,
            timeType: item.timeType,
            patientName: item.patientData.firstName,

        }
        this.setState({
            isOpenRemedyModal: true,
            dataModal: data
        })

    }

    handleDeleteBookingById = (item)=>{
        console.log("check detele: ", item)
        deleteBookingById(item.id);
        this.componentDidMount()
        
    }

    closeRemedyModal = () => {
        this.setState({
            isOpenRemedyModal: false,
            dataModal: {}
        })
    }

    sendRemedy = async (dataChild) => {
        let { dataModal } = this.state;
        let res = await postSendRemedy({
            email: dataChild.email,
            imgBase64: dataChild.imgBase64,
            doctorId: dataModal.doctorId,
            patientId: dataModal.patientId,
            timeType: dataModal.timeType,
            language: this.props.language,
            patientName: dataModal.patientName,
        });
        if (res && res.errCode === 0) {
            toast.success('Send remedy succeed');
            this.closeRemedyModal();
            await this.getDataPatient();
        } else {
            toast.error('Something wrongs....')
        }

    }

    render() {

        let { dataPatient, isOpenRemedyModal, dataModal } = this.state;
        let { language } = this.props;
        return (
            <>
                <div className="manage-patient-container">
                    <div className="m-p-title">
                        Quản lý bệnh nhân khám bệnh
                    </div>
                    <div className="manage-patient-body row">
                        <div className="col-4 form-group">
                            <label>Chọn ngày khám</label>
                            <DatePicker
                                onChange={this.handleOnChangeDatePicker}
                                className="form-control"
                                value={this.state.currentDate}

                            />
                        </div>
                        <div className="col-12 table-manage-patient">
                            <table style={{ width: '100%' }} >
                                <tbody>
                                    <tr>
                                        <th>STT</th>
                                        <th>Thời gian</th>
                                        <th>Họ và tên</th>
                                        <th>Địa chỉ</th>
                                        <th>Số điện thoại</th>
                                        <th>Giới tính</th>
                                        <th>Lý do khám</th>
                                        <th>Thẻ bảo hiểm</th>
                                        <th>Actions</th>
                                    </tr>
                                    {dataPatient && dataPatient.length > 0 ?
                                        dataPatient.map((item, index) => {
                                            let time = language === LANGUAGES.VI ?
                                                item.timeTypeDataPatient.valueVi : item.timeTypeDataPatient.valueEn;
                                            let gender = language === LANGUAGES.VI ?
                                                item.patientData.genderData.valueVi : item.patientData.genderData.valueEn;
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{time}</td>
                                                    <td>{item.patientData.firstName}</td>
                                                    <td>{item.patientData.address}</td>
                                                    <td>{item.patientData.phoneNumber}</td>
                                                    <td>{gender}</td>
                                                    <td>{item.reason}</td>
                                                    <td>{item.insuranceCardCode}</td>
                                                    
                                                    <td>
                                                        <button className="mp-btn-confirm"
                                                            onClick={() => this.handleBtnConfirm(item)}>
                                                            Xác nhận
                                                        </button>
                                                        <button className='mp-btn-delete' onClick={()=>this.handleDeleteBookingById(item)}>Xoá</button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                        :
                                        <tr>
                                            <td colSpan="9" style={{ textAlign: 'center' , fontWeight: 'bold' , color: 'red'}}>Không có lịch hẹn</td>
                                        </tr>
                                    }

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <RemedyModal
                    isOpenModal={isOpenRemedyModal}
                    dataModal={dataModal}
                    closeRemedyModal={this.closeRemedyModal}
                    sendRemedy={this.sendRemedy}
                />
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        user: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
