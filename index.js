const {
  Keypair,
  PublicKey,
  Connection,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} = require("@solana/web3.js");

// Create a new keypair
const newPair = new Keypair();

// Exact the public and private key from the keypair
const publicKey = new PublicKey(newPair._keypair.publicKey).toString();
const privateKey = newPair._keypair.secretKey;

// Connect to the Devnet
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

console.log("Public Key of the generated keypair", publicKey);
console.log("Connection object is:", connection);

const getWalletBalance = async () => {
  try {
    // Make a wallet (keypair) from privateKey and get its balance
    const myWallet = await Keypair.fromSecretKey(privateKey);
    const walletBalance = await connection.getBalance(myWallet.publicKey);
    console.log(
      `Wallet balance: ${parseInt(walletBalance) / LAMPORTS_PER_SOL} SOL`
    );
  } catch (err) {
    console.log(err);
  }
};

const airDropSol = async () => {
  try {
    // make a wallet from private key
    const myWallet = await Keypair.fromSecretKey(privateKey);

    // Request airdrop of 2 SOL to the wallet
    console.log("Airdropping some SOL to my wallet!");
    const fromAirDropSignature = await connection.requestAirdrop(
      new PublicKey(myWallet.publicKey),
      2 * LAMPORTS_PER_SOL
    );

    // await connection.confirmTransaction(fromAirDropSignature);
    const latestBlockHash = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: fromAirDropSignature,
    });
  } catch (err) {
    console.log(err);
  }
};

const mainFunction = async () => {
  await getWalletBalance();
  await airDropSol();
  await getWalletBalance();
};

mainFunction();
