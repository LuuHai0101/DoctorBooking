import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';


class About extends Component {

    render() {

        return (
            <div className="section-share section-about">
                <div className="section-about-header">
                    Truyền thông nói gì về Bệnh viện Hưng Hà
                </div>
                <div className="section-about-content">
                    <div className="content-left">
                        <iframe width="565"
                            height="370"
                            src="https://www.youtube.com/embed/IefC2G0XLuU"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowfullScreen></iframe>
                    </div>
                    <div className="content-right">
                        <p>
                            Chúng tôi luôn luôn
                            LẮNG NGHE
                            & HỖ TRỢ
                            Bệnh nhân
                            Nếu quý khách hàng có nhu cầu đặt lịch trực tuyến để khám - chữa bệnh, vui lòng điền đầy đủ thông tin vào biểu mẫu bên tay phả
                        </p>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(About);
