# ⚡️ Peer Stream

Peer Stream utilizes payment streams to link **TIME** with **MONEY**, giving freelancers and clients more freedom and flexibility to engage with each other than ever before. Instead of paying lump-sum for services, payment streams give individuals the flexibility to *stream* funds to people for their time. They can agree on any ERC-20 currency and start/stop the payment stream at any time. Service providers can withdraw from the stream instantaneously. 

See the live demo at https://peerstream.netlify.app. At the moment, payment streams only work with Testnet DAI. Find out how you can mint yourself some Testnet DAI in the [development](#-development) section

## 📖 How it Works

The Peer Discovery Platform allows individuals to connect with with mentors, consultants, beta testers, domain specialists, and all kinds of experts that can help them achieve their goals.

### Service Providers
1. Connect 3Box account
2. Add a note about your expertise
3. Get contacted by potential clients
4. Start a 1-1 video chat
5. Continuous payroll. Withdraw from the stream any time

### Clients
1. Browse for peers that might be able to lend a hand
2. Start a direct messaging channel with peers
3. Get on a 1-1 video chat
4. Start a payment stream for their services
5. Pay-as-you-go, cancel the stream any time

As the payer, you can set the total amount, start time and stop time of the payment stream. Every minute between the start and stop time, your deposit will incrementally be allocated to the recipient. The recipient can withdraw from the payment stream whenever they want, and the sender can cancel the stream whenever they want. If the stream is cancelled before the stated stop time, the "streamed" funds are sent automatically to the recipient and the sender gets back the remaining funds.

### 💸 The Power of Payment Streams
- Flexible in when you pay and what you pay with. Streams work with any ERC-20 token
- No lump sum payments. Clients can minimize loss by cancelling early if the engagement is not working out
- Recipients can withdraw from the payment stream whenever they want
- Instead of having to wait for biweekly or monthly paychecks, payment streams turn every day into payday

### 💁🏻‍♀️ Decentralized User Profiles and Data
- User profile information and private chat history secure and decentralized data storage system
- Use your existing social identity instead of creating yet another account that is siloed on one platform
- Freelancers can earn reputation as a peer and take this reputation with them across applications
- 1-1 chat history is managed via encrypted threads stored on IPFS, only readable by the peers involved

## 🛠 Technology

- Payment streams are handled by [Sablier](https://sablier.finance/) - The protocol for real-time finance on the Ethereum blockchain.
- Peer profiles and P2P chat is handled by [3box](https://3box.io) - A next-generation framework for managing user data on the internet.
- Video chats utilze [WebRTC](https://webrtc.org/) technology via [PeerJS](https://peerjs.com/)

### What is Sablier?
Sablier is a protocol for real-time finance. It is this protocol that makes payment streams to be possible. A payer's deposit is sent to the Sablier smart contract, which handles the "streaming", or incremental allocation of deposited funds over the time period specified by the creator of the payment stream. The recipient can withdraw from the payment stream at any time.

### What is 3Box?
3Box is a secure and decentralized user data storage system. It allows for the development of fully-featured applications without needing to run a backend for handling user data. In exploring the possibilities of this, this project was built without a database. Instead, users' profile information, as well as private chat history, are stored on IPFS via 3Box.

## 👩🏻‍💻 Development

1. Clone this repository `git clone https://github.com/nichanank/peerstream.git`
2. Install parent directory dependancies `npm i`
3. Install app dependancies `cd packages/react-app && npm i`
4. Bring up the app with `yarn start` and it should be running on `localhost:3000`

### How to get Testnet DAI

Testnet DAI is an ERC-20 token that was made for the purposes of testing decentralized applications. It is available on all the Ethereum networks (Rinkeby, Kovan, Ropsten etc.)

1. You can mint yourself some Testnet DAI by going to the contract on their respective Etherscan-s, navigating to `Contract` and then `Write Contract`. 

- Kovan: https://kovan.etherscan.io/token/0x7d669a64deb8a4a51eea755bb0e19fd39ce25ae9#writeContract
- Rinkeby: https://rinkeby.etherscan.io/address/0xc3dbf84abb494ce5199d5d4d815b10ec29529ff8#writeContract
- Ropsten: https://ropsten.etherscan.io/address/0x2d69ad895797c880abce92437788047ba0eb7ff6#writeContract
- Goerli: https://goerli.etherscan.io/address/0xf2d1f94310823fe26cfa9c9b6fd152834b8e7849#writeContract

2. Click `Connect to Web3` to sign in with your wallet and get your tokens by calling the `mint` function. 

3. Because Testnet DAI adheres to the ERC-20 standard, whose token decimals is 18, remember to add 18 zeros to the amount you want to mint. For example if you wanted to mint 9999 TestnetDAI you would put `9999000000000000000000`. Double check that the testnet Etherscan that you're on matches the one on your Web3 wallet.

Once you have your TestnetDAI you're good to go to test the payment streams feature in the demo! Sign in with your Web3 wallet on the same test network and click `Start Stream` on a Peer Card. Unlike with Etherscan, the app takes care of the 18 token decimals, so if you want to stream 100 tokens to the Peer just put 100.

## About

This project was built for the [DragonQuest virtual hackathon](https://hackathon.metacartel.org/) which took place from the 1-30th April 2020. The project was bootstrapped with [Create Eth App](https://github.com/paulrberg/create-eth-app) and the [Sablier Template](https://github.com/PaulRBerg/create-eth-app/tree/develop/templates/sablier). The boilerplate comes with a basic example for how to connect and pull data from the [Sablier subgraph](https://thegraph.com/explorer/subgraph/sablierhq/sablier).

This template contains two packages:

- [contracts](/packages/contracts)
- [react-app](/packages/react-app)

