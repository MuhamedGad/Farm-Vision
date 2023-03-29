# ERD: Smart Farm

We'll use a basic client/server architecture, where a single server is deployed on a cloud provider next to a relational database, and serving HTTP traffic from a public endpoint.

## Schema:

We'll need at least the following entities to implement the service:

**Users**:
| Column | Type |
|--------|------|
| id | INT |
| firstName | STRING |
| lastName | STRING |
| password | STRING |
| email | STRING |
| address | STRING |
| image | STRING |
| createdAt | DATETIME |
| updatedAt | DATETIME |
| admin | BOOLEAN |
| devicesNumber | NUMBER |

**Tokens**:
| Column | Type |
|--------|------|
| id | INT |
| token | STRING |
| UserId | STRING |
| createdAt | DATETIME |
| updatedAt | DATETIME |


## Server

A simple HTTP server is responsible for authentication, serving stored data, and
potentially ingesting and serving analytics data.

- Node.js is selected for implementing the server for speed of development.
- Express.js is the web server framework.
- Sequelize to be used as an ORM.

### Auth

For v1, a simple JWT-based auth mechanism is to be used, with passwords encrypted and stored in the database. OAuth is to be added initially or later for Google + Facebook and maybe others (Github?).


### API 

**User**:

```
/api/user       [POST]
/api/user/:id   [GET]
/api/user/:id   [PUT]
/api/user/:id   [DELETE]
```

**Login**:

```
/api/login      [POST]
```

**Logout**:

```
/api/logout     [POST]
```

**Logo**:

```
/api/logo/:id   [PUT]
/api/logo/:id   [GET]
```

**Password**:

```
/api/password/:id   [PUT]
```

**Admin**:

```
/api/admin/:id   [PUT]
```


### Connection:
**Host URL**:
```
https://smart-farm.onrender.com
```


## Clients

For now we'll start with a web clients, and mobile clients:

- The web client will be implemented in React.js.

- The mobile client will be implemented in Flutter.
<!-- API server will serve a static bundle of the React app.
Uses ReactQuery to talk to the backend.
Uses Chakra UI for building the CSS components. -->

<!-- ## Hosting

The code will be hosted on Github, PRs and issues welcome.

The web client will be hosted using any free web hosting platform such as firebase or netlify. A domain will be purchased for the site, and configured to point to the web host's server public IP.

We'll deploy the server to a (likely shared) VPS for flexibility. The VM will have HTTP/HTTPS ports open, and we'll start with a manual deployment, to be automated later using Github actions or similar. The server will have closed CORS policy except for the domain name and the web host server. -->