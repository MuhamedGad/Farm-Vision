import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "/logo.png";
import {
  Button,
  Container,
  Image,
  Nav,
  Navbar,
  Offcanvas,
} from "react-bootstrap";
import { toastMsg } from "./message-toast";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import useLoader from "../hooks/useLoader";
import { useEffect, useState } from "react";
import removeCookie from "../hooks/removeCookie";
import Login from "./login";
import {
  BoxArrowInRight,
  BoxArrowLeft,
  CaretDownFill,
  PersonCircle,
  PersonFill,
  Speedometer,
  XCircleFill,
} from "react-bootstrap-icons";
import { setUserImage } from "../context/userImg";
import { useRefetchState } from "../context/refetch";

function NavBar() {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const [loader, setLoader] = useLoader();
  const [userImg, setUserImg] = setUserImage();
  const [showLogin, setShowLogin] = useState(false);
  const [showList, setShowList] = useState(false);
  const [showNavList, setShowNavList] = useState(false);
  const [refetch, setRefetch] = useRefetchState();

  const handleLogout = async () => {
    setLoader(true);
    setShowLogin(false);
    await axios
      .post(
        "/logout",
        {},
        {
          headers: {
            "x-auth-token": auth.token,
          },
        }
      )
      .then((res) => {
        navigate({ pathname: "./" });
        toastMsg("success", res.data.message);
        setLoader(false);
        setAuth(null);
        removeCookie("userIn");
      })
      .catch((err) => {
        setLoader(false);
        toastMsg("error", err.response.data.message);
      });
  };
  const getAvatar = async () => {
    await axios
      .get(`/logo/${auth?.id}`, {
        responseType: "blob",
        headers: { "x-auth-token": auth?.token },
      })
      .then((imgRes) => {
        setUserImg(imgRes.data);
        setRefetch(false);
      })
      .catch(() => setUserImg(null));
  };
  const hideLoginForm = () => {
    setShowLogin(false);
  };
  useEffect(() => {
    auth && getAvatar();
    !auth && hideLoginForm();
  }, [auth, refetch]);
  return (
    <Navbar
      sticky="top"
      expand="md"
      className="backdrop-blur bg-emerald-600/40 z-40"
    >
      <Container>
        <Navbar.Brand className="order-1 md-lg:order-2">
          <Link to={"./"} className="flex items-center">
            <img src={logo} alt="logo" className="w-[50px]" />
            <span>
              <strong className="text-emerald-400 text-4xl">Plant</strong>hie
            </span>
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle
          onClick={() => setShowNavList(true)}
          aria-controls="basic-navbar-nav"
        />
        <Offcanvas
          show={showNavList}
          onHide={() => setShowNavList(false)}
          responsive="md"
          id="basic-navbar-nav"
          placement="start"
          className="order-2 md:order-1 md:bg-white/40 md:backdrop-blur-md"
        >
          <Offcanvas.Header>
            <Offcanvas.Title>
              <strong className="text-emerald-400 text-4xl">Plant</strong>hie
            </Offcanvas.Title>
            <XCircleFill
              className="close-btn"
              onClick={() => setShowNavList(false)}
            />
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="items-center text-xl font-bold gap-10 py-3">
              {["Home", "About", "Contact", "Detection App"].map((tab, i) => {
                const links = ["./", "about", "contact", "app"];
                return (
                  <Nav.Item key={tab}>
                    <NavLink to={links[i]} className="link hover:text-white">
                      {tab}
                    </NavLink>
                  </Nav.Item>
                );
              })}
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>

        {auth ? (
          <div
            id="avatarDropdownList"
            className="relative inline-block order-3"
          >
            <button
              className="flex items-center gap-2 focus:outline-none"
              onClick={() => setShowList(!showList)}
            >
              {userImg ? (
                <Image
                  roundedCircle
                  className="h-8 w-8"
                  src={URL.createObjectURL(userImg)}
                  alt="Avatar"
                />
              ) : (
                <PersonCircle className="bg-white rounded-full text-3xl" />
              )}
              <CaretDownFill className="text-xs" />
            </button>
            <div
              className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ${
                !showList && "hidden"
              }`}
            >
              <div className="py-2">
                <Link
                  onClick={() => setShowList(false)}
                  to={"/graduation-project/profile"}
                  className="flex items-center gap-2 px-4 py-2 text-slate-800 hover:bg-gray-200 "
                >
                  <PersonFill />
                  Profile
                </Link>
                {auth?.admin && (
                  <Link
                    to={"dashboard"}
                    onClick={() => setShowList(false)}
                    className="flex items-center gap-2 px-4 py-2 text-slate-800 hover:bg-gray-200"
                  >
                    <Speedometer />
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setUserImg(null);
                    setShowList(false);
                  }}
                  className="w-full px-4 py-2 text-gray-800 hover:bg-gray-200 flex items-center gap-2"
                >
                  <BoxArrowLeft />
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <Button
              variant="success"
              className="bg-green-700 order-3 flex items-center gap-2"
              onClick={() => setShowLogin(true)}
            >
              <BoxArrowInRight />
              Login
            </Button>
            <Login show={showLogin} onHide={hideLoginForm} />
          </>
        )}
      </Container>
    </Navbar>
  );
}

export default NavBar;
