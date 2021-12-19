import {
  Connection,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";


const bs58 = require('bs58')
import BN = require("bn.js");

import {

  getKeypair,
  getProgramId,
} from "./utils";

const increment_ptr = async () => {
  const rngesusProgramId = getProgramId();

  const ourKeypair = getKeypair("id");
  const dataKeypair = getKeypair('rng_data');

  const connection = new Connection("https://api.devnet.solana.com", "confirmed");

  const nextHashByteArray = bs58.decode("AvumXmJo9qjiVGYQLA3ejsBSfqE4HPP4Gb65Fe1sAxwk");
  const secretByteArray = bs58.decode("AzTTsycuPsXaPgEG6tfXqVnLCrSJrrSvP6H79irjT4DU");

  const rngesusIncrementPtrIx = new TransactionInstruction({
    programId: rngesusProgramId,
    keys: [
      { pubkey: ourKeypair.publicKey, isSigner: true, isWritable: false },
      { 
        pubkey: dataKeypair.publicKey, isSigner: false, isWritable: true
      }   
    ],
    data: Buffer.from(
      Uint8Array.of(
        1,  //Rngesus.IncrementPass
        ...new BN( nextHashByteArray).toArray("be", 32),
        ...new BN( secretByteArray).toArray("be", 32)
      )
    )
  });

  const tx = new Transaction().add(
    rngesusIncrementPtrIx
  );
  console.log("Sending increment_ptr transaction...");
  const txId = await connection.sendTransaction(
    tx,
    [ourKeypair],
    { skipPreflight: false, preflightCommitment: "confirmed" }
  );

  console.log("txid: ", txId);

  /*
  // sleep to allow time to update
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const rngEsusAccount = await connection.getAccountInfo(
    rngesusProgramId
  );

  console.log(rngEsusAccount)

  if (rngEsusAccount?.data.length === 0) {
    logError("account has not been initialized properly");
    process.exit(1);
  }

  /*
  const encodedEscrowState = escrowAccount.data;
  const decodedEscrowState = ESCROW_ACCOUNT_DATA_LAYOUT.decode(
    encodedEscrowState
  ) as EscrowLayout;

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
    ).equals(aliceYTokenAccountPubkey)
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
    `✨Escrow successfully initialized. Alice is offering ${terms.bobExpectedAmount}X for ${terms.aliceExpectedAmount}Y✨\n`
  );
  writePublicKey(escrowKeypair.publicKey, "escrow");
  console.table([
    {
      "Alice Token Account X": await getTokenBalance(
        aliceXTokenAccountPubkey,
        connection
      ),
      "Alice Token Account Y": await getTokenBalance(
        aliceYTokenAccountPubkey,
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

increment_ptr();
