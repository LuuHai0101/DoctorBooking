import React, { Component } from "react";
import { connect } from "react-redux";
import "./HomeHeader.scss";
import logo from "../../assets/logo1.svg";
import { FormattedMessage } from "react-intl";
import { LANGUAGES } from "../../utils";
import { changeLanguageApp } from "../../store/actions";
import { withRouter } from "react-router";
import { getAllSpecialty } from "../../services/userService";

class HomeHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valueSearch: "",
      dataSearch: [],
      test: [],
      focusSearch: false,
      hoverSearch: false,
    };
    this.refSearch = React.createRef();
  }

  async componentDidMount() {
    let res = await getAllSpecialty();
    this.setState({ dataSearch: res.data });
  }

  changeLanguage = (language) => {
    this.props.changeLanguageAppRedux(language);
    //fire redux event actions
  };

  returnToHome = () => {
    if (this.props.history) {
      this.props.history.push(`/home`);
    }
  };

  handleSearch(value) {
    this.setState({
      valueSearch: value,
    });
  }

  handleFocus = (e) => {
    let currentFocusSearch = this.state.focusSearch;
    this.setState({
      focusSearch: !currentFocusSearch,
    });

    this.refSearch.current.style.display = "block";
  };

  handleBlur = (e) => {
    let currentFocusSearch = this.state.focusSearch;
    this.setState({
      focusSearch: !currentFocusSearch,
    });
    if (!this.state.hoverSearch) {
      this.refSearch.current.style.display = "none";
    }
  };

  handleMouseEnterSearch = (e)=> {
    this.setState({
      hoverSearch: true,
    });
  }

  handleMouseLeverSearch = (e)=> {
    this.setState({
      hoverSearch: false,
    });
  }

  render() {
    console.log("mouse hover ", this.state.hoverSearch)
    let language = this.props.language;
    return (
      <React.Fragment>
        <div className="home-header-container">
          <div className="home-header-content">
            <div className="left-content">
              <i className="fas fa-bars"></i>
              <img
                className="header-logo"
                src={logo}
                onClick={() => this.returnToHome()}
              />
            </div>
            <div className="center-content">
              <div className="child-content">
                <div>
                  <b>
                    {" "}
                    <FormattedMessage id="home-header.specialty" />{" "}
                  </b>
                </div>
                <div className="subs-title">
                  <FormattedMessage id="home-header.search-doctor" />
                </div>
              </div>
              <div className="child-content">
                <div>
                  <b>
                    <FormattedMessage id="home-header.health-facility" />
                  </b>
                </div>
                <div className="subs-title">
                  <FormattedMessage id="home-header.select-room" />
                </div>
              </div>
              <div className="child-content">
                <div>
                  <b>
                    <FormattedMessage id="home-header.doctor" />
                  </b>
                </div>
                <div className="subs-title">
                  <FormattedMessage id="home-header.select-doctor" />
                </div>
              </div>
              <div className="child-content">
                <div>
                  <b>
                    <FormattedMessage id="home-header.fee" />
                  </b>
                </div>
                <div className="subs-title">
                  <FormattedMessage id="home-header.check-health" />
                </div>
              </div>
            </div>
            <div className="right-content">
              <div className="support">
                <i className="fas fa-question-circle"></i>
                <FormattedMessage id="home-header.support" />
              </div>
              <div
                className={
                  language === LANGUAGES.VI
                    ? "language-vi active"
                    : "language-vi"
                }
              >
                <span onClick={() => this.changeLanguage(LANGUAGES.VI)}>
                  VN
                </span>
              </div>
              <div
                className={
                  language === LANGUAGES.EN
                    ? "language-en active"
                    : "language-en"
                }
              >
                <span onClick={() => this.changeLanguage(LANGUAGES.EN)}>
                  EN
                </span>{" "}
              </div>
            </div>
          </div>
        </div>
        {this.props.isShowBanner === true && (
          <div className="home-header-banner">
            <div className="content-up">
              <div className="title1">
                <FormattedMessage id="banner.title1" />
              </div>
              <div className="title2">
                <FormattedMessage id="banner.title2" />
              </div>
              <div className="search">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Tìm chuyên khoa khám bệnh"
                  onFocus={(e) => {
                    this.handleFocus(e);
                  }}
                  onBlur={(e) => {
                    this.handleBlur(e);
                  }}
                  onChange={(e) => {
                    this.handleSearch(e.target.value);
                  }}
                />
                <div
                  className="dataRenderSearch"
                  ref={this.refSearch}
                  onMouseEnter={(e) => {
                    this.handleMouseEnterSearch(e);
                  }}
                  onMouseLeave={(e) => {
                    this.handleMouseLeverSearch(e);
                  }}
                >
                  {this.state.dataSearch
                    .filter((item) => {
                      return item.name
                        .toLocaleLowerCase()
                        .trim()
                        .includes(
                          this.state.valueSearch.toLocaleLowerCase().trim()
                        );
                    })
                    .map((item) => (
                      <a
                        href={`/detail-specialty/${item.id}`}
                        key={item.id}
                        className="dataRenderSearch_child_container"
                      >
                        <img src={item.image} />
                        <div>{item.name}</div>
                      </a>
                    ))}
                </div>
              </div>
            </div>
            <div className="content-down">
              <div className="options">
                <div className="options-child">
                  <div className="icon-child">
                    <i className="far fa-hospital"></i>
                  </div>
                  {/* <div className="text-child">
                    <FormattedMessage id="banner.child1" />
                  </div> */}
                </div>
                <div className="options-child">
                  <div className="icon-child">
                    <i className="fas fa-mobile-alt"></i>
                  </div>
                  {/* <div className="text-child">
                    <FormattedMessage id="banner.child2" />
                  </div> */}
                </div>
                <div className="options-child">
                  <div className="icon-child">
                    <i className="fas fa-procedures"></i>
                  </div>
                  {/* <div className="text-child">
                    <FormattedMessage id="banner.child3" />
                  </div> */}
                </div>
                <div className="options-child">
                  <div className="icon-child">
                    <i className="fas fa-flask"></i>
                  </div>
                  {/* <div className="text-child">
                    <FormattedMessage id="banner.child4" />
                  </div> */}
                </div>
                <div className="options-child">
                  <div className="icon-child">
                    <i className="fas fa-user-md"></i>
                  </div>
                  {/* <div className="text-child">
                    <FormattedMessage id="banner.child5" />
                  </div> */}
                </div>
                <div className="options-child">
                  <div className="icon-child">
                    <i className="fas fa-briefcase-medical"></i>
                  </div>
                  {/* <div className="text-child">
                    <FormattedMessage id="banner.child6" />
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    userInfo: state.user.userInfo,
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HomeHeader)
);
