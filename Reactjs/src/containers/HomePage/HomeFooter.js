import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';


class HomeFooter extends Component {

    render() {

        return (
           <div className="home-footer">
                <p>&copy; 2023 Lưu Hải.More information.
                    <a target="_blank" href="https://www.facebook.com/giacat.hai.33">
                    &#8594; click here &#8592;
                    </a>
                </p>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
