import axios from "../api/axios";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { toastMsg } from "../components/message-toast";
import { useEffect, useState } from "react";

import useAuth from "../hooks/useAuth";
import useLoader from "../hooks/useLoader";
import Login from "../components/login";

function Register() {
  document.title = "Register";
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [devicesNumber, setDevicesNumber] = useState(5);
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const [loader, setLoader] = useLoader();
  const [showLogin, setShowLogin] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (firstName === "" || email === "" || password === "" || address === "") {
      toastMsg("error", "fill empty fields with * :(");
    } else if (password?.length < 8) {
      toastMsg("error", "password must be at least 8 characters :(");
    } else if (password !== confirmPassword) {
      toastMsg("error", "confirm password and password must be identical :(");
    } else {
      setLoader(true);
      await axios
        .post(
          "/user",
          {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            address,
            devicesNumber,
            phoneNumber,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((res) => {
          toastMsg("success", res.data.message);
          setAuth({
            admin: res?.data.admin,
            token: res?.data.token,
            id: res?.data.user_id,
          });
          localStorage.setItem(
            "auth",
            JSON.stringify({
              admin: res?.data.admin,
              token: res?.data.token,
              id: res?.data.user_id,
            })
          );
          navigate("../");
          setLoader(false);
        })
        .catch((e) => {
          setLoader(false);
          toastMsg("error", e.response.data.message);
        });
    }
  };
  const handleLoggedIn = () => {
    navigate("/graduation-project/");
    toastMsg("info", "Logged in Already");
  };
  useEffect(() => {
    auth && handleLoggedIn();
  });

  return (
    <div className="text-lg text-emerald-600 max-w-lg w-full p-4 bg-white rounded-xl shadow-xl">
      <Form onSubmit={handleSubmit} className=" font-semibold">
        <Row className="mb-2">
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
        <Form.FloatingLabel className="mb-2">
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
        <Form.FloatingLabel className="mb-2">
          <Form.Control
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="form-field"
          />
          <Form.Label htmlFor="password">Password *</Form.Label>
        </Form.FloatingLabel>
        <Form.FloatingLabel className="mb-2">
          <Form.Control
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            className="form-field"
            placeholder="Confirm Password"
          />
          <Form.Label htmlFor="confirmPassword">Confirm Password *</Form.Label>
        </Form.FloatingLabel>
        <Form.FloatingLabel className="mb-2">
          <Form.Control
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            type="text"
            className="form-field"
            placeholder="Address Farm"
            autoComplete="off"
          />
          <Form.Label htmlFor="confirmPassword">Address *</Form.Label>
        </Form.FloatingLabel>
        <Form.FloatingLabel className="mb-2">
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
        <Form.FloatingLabel className="mb-2">
          <Form.Control
            value={isNaN(devicesNumber) ? "" : devicesNumber}
            id="devices"
            type="text"
            onChange={(e) =>
              setDevicesNumber(
                Number.parseInt(e.target.value.replace(/[^0-9]/g, ""))
              )
            }
            className=" form-field"
            placeholder="Enter Max Available Devices Number"
            autoComplete="off"
          />
          <Form.Label htmlFor="devices">Devices Number</Form.Label>
        </Form.FloatingLabel>
        <Form.Group className="flex justify-center pt-4">
          <Button type="submit" variant="success" className="bg-emerald-700">
            Register
          </Button>
        </Form.Group>
      </Form>
      <footer className="text-black text-center mt-4 font-normal">
        <p>
          Have you an account already?
          <button
            onClick={() => setShowLogin(true)}
            className="text-emerald-600 hover:text-emerald-400 cursor-pointer underline underline-offset-2 ml-2"
          >
            Login
          </button>
          <Login show={showLogin} onHide={() => setShowLogin(false)} />
        </p>
      </footer>
    </div>
  );
}

export default Register;
