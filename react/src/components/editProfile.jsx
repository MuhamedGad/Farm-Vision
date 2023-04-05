import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Image,
  Modal,
  Nav,
  Row,
  Tab,
} from "react-bootstrap";
import axios from "../api/axios";
import useAuthValue from "../hooks/useAuthValue";
import { toastMsg } from "./message-toast";
import useLoader from "../hooks/useLoader";
import { PersonCircle, XCircleFill } from "react-bootstrap-icons";
import { useRefetchState } from "../context/refetch";
import warningMessage from "./warningMessage";

function EditProfile({ show, onHide, user, userImg, handleRefetch }) {
  const [image, setImage] = useState(userImg);
  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [email, setEmail] = useState(user?.email);
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState(user?.address);
  const [devicesNumber, setDevicesNumber] = useState(user?.devicesNumber);
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber);

  const auth = useAuthValue();

  const [loading, setLoading] = useLoader();
  const [refetchImgState, setRefetchImgState] = useRefetchState();

  const handleUpdateInfo = async () => {
    setLoading(true);
    await axios
      .put(
        `/user/${user?.id}`,
        {
          firstName,
          lastName,
          email,
          address,
          devicesNumber,
          phoneNumber,
        },
        {
          headers: {
            "x-auth-token": auth?.token,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        setLoading(false);
        onHide();
        setTimeout(() => handleRefetch(true), 2000);
        toastMsg("success", `${res.data.message} Reloading...`);
      })
      .catch((err) => {
        toastMsg("error", err.response.data.message);
      });
  };

  const handleUpdateImage = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);
    await axios
      .put(`/logo/${auth?.id}`, formData, {
        headers: {
          "x-auth-token": auth?.token,
        },
      })
      .then((res) => {
        toastMsg("success", `${res.data.message} Reloading...`);
        setLoading(false);
        setRefetchImgState(true);
        onHide();
      })
      .catch((err) => {
        setLoading(false);
        toastMsg("error", err.response.data.message);
      });
  };

  const handleUpdatePwd = async () => {
    setLoading(true);
    await axios
      .put(
        `/password/${auth?.id}`,
        {
          oldPassword,
          password,
          confirmPassword,
        },
        { headers: { "x-auth-token": auth?.token } }
      )
      .then((res) => {
        setLoading(false);
        onHide();
        toastMsg("success", res.data.message);
      })
      .catch((err) => {
        setLoading(false);
        toastMsg("error", err.response.data.message);
      });
  };
  return (
    <Modal
      show={show}
      onHide={() => {
        setImage(userImg);
        onHide();
      }}
      size="lg"
      centered
      className="backdrop-blur bg-white/5"
    >
      <Modal.Header>
        <Modal.Title className="text-3xl font-bold text-emerald-500 ">
          Update Profile
        </Modal.Title>
        <XCircleFill
          className="close-btn"
          onClick={() => {
            setImage(userImg);
            onHide();
          }}
        />
      </Modal.Header>
      <Modal.Body>
        <Tab.Container defaultActiveKey={"Profile"}>
          <Row className="gap-y-4 ">
            <Col sm={3}>
              <Nav variant="pills" className="flex-col">
                {["Profile", "Image", "Password"].map((tab) => {
                  return (
                    <Nav.Item key={tab}>
                      <Nav.Link eventKey={tab} className="text-2xl active-tab">
                        {tab}
                      </Nav.Link>
                    </Nav.Item>
                  );
                })}
              </Nav>
            </Col>
            <Col sm={9} className="md-lg:pl-7">
              <Tab.Content>
                <Tab.Pane eventKey={"Profile"}>
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      warningMessage(handleUpdateInfo);
                    }}
                    className="flex flex-col gap-2 text-emerald-600 font-semibold text-lg"
                  >
                    <Row>
                      <Form.FloatingLabel as={Col} className="pr-1">
                        <Form.Control
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          autoComplete="off"
                          id="firstName"
                          type="text"
                          placeholder="First Name"
                          className="form-field"
                        />
                        <Form.Label className="!pl-6" htmlFor="firstName">
                          First Name *
                        </Form.Label>
                      </Form.FloatingLabel>
                      <Form.FloatingLabel as={Col} className="pl-1">
                        <Form.Control
                          value={lastName}
                          id="lastName"
                          placeholder="Last Name"
                          autoComplete="off"
                          onChange={(e) => setLastName(e.target.value)}
                          type="text"
                          className="form-field"
                        />
                        <Form.Label className="!pl-3" htmlFor="lastName">
                          Last Name *
                        </Form.Label>
                      </Form.FloatingLabel>
                    </Row>
                    <Form.FloatingLabel>
                      <Form.Control
                        id="email"
                        value={email}
                        autoComplete="off"
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        className="form-field"
                        placeholder="Email"
                      />
                      <Form.Label htmlFor="email">E-mail *</Form.Label>
                    </Form.FloatingLabel>
                    <Form.FloatingLabel>
                      <Form.Control
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        type="text"
                        className="form-field"
                        placeholder="Address Farm"
                        autoComplete="off"
                      />
                      <Form.Label htmlFor="confirmPassword">
                        Address *
                      </Form.Label>
                    </Form.FloatingLabel>
                    <Form.FloatingLabel>
                      <Form.Control
                        value={phoneNumber}
                        id="phone"
                        onChange={(e) =>
                          setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""))
                        }
                        type="text"
                        className="form-field"
                        placeholder="Phone Number"
                      />
                      <Form.Label htmlFor="phone">Phone Number *</Form.Label>
                    </Form.FloatingLabel>
                    <Form.FloatingLabel>
                      <Form.Control
                        value={isNaN(devicesNumber) ? "" : devicesNumber}
                        id="devices"
                        type="text"
                        onChange={(e) =>
                          setDevicesNumber(
                            Number.parseInt(
                              e.target.value.replace(/[^0-9]/g, "")
                            )
                          )
                        }
                        className=" form-field"
                        placeholder="Enter Max Available Devices Number"
                        autoComplete="off"
                      />
                      <Form.Label htmlFor="devices">Devices Number</Form.Label>
                    </Form.FloatingLabel>
                    <Button
                      type="submit"
                      variant="warning"
                      className="bg-yellow-500 px-4"
                    >
                      Submit
                    </Button>
                  </Form>
                </Tab.Pane>
                <Tab.Pane eventKey={"Image"}>
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      warningMessage(handleUpdateImage);
                    }}
                    className="flex flex-col gap-2"
                  >
                    <Container
                      className="cover-img flex justify-center py-3"
                      fluid
                    >
                      {image ? (
                        <Image
                          roundedCircle
                          className="max-w-[150px] w-full py-3 relative z-[1]"
                          src={URL.createObjectURL(image)}
                          alt="profile-image"
                        />
                      ) : (
                        <PersonCircle className="text-black text-8xl z-[1] relative bg-white rounded-full" />
                      )}
                    </Container>

                    <Form.Control
                      type="file"
                      className="file-choice-field"
                      onChange={(e) => setImage(e.target.files[0])}
                    />

                    <Button
                      type="submit"
                      variant="warning"
                      className="bg-yellow-500"
                    >
                      Submit
                    </Button>
                  </Form>
                </Tab.Pane>
                <Tab.Pane eventKey={"Password"}>
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      warningMessage(handleUpdatePwd);
                    }}
                    className="flex flex-col gap-2 text-lg text-emerald-600 font-semibold"
                  >
                    {!auth.admin && (
                      <Form.FloatingLabel>
                        <Form.Control
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          type="password"
                          placeholder="oldPassword"
                          className="form-field"
                        />
                        <Form.Label htmlFor="oldPassword">
                          old Password *
                        </Form.Label>
                      </Form.FloatingLabel>
                    )}
                    <Form.FloatingLabel>
                      <Form.Control
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="newPassword"
                        className="form-field"
                      />
                      <Form.Label htmlFor="newPassword">
                        New Password *
                      </Form.Label>
                    </Form.FloatingLabel>
                    <Form.FloatingLabel>
                      <Form.Control
                        id="confirmNewPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        type="password"
                        className="form-field"
                        placeholder="Confirm Password"
                      />
                      <Form.Label htmlFor="confirmNewPassword">
                        Confirm New Password *
                      </Form.Label>
                    </Form.FloatingLabel>
                    <Button
                      type="submit"
                      variant="warning"
                      className="bg-yellow-500"
                    >
                      Submit
                    </Button>
                  </Form>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Modal.Body>
    </Modal>
  );
}

export default EditProfile;
