import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./ManageSpecialty.scss";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { CommonUtils } from "../../../utils";
import {
  createNewSpecialty,
  getAllSpecialty,
  deleteSpecialtyById,
  getSpecialtyById,
  updateSpecial
} from "../../../services/userService";
import { toast } from "react-toastify";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      name: "",
      imageBase64: "",
      descriptionHTML: "",
      descriptionMarkdown: "",
      ListSpecialty: [],
      show: false,
      refEditForm: "",
    };
  }

  async componentDidMount() {
    let res = await getAllSpecialty();
    this.setState({ ListSpecialty: res.data });
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.language !== prevProps.language) {
    }
  }

  handleOnChangeInput = (event, id) => {
    let stateCopy = { ...this.state };
    stateCopy[id] = event.target.value;
    this.setState({
      ...stateCopy,
    });
  };

  handleEditorChange = ({ html, text }) => {
    this.setState({
      descriptionHTML: html,
      descriptionMarkdown: text,
    });
  };

  handleOnChangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      this.setState({
        imageBase64: base64,
      });
    }
  };

  handleSaveSpecialty = async () => {
    if ( typeof(this.state.id) != 'number') {
      let res = await createNewSpecialty(this.state);
      if (res && res.errCode === 0) {
        toast.success("Add new specialty succeeds!");
        this.setState({
          name: "",
          imageBase64: "",
          descriptionHTML: "",
          descriptionMarkdown: "",
        });
      } else {
        toast.error("Something wrongs....");
        console.log("check res: ", res);
      }
      this.handleClose();
      this.componentDidMount();
    }
    else{
      let data = {
        id: this.state.id,
        name: this.state.name,
        descriptionHTML: this.state.descriptionHTML,
        descriptionMarkdown: this.state.descriptionMarkdown,
        imageBase64: this.state.imageBase64
      }
      let res = await updateSpecial(data)
      this.setState({
        show: false
      })
      this.componentDidMount()
    }
  };

  handleDeleteBtn = async (id) => {
    await deleteSpecialtyById(id);
    this.componentDidMount();
  };

  handleClose = () => {
    this.setState({ show: false });
  };

  handleShow = () => {
    this.setState({ show: true });
  };

  AddSpecialty = () => {
    this.setState({
      refEditForm: "Thêm mới chuyên khoa",
    });
    this.handleShow();
  };
  UpdateSpecialty = async (id) => {
    let data = await getSpecialtyById(id)
    this.setState({
      refEditForm: "Chỉnh sửa chuyên khoa",
      id: data.id,
      imageBase64: data.imageBase64,
      descriptionHTML: data.descriptionHTML,
      descriptionMarkdown: data.descriptionMarkdown,
      name: data.name
    });
    this.handleShow();
  };

  render() {
    return (
      <div className="manage-specialty-container">
        <div className="ms-title">Quản lý chuyên khoa</div>
        <Button
          variant="primary"
          className="float-right m-2"
          onClick={(e) => {
            this.AddSpecialty();
          }}
        >
          Thêm mới
        </Button>
        <Table striped bordered hover responsive>
          <thead className="bg-success text-center">
            <tr>
              <th>STT</th>
              <th>Tên chuyên khoa</th>
              <th>Ảnh</th>
              <th>Mô tả</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.ListSpecialty.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>
                  <img src={item.image} alt="Image" className="_img" />
                </td>
                <td>
                  <div className="row-height">
                    <span
                      dangerouslySetInnerHTML={{ __html: item.descriptionHTML }}
                    />
                  </div>
                </td>
                <td>
                  <Button
                    type="button"
                    className="btn btn-warning m-2"
                    onClick={(e) => {
                      this.UpdateSpecialty(item.id);
                    }}
                  >
                    Sửa
                  </Button>
                  <Button
                    type="button"
                    className="btn btn-danger m-2"
                    onClick={(e) => this.handleDeleteBtn(item.id)}
                  >
                    Xoá
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Modal
          show={this.state.show}
          onHide={(e) => {
            this.handleClose();
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>{this.state.refEditForm}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="add-new-specialty row">
              <div className="col-6 form-group">
                <label>Tên chuyên khoa</label>
                <input
                  className="form-control"
                  type="text"
                  value={this.state.name}
                  onChange={(event) => this.handleOnChangeInput(event, "name")}
                />
              </div>
              <div className="col-6 form-group">
                <label>Ảnh chuyên khoa</label>
                <input
                  className="form-control-file"
                  type="file"
                  onChange={(event) => this.handleOnChangeImage(event)}
                />
              </div>
              <div className="col-12">
                <MdEditor
                  style={{ height: "350px" }}
                  renderHTML={(text) => mdParser.render(text)}
                  onChange={this.handleEditorChange}
                  value={this.state.descriptionMarkdown}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={(e) => {
                this.handleClose();
              }}
            >
              Đóng
            </Button>
            <Button
              variant="primary"
              onClick={(e) => {
                this.handleSaveSpecialty();
              }}
            >
              Lưu
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty);
