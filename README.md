# SMARTJ

SMARTJ is a web application designed to help active job seekers practice their interview skills and find available jobs in their field of study.

## What does this project do?

SMARTJ provides:

1. Interactive interview practice sessions with customizable formats
2. Access to a diverse question bank tailored to user needs
3. Flexible answer formats including video recording and written responses
4. A curated job finder with pre-filtered links to software engineering positions

## Why is this project useful?

Interview skills are crucial for job seekers. SMARTJ aims to:

- Improve users' interview performance through customized practice
- Streamline the job search process for software engineering roles
- Provide a platform for self-reflection and skill improvement

## Technologies Used

SMARTJ is built using a modern web development stack. Here are the key technologies and libraries we've used:

### Core Technologies

- React.js - A JavaScript library for building user interfaces
- Node.js - JavaScript runtime built on Chrome's V8 JavaScript engine
- npm - Package manager for JavaScript
- MongoDB - Database for keeping track of users.

### Frontend

- Bootstrap - CSS framework for responsive and mobile-first websites
- Font Awesome - Icon set and toolkit

### Testing

- Jest - JavaScript Testing Framework
- React Testing Library - Testing utilities for React

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/download/prebuilt-installer) for running web server <br /> Recommended version: v21.7.3 <br />
  Note: Node.js installation cincludes npm installation
- [Npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) (Node Package Manager) for installing packages from npm registry<br />
  Downloading Node.js should automatically install npm for you
- [MongoDB](https://www.mongodb.com/try/download/community) For running a database that will keep track of user data <br/> Recommended version: v8.0.0 <br/>
- [OpenAI API Key](https://openai.com/index/openai-api/) For running the ChatGPT grading. You will need to sign up, add balance if needed and generate a secret key for use as an environment variable.

### Installation

1. Clone the repo: `git clone https://github.com/SOFTENG310-Team4/SMARTJ.git`
2. Navigate to root directory of the Repository
3. Create a .env file named ".env" in the root folder and add your OpenAI API key (should be in the format REACT*APP_OPENAI_API_KEY=\_your key*)
4. Run `npm install` to install the necessary dependencies
5. Start the MongoDB server, whether through client or `mongod` via command line
6. Run `node server.js` to start the backend server
7. Start a new terminal and run `npm start` to run the web application
8. After running npm start, open your browser and navigate to `http://localhost:3000`

### Running Tests

- To run the testing of the SMARTJ project, navigate to the root directory and run `npm test -- --watchAll=false`
- To access more specific Watch Usage testing (such as running failed tests), simply run `npm test`

## Usage

There are two main features of the SMARTJ application: Interview Practice and Job Finder<br />
**This section gives a brief rundown on how to use these features.**

### Interview Practice

- Navigate to the Interview Practice page through the home page or navigation bar
- Choose your interview setting preference
- Perform the interview practice

### Job Finder

- Navigate to the Job Finder page through the home page or navigation bar
- On the page, you can choose to click and be redirected to 6 Software Engineering curated job finding links from sites such as Prosple

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## Versions

- v1.0.0 - Initial release with basic functionality (A1 Release)

## Getting Help

If you need help, please:

1. Check our [Contributing Guidelines](CONTRIBUTING.md) for information on how to report issues
2. Contact us using our collaborative email: team4smartj@gmail.com

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for more details on how to get started.

## Acknowledgements

- We acknowledge our Initial Project developers, Anna Lin, Seth Yoo, Tony Yin, Minsung Cho, Jaewon Kim, Rusiru Dharmasekhara for their hard work
- We acknowledge our A2 developers who continued the project, Albert Sun, Quaid Sage, Joel Kendall, Maahir Nafis, Allan Xu, Max Chen
- Special Thanks to our Project Supervisor, Kelly Blincoe for allowing the project to flourish

This project is part of the SOFTENG 310 course at the University of Auckland.
