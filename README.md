# PeerStream

PeerStream connects individuals with mentors, consultants, beta testers, and all kinds of specialists that can help them achieve their goals.

- As a service provider: simply connect your 3Box account and add a note about your expertise. Potential clients take a look at your profile and get in touch.
- As a client: you can browse through for peers that might be able to lend you a hand. Start a direct messaging channel with them, and start a payment stream for their services.

### What is a payment stream?
It is what it sounds like. Instead of transferring a lump sum in one go, you *stream* little amounts of money every minute. As the payer, you can set the total amount, start time and stop time of the payment stream. Every minute between the start and stop time, your deposit will incrementally be allocated to the recipient. The recipient can withdraw from the payment stream whenever they want, and the sender can cancel the stream whenever they want. If the stream is cancelled before the stated stop time, the "streamed" funds are sent automatically to the recipient and the sender gets back the remaining funds. For this project, payment streams are handled by [Sablier](https://sablier.finance/) - the protocol for real-time finance on the Ethereum blockchain.

Instead of having to wait 2 weeks or a month to get your paycheck, payment streams turn every day into payday.

### What is 3Box?
3Box is a secure and decentralized user data storage system. It allows for the development of fully-featured applications without needing to run a backend for handling user data. In exploring the possibilities of this, this project was built without a database. Instead, users' profile information, as well as private chat history, are stored on IPFS via 3Box.

## Development

1. Clone this repository `git clone https://github.com/nichanank/peerstream.git`
2. Install parent directory dependancies `npm i`
3. Install app dependancies `cd packages/react-app && npm i`
4. Bring up the app with `yarn start` and it should be running on `localhost:3000`


## About

This project was bootstrapped with [Create Eth App](https://github.com/paulrberg/create-eth-app) and the [Sablier Template](https://github.com/PaulRBerg/create-eth-app/tree/develop/templates/sablier). The boilerplate comes with a basic example for how to connect and pull data from the [Sablier subgraph](https://thegraph.com/explorer/subgraph/sablierhq/sablier).

This template contains two packages:

- [contracts](/packages/contracts)
- [react-app](/packages/react-app)

