import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Row,
  Col,
  Card,
  CardText,
  CardTitle,
  CardBody,
  CardImg,
} from "react-bootstrap";

interface User {
  id: number;
  name: string;
  email: string;
  address: {
    street: string;
  };
  photo: string;
}

function User() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false); // Kartların yüklendiğini kontrol etmek için state
  const [image, setImage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );
        if (!response.ok) {
          const errorData = await response.json();
          console.error("API HATASI: " + errorData);
          throw new Error(errorData);
        }
        const data = await response.json();
        console.log(data);

        const userRandomPhoto = await Promise.all(
          data.map(async (user) => {
            const randomResponse = await fetch("https://randomuser.me/api/");
            const randomData = await randomResponse.json();
            const photo = randomData.results[0].picture_large;

            return {
              ...user,
              photo,
            };
          })
        );

        setUsers(userRandomPhoto);
      } catch (err) {
        console.error("Kullanıcılar yüklenirken hata oluştu" + err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <>
      <Container>
        <Row>
          {users.map(({ id, name, email, address, photo }) => (
            <Col key={id} xs={12} xl={4} lg={6} md={12}>
              <Card className="card">
                <CardImg src={photo}></CardImg>
                <CardBody>
                  <CardText>İsim: {name}</CardText>
                  <CardText>E-Posta: {email}</CardText>
                  <CardText>Adres: {address.street}</CardText>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}

export default User;
