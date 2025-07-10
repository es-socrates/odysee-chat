# Odysee Chat Widget

**This is the OBS chat widget for your Odysee live stream. Take a look.**

![Odysee Chat](https://thumbs.odycdn.com/51fb3f05f2c09758e2ffaade46c78b85.webp)

## Some features of the chat widget:

1) Usernames have different colors in the chat.
2) The chat displays Odysee emojis and stickers.
3) AR tips (arweave) are displayed in real time with confetti animations.
4) Sent tips can be seen in the lower right corner.
5) Users have their own badge.

## Prerequisites

1. Node.js v16 or higher (latest LTS version recommended).
2. npm (included with Node.js).
3. OBS Studio.

## Installation

Clone this repository or download the files. Open a terminal in the project folder. Run the following command to install the dependencies:

Use the command: **npm install**, this will install the necessary dependencies. Rhen edit the **server.js** file and replace the three (3) xxx's on lines 17 and 70 with the **ClaimID of your Odysee livestream**.

```
Edit the server.js file

line 17) 'wss://sockety.odysee.tv/ws/commentron?id=xxx' // the claim id
line 70) 'wss://sockety.odysee.tv/ws/commentron?id=xxx' // the claim id
```

Save the changes and then run **npm start** at the terminal. The server will run the app and you can monitor it in the terminal.

## OBS Integration:

1. In OBS Studio, add a new "Source" of type "Browser" to your scene.
2. Set the URL to http://localhost:3003.
3. Adjust the size according to your needs.

And that's it, the widget is now working. You can monitor the entire process from the terminal and check for any unexpected errors.

If you see the scroll in the widget's OBS source, check the source properties in OBS and use these CSS styles.

```
body { 
  background-color: rgba(0,0,0,0) !important; 
  overflow: hidden !important;
}
```

## Main Dependencies:

1. Express: Web server
1. WebSockets: Real-time communication
1. Axios: HTTP requests
1. dotenv: Environment variable management

If you want to customize the widget's CSS, you can edit the classes in the style.css file and play around a bit. Enjoy!

**This is an independent project for fun; it is not an official Odysee product.**