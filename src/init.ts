import {
  Connection,
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
} from "./utils";

const alice = async () => {
  const rngesusProgramId = getProgramId();

  const ourKeypair = getKeypair("id");
  const dataKeypair = getKeypair("rngesus_data");

  const connection = new Connection("https://api.devnet.solana.com", "confirmed");



  const rngesusInitIx = new TransactionInstruction({
    programId: rngesusProgramId,
    keys: [
      { pubkey: ourKeypair.publicKey, isSigner: true, isWritable: false },
      {
        pubkey: dataKeypair.publicKey,
        isSigner: true,
        isWritable: true,
      },
      { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
    ],
    data: Buffer.from(
      Uint8Array.of(0, ...new BN(
        Buffer.from(
          bs58.decode("4F7BsTMVPKFshM1MwLf6y23cid6fL3xMpazVoF9krzUw")
        )
      ).toArray("le", 32))
    )
  });

  let min_bal = await connection.getMinimumBalanceForRentExemption(3241);

  console.log("minimum balance is: ", min_bal);


  const createEscrowAccountIx = SystemProgram.createAccount({
    space: 3241,
    lamports: min_bal,
    fromPubkey: ourKeypair.publicKey,
    newAccountPubkey: dataKeypair.publicKey,
    programId: rngesusProgramId,
  });

  const tx = new Transaction().add(
    createEscrowAccountIx,
    rngesusInitIx
  );
  console.log("Sending init transaction...");
  await connection.sendTransaction(
    tx,
    [ourKeypair, dataKeypair],
    { skipPreflight: false, preflightCommitment: "confirmed" }
  );

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

alice();
