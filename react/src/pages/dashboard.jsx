import { useEffect, useState } from "react";
import axios from "../api/axios";
import useAuthValue from "../hooks/useAuthValue";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  Modal,
  Row,
} from "react-bootstrap";
import {
  PersonCircle,
  ThreeDotsVertical,
  XCircleFill,
} from "react-bootstrap-icons";
import { toastMsg } from "../components/message-toast";
import useLoader from "../hooks/useLoader";
import EditProfile from "../components/editProfile";
import warningMessage from "../components/warningMessage";
import { useUserImage } from "../context/userImg";

function Dashboard() {
  const auth = useAuthValue();
  const [users, setUsers] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [userDisplayed, setUserDisplayed] = useState(null);
  const [refetch, setRefetch] = useState(false);
  const [loading, setLoading] = useLoader();
  const [showEdit, setShowEdit] = useState(false);
  const userImg = useUserImage();
  const getUsers = async () => {
    setLoading(true);
    await axios
      .get("/user", {
        headers: {
          "x-auth-token": auth?.token,
        },
      })
      .then((res) => {
        setLoading(false);
        setRefetch(false);
        setUsers(res.data.data);
      });
  };

  const handleDelete = async (id) => {
    setLoading(true);

    await axios
      .delete(`/user/${id}`, {
        headers: {
          "x-auth-token": auth?.token,
        },
      })
      .then((res) => {
        setTimeout(() => setRefetch(true), 2000);
        setLoading(false);
        toastMsg("success", `${res.data.message} Reloading...`);
      });
  };
  const handleUpdateAdmin = async (id) => {
    setLoading(true);
    await axios
      .put(
        `/admin/${id}`,
        {},
        {
          headers: {
            "x-auth-token": auth?.token,
          },
        }
      )
      .then((res) => {
        setTimeout(() => setRefetch(true), 2000);
        setLoading(false);
        toastMsg("success", `${res.data.message} Reloading...`);
      })
      .catch((err) => {
        toastMsg("error", err.response.data.message);
        setLoading(false);
      });
  };
  const handleRefetch = (state) => {
    setRefetch(state);
  };
  useEffect(() => {
    getUsers();
  }, [refetch]);
  return (
    <div className="flex flex-col items-center px-3 gap-4">
      {userDisplayed && (
        <Details
          user={userDisplayed}
          show={showDetails}
          onHide={() => setShowDetails(false)}
        />
      )}

      <h1 className="text-6xl w-full flex justify-between items-center">
        <u>Users</u> <Button className="bg-blue-600">Add User</Button>
      </h1>
      <Container>
        <Row className="gap-2">
          {users.map((user) => {
            return (
              <Col className="!p-0" key={user.id}>
                <Card>
                  <Card.Header className="bg-gray-200 relative">
                    {(Date.now() - Date.parse(user.createdAt)) / 1000 <
                    604800 ? (
                      <Badge className="absolute bottom-2 left-2 text-emerald-400 !bg-white/50 !backdrop-blur-sm">
                        New
                      </Badge>
                    ) : (
                      (Date.now() - Date.parse(user.updatedAt)) / 1000 <
                        604800 && (
                        <Badge className="absolute bottom-2 left-2 text-emerald-400 !bg-white/50 !backdrop-blur-sm">
                          Updated Recently
                        </Badge>
                      )
                    )}
                    <div className="flex justify-center items-center py-2">
                      <PersonCircle className="text-8xl md:text-6xl bg-white rounded-full" />
                    </div>
                  </Card.Header>
                  <Card.Body className="text-lg">
                    <Card.Title className="flex items-center justify-between text-emerald-600 ">
                      <p className="w-52 !truncate">{user.email}</p>
                      <Dropdown drop="down">
                        <Dropdown.Toggle
                          className={`after:!hidden !border-none !bg-transparent text-black`}
                        >
                          <ThreeDotsVertical />
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="p-2">
                          <Dropdown.Item
                            disabled={user.id === auth.id || user.admin}
                            className="hover:text-white text-center hover:bg-red-600 active:bg-red-600"
                            onClick={() =>
                              warningMessage(handleDelete, user.id)
                            }
                          >
                            Delete
                          </Dropdown.Item>
                          <Dropdown.Item
                            disabled={user.id === auth.id}
                            className="hover:text-white text-center hover:bg-yellow-500 active:bg-yellow-500"
                            onClick={() =>
                              warningMessage(handleUpdateAdmin, user.id)
                            }
                          >
                            {user.admin ? "Remove" : "Add"} Admin
                          </Dropdown.Item>
                          <Dropdown.Item
                            className="hover:text-white text-center hover:bg-sky-500 active:bg-sky-500"
                            onClick={() => {
                              setUserDisplayed(user);
                              setShowDetails(true);
                            }}
                          >
                            Details
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => setShowEdit(true)}
                            className="hover:text-white text-center hover:bg-yellow-500 active:bg-yellow-500"
                          >
                            Edit
                          </Dropdown.Item>
                          <EditProfile
                            show={showEdit}
                            onHide={() => setShowEdit(false)}
                            user={user}
                            userImg={userImg}
                            handleRefetch={handleRefetch}
                          />
                        </Dropdown.Menu>
                      </Dropdown>
                    </Card.Title>
                    <Card.Text>{`${user.firstName} ${user.lastName} ${
                      user.id === auth.id ? "(you)" : ""
                    }`}</Card.Text>
                    <Card.Text>{user.phoneNumber}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </div>
  );
}

export default Dashboard;

const Details = ({ show, user, onHide }) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header>
        <Modal.Title>Details</Modal.Title>
        <XCircleFill onClick={onHide} className="close-btn" />
      </Modal.Header>
      <Modal.Body>
        <h1 className="text-6xl md:text-4xl text-center text-emerald-500">
          {user?.firstName + " " + user?.lastName}
        </h1>
        <ul className="text-2xl flex flex-col gap-6 sm:text-[20px]">
          <li>
            ID: <span className="text-emerald-500">{user?.id}</span>
          </li>
          <li>
            E-mail: <span className="text-emerald-500">{user?.email}</span>
          </li>
          <li>
            Phone Number:{" "}
            <span className="text-emerald-500">{user?.phoneNumber}</span>
          </li>
          <li>
            Devices Number:{" "}
            <span className="text-emerald-500">{user?.devicesNumber}</span>
          </li>
          <li>
            Devices Number Available:{" "}
            <span className="text-emerald-500">
              {user?.devicesNumber - user?.loginDevices}
            </span>
          </li>
          <li>
            Address: <span className="text-emerald-500">{user?.address}</span>
          </li>
          <li>
            Created at:{" "}
            <span className="text-emerald-500">{user?.createdAt}</span>
          </li>
          <li>
            Last update:{" "}
            <span className="text-emerald-500">{user?.updatedAt}</span>
          </li>
        </ul>
      </Modal.Body>
    </Modal>
  );
};
