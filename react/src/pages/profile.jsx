import { Button, ButtonGroup, Container, Image } from "react-bootstrap";
import axios from "../api/axios";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { toastMsg } from "../components/message-toast";
import { useNavigate } from "react-router-dom";
import useLoader from "../hooks/useLoader";
import removeCookie from "../hooks/removeCookie";
import EditProfile from "../components/editProfile";
import { useUserImage } from "../context/userImg";
import { PersonCircle } from "react-bootstrap-icons";

function Profile() {
  document.title = "Profile";
  const [auth, setAuth] = useAuth();
  const [loader, setLoader] = useLoader();
  const [user, setUser] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const userImg = useUserImage();
  const navigate = useNavigate();
  const handleRefetch = (state) => {
    setRefetch(state);
  };
  const getData = async () => {
    try {
      setLoader(true);
      await axios
        .get(`user/${auth?.id}`, {
          headers: { "x-auth-token": auth?.token },
        })
        .then((res) => {
          setUser(res.data.data);
          setLoader(false);
          setRefetch(false);
        });
    } catch (err) {
      setLoader(false);
      toastMsg("error", "You Must Login or Register first");
      navigate("../");
    }
  };

  useEffect(() => {
    getData();
  }, [auth, refetch]);

  return (
    user && (
      <>
        <Container className="max-w-lg w-full !px-0 pb-4 flex flex-col gap-5 items-center bg-neutral-200/50 !rounded-xl shadow-xl">
          <Container className="cover-img flex justify-center py-3" fluid>
            {userImg ? (
              <Image
                roundedCircle
                className="max-w-[150px] w-full h-[150px] relative z-[1]"
                src={URL.createObjectURL(userImg)}
                alt="profile-image"
              />
            ) : (
              <PersonCircle className="text-9xl bg-white rounded-full relative z-[1]" />
            )}
          </Container>
          <Container className="px-4 flex flex-col gap-4">
            <h1 className="text-6xl md:text-4xl text-center">
              {user?.firstName + " " + user?.lastName}
            </h1>
            <ul className="text-2xl flex flex-col gap-6">
              <li>E-mail: {user?.email}</li>
              <li>Phone Number: {user?.phoneNumber}</li>
              <li>Devices Number: {user?.devicesNumber}</li>
              <li>
                Devices Number Available:{" "}
                {user?.devicesNumber - user?.loginDevices}
              </li>
              <li>Address: {user?.address}</li>
            </ul>
            <ButtonGroup>
              <Button
                variant="info"
                onClick={() => setShowEdit(true)}
                className="bg-sky-500 text-white"
              >
                Update
              </Button>
              <EditProfile
                show={showEdit}
                onHide={() => setShowEdit(false)}
                user={user}
                userImg={userImg}
                handleRefetch={handleRefetch}
              />
              <Button
                variant="danger"
                className="bg-red-500"
                onClick={async () => {
                  setLoader(true);
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
                      navigate({ pathname: "/graduation-project/" });
                      toastMsg("success", res.data.message);
                      setLoader(false);
                      setAuth(null);
                      removeCookie("userIn");
                    })
                    .catch((err) => {
                      setLoader(false);
                      toastMsg("error", err.response.data.message);
                    });
                }}
              >
                Logout
              </Button>
            </ButtonGroup>
          </Container>
        </Container>
      </>
    )
  );
}

export default Profile;
