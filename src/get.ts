import {
  Connection,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";


const bs58 = require('bs58')
import BN = require("bn.js");

import {

  getKeypair,
  getProgramId,
  getPublicKey,
  logError,
  RngesusLayout,
  RNGESUS_ACCOUNT_DATA_LAYOUT,
} from "./utils";

const get = async () => {
  const rngesusProgramId = getProgramId();


  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  // sleep to allow time to update
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const dataKeypair = getKeypair("rngesus_data");
  const rngEsusAccount = await connection.getAccountInfo(
    dataKeypair.publicKey
  );

  console.log(rngEsusAccount)

  if (rngEsusAccount?.data.length === 0) {
    logError("account has not been initialized properly");
    process.exit(1);
  }

  const encodedRngesusState = rngEsusAccount?.data;
  console.log("BUYTE LENGTH??:" + encodedRngesusState?.byteLength);

  const decodedRngesusState = RNGESUS_ACCOUNT_DATA_LAYOUT.decode(
    encodedRngesusState
  ) as RngesusLayout;

  console.log(decodedRngesusState);

  const ptr = new BN(decodedRngesusState.ptr, 4, "le");
  const num_callbacks = new BN(decodedRngesusState.numCallbacks, 4, "le");
  const pubkey_last = new PublicKey( decodedRngesusState.prevHash );

  console.log("Ptr: %d, num_callbacks: %d", ptr, num_callbacks);
  console.log("prevHash: " + pubkey_last.toBase58());

  /*

  if (!decodedEscrowState.isInitialized) {
    logError("Escrow state initialization flag has not been set");
    process.exit(1);
  } else if (
    !new PublicKey(decodedEscrowState.initializerPubkey).equals(
      ourKeypair.publicKey
    )
  ) {
    logError(
      "InitializerPubkey has not been set correctly / not been set to Alice's public key"
    );
    process.exit(1);
  } else if (
    !new PublicKey(
      decodedEscrowState.initializerReceivingTokenAccountPubkey
    ).equals(getYTokenAccountPubkey)
  ) {
    logError(
      "initializerReceivingTokenAccountPubkey has not been set correctly / not been set to Alice's Y public key"
    );
    process.exit(1);
  } else if (
    !new PublicKey(decodedEscrowState.initializerTempTokenAccountPubkey).equals(
      tempXTokenAccountKeypair.publicKey
    )
  ) {
    logError(
      "initializerTempTokenAccountPubkey has not been set correctly / not been set to temp X token account public key"
    );
    process.exit(1);
  }
  console.log(
    `✨Escrow successfully initialized. Alice is offering ${terms.bobExpectedAmount}X for ${terms.getExpectedAmount}Y✨\n`
  );
  writePublicKey(escrowKeypair.publicKey, "escrow");
  console.table([
    {
      "Alice Token Account X": await getTokenBalance(
        getXTokenAccountPubkey,
        connection
      ),
      "Alice Token Account Y": await getTokenBalance(
        getYTokenAccountPubkey,
        connection
      ),
      "Bob Token Account X": await getTokenBalance(
        getPublicKey("bob_x"),
        connection
      ),
      "Bob Token Account Y": await getTokenBalance(
        getPublicKey("bob_y"),
        connection
      ),
      "Temporary Token Account X": await getTokenBalance(
        tempXTokenAccountKeypair.publicKey,
        connection
      ),
    },
  ]);

  console.log("");
  */
};

get();
