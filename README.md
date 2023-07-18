# ecommerceServer (ecommerce server)

This project was developed as part of the Coder House Backend training.

Project status: it meets the logical requirements for course evaluation.
The use of Node.JS and Express.JS logic was prioritized over web design.

## Description

This project is a feature-rich ecommerce server that allows users to engage in various activities related to an online store. It provides functionalities such as user authentication, product browsing and filtering, shopping cart management, role-based access control, real-time chat, and more. The server is built using Node.js and Express.js, leveraging other technologies and libraries to enhance its capabilities.

## Features

- Web App.
- ecommerce Server.
- Websocket.
- Cookies.
- Third party Authentication method.
- JWT.
- Protect routes.
- Messages Service: Email ad SMS.
- Middlewares.
- Error handling.
- Data persistence: NoSQL (MongoDB) and FileSystem.

- User Authentication: Users can register an account using a form or through third-party authentication methods. They can also log in with their credentials and restore their password via email if needed.
- Real-time Product Updates: Users can view products in real-time and apply various filters to find the desired items.
- Product Management: Depending on their credentials, users can upload new products to the store, enabling the expansion of the product catalog.
- Secure Sessions: The server utilizes cookies and sessions to maintain user sessions and ensure secure communication.
- Role-based Access Control: All routes are protected, and user permissions are based on their assigned roles. Different roles enable users to perform specific HTTP requests and access different views.
- Real-time Chat: The server features a real-time chat system, allowing users to communicate with each other or with customer support.
- Shopping Cart Functionality: Users can add products to their shopping cart, manage the cart contents, and proceed to checkout when ready.
- User Role Management: Administrators or authorized users can change the roles of other users, granting or revoking certain privileges.
- Integration with Mailing Service: The project integrates a mailing service to handle password restoration and send notifications for successful purchases. Users can restore their password via email and receive email notifications when a purchase is completed.
- Integration with SMS Service: In addition to email notifications, the project also integrates an SMS service to provide notifications for successful purchases. Users will receive an SMS message to their registered phone number when a purchase is completed.
- Data persistence: The project supports two types of data persistence depending on the value set in the environment variables file. It can utilize MongoDB, a NoSQL database, or the FileSystem for storing data.

## Prerequisites

To Start this project properly you must have installed Node js on your device with a version not older than 12.X.

If you want to run this project on `development` mode you must have installed the tool `nodemon`on your device.

### Environment Variables

The project uses environment variables to store sensitive information and configuration settings. To configure the project, create a .env file in the root directory of the project and populate it with the variables that you can find in the .env.example file.

## Download & Install

### `git clone`

To create a copy of this repository in your local, use the `git clone` command with the repository's URL link.

### `npm install`

Before running the project you may have to install the dependencies used in the project.
Run `npm install` in the terminal of the project to do so.

### `npm start`

Run the app in the development mode.\
Open [http://localhost:8080](http://localhost:8080) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Starting project

run `npm start` on a terminal located in project's root directory to start the project.

run `npm run dev` on a terminal located in project's root directory to start project on `development` mode.

## Testing

Testing is an important part of ensuring the reliability and quality of this project. The following frameworks and libraries are used for testing:

- [Mocha](https://mochajs.org/): A feature-rich JavaScript test framework.
- [Chai](https://chaijs.com/): An assertion library for Node.js and the browser.
- [SuperTest](https://github.com/visionmedia/supertest): A library for HTTP assertions and integration testing.

### Running Tests

To run the test suite for this project, follow these steps:

1. Make sure you have installed all the project dependencies by running the following command:

`npm install`

2. 1. Execute the following command in the terminal to run the unit tests:

`npm run test:unit`

This command will run the unit tests using Mocha and Chai, and display the test results in the console.


2. 2. Execute the following command in the terminal to run the integration tests:

`npm run test:integration`

This command will run the integration tests using Mocha, Chai, and SuperTest, and display the test results in the console.

By running the unit tests and integration tests, you can ensure the proper functioning of the individual components and the integration between different parts of the project.

Make sure to replace `"test:unit"` and `"test:integration"` with the actual script names defined in the `package.json` file.

Feel free to adjust the instructions or provide additional information as needed for running the tests in your project.


## Tech Stack

**Client:** Javascript, Handlebars, HTML5, CSS3, Bootstrap, SweetAlert.

**Server:** Node.JS, Express.JS, JWT.

**Database:** MongoDB, Mongoose, FileSystem.

**Testing:** Mocha, Chai, SuperTest.

**Version controller:** GIT, GitHub.

**Pattern Design:** MVC.

**Others:** Winston, Swagger, Faker.

## Note on Frontend Functionalities

Please note that while this project includes a rich set of backend functionalities, some of these features may not be implemented in the frontend or Handlebars templates. The focus of this project was primarily on showcasing the backend logic using Node.js and Express.js.

If you intend to extend the frontend or implement additional features, you may need to make corresponding HTTP requests to the backend API endpoints that handle these functionalities. You can refer to the API documentation or examine the backend code to understand the available endpoints and their respective functionality.

Feel free to contribute to the project by implementing the necessary frontend components or extending the existing functionality to create a more complete user experience.

## Contributing

Contributions to the project are welcome. Feel free to use the project code and contribute improvements or new features.

## Licence

This project is licensed under the MIT License.

## Authors

- [@KevinSpigel](https://github.com/KevinSpigel)
