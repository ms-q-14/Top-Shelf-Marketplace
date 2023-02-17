<br/>
<p align="center">
  <a href="https://github.com/SahilHakimiUofT/topshelf">
    <img src="https://i.imgur.com/miQkA0C.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">TopShelf</h3>

  <p align="center">
    Where the hunt for collectibles never ends - live auctions every day
    <br/>
    <br/>
    <a href="https://top-shelf.tech/"><strong>View Live Demo »</strong></a>
    <br/>
    <br/>
  </p>
</p>



## Table Of Contents

* [About the Project](#about-the-project)
* [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Authors](#authors)
* [Acknowledgements](#acknowledgements)

## About The Project

![Screen Shot](https://i.imgur.com/W8twCp9.jpg)

Welcome to the world of collectables, where you can indulge in your passions and discover new treasures. Our marketplace app is the ultimate destination for collectors and enthusiasts, offering a wide selection of unique and rare collectibles from all over the world. Whether you're looking for vintage toys, limited edition comics, or one-of-a-kind art pieces, you'll find it all here.

What sets us apart is our cutting-edge live streaming auction feature, which allows you to participate in real-time bidding on some of the most coveted collectibles. Imagine being able to bid on a rare vintage action figure from the comfort of your own home, or competing for that limited edition comic book you've always wanted. Our live auctions provide a thrilling experience, adding a new dimension to the world of collecting.

Our app is user-friendly and easy to navigate, making it simple for you to find what you're looking for. Browse through our categories, save items to your wish list, and set alerts for upcoming auctions. You'll never miss out on the latest and greatest collectibles again.

We have a wide range of items with new auctions added daily, so you'll never run out of treasures to discover. Whether you're an experienced collector, or just starting out, you'll find something to love on our marketplace. You can also connect with other collectors in our community, share your collection, or get advice on starting your own.

So don't wait any longer, visit our app now and join the community of collectors looking for their next treasure. With our marketplace app, the thrill of the hunt never ends, and every day is an opportunity to discover your next great collectible.

## Built With

Our marketplace app is built with the latest technologies, ensuring a smooth and secure experience for our users.

The app is built using a microservices architecture, which allows us to break down the system into smaller, independent services that can be developed and deployed independently. This enables us to scale and update different parts of the app separately, making the system more flexible and reliable.

We use Docker to containerize our microservices, which helps to ensure consistency and ease of deployment across different environments. Additionally, we use Nginx as a reverse proxy to distribute incoming traffic to our microservices and to enhance the security by providing the functionality of SSL termination and load balancing, providing improved performance and reliability.

We use JSON Web Tokens (JWT) for user authentication and authorization. JWT's are stateless and allow us to securely transmit user information across different services. It ensures that only authorized users can access the protected parts of the app and that the data is tamper-proof. This means our users can have confidence in the security of their personal information when using our marketplace.

We also use the technologies below for the web-app development which enhances the user experience. With a focus on performance, scalability and security, we have built a fast, reliable and secure platform for our users to enjoy.

All these technologies and standards working together provides our app a secure and reliable marketplace that makes it easy to find and bid on collectibles from around the world.

* [React](https://github.com/SahilHakimiUofT/topshelf)
* [Express.js](https://github.com/SahilHakimiUofT/topshelf)
* [Node.js](https://github.com/SahilHakimiUofT/topshelf)
* [FFmpeg](https://github.com/SahilHakimiUofT/topshelf)
* [AWS](https://github.com/SahilHakimiUofT/topshelf)
* [MongoDB](https://github.com/SahilHakimiUofT/topshelf)
* [Kafka](https://github.com/SahilHakimiUofT/topshelf)
* [Stripe](https://github.com/SahilHakimiUofT/topshelf)
* [Redis](https://github.com/SahilHakimiUofT/topshelf)

## Getting Started

Follow these steps to setup the app on your localhost: 

### Prerequisites

For MacOS/Linux
* Docker

```sh
Download docker from the following link: https://www.docker.com/
```
* npm

```sh
npm install npm@latest -g
```

### Installation

1.  Clone the repo

```sh
ssh: git clone git@github.com:SahilHakimiUofT/topshelf.git

Https: git clone https://github.com/SahilHakimiUofT/topshelf.git
```

3. Install NPM packages

```sh
1. cd frontend --> npm install
2. cd backned --> npm install
3. cd into each individual microservice and install dependencies 
```
4. Run Docker Containers

```JS
cd backend --> docker-compose up -d
```

5. Run the program

```JS
cd frontend --> npm run dev
cd backend --> ./script.sh
```


## Authors

* [Sahil Hakimi](https://github.com/SahilHakimiUofT) - *Full Stack*
* [Mohammad Qureshi](https://github.com/ms-q-14) - *Full Stack*
* [Imran Rehman ](https://github.com/imranrehman-it) - *Full Stack*
* [Sameh Ahmed ](https://github.com/Sameh-A) - *Full Stack*

