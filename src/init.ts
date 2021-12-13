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
  getPublicKey,
  logError,
} from "./utils";

const init = async () => {
  const rngesusProgramId = getProgramId();

  const ourKeypair = getKeypair("id");

  const connection = new Connection("https://api.devnet.solana.com", "confirmed");

  const executableAccountPubkey = getPublicKey("derived_bpf");


  const rngesusInitIx = new TransactionInstruction({
    programId: rngesusProgramId,
    keys: [
      { pubkey: ourKeypair.publicKey, isSigner: true, isWritable: false },
      {
        pubkey: rngesusProgramId,
        isSigner: false,
        isWritable: true,
      },
      { 
        pubkey: executableAccountPubkey, isSigner: false, isWritable: false
      }   
    ],
    data: Buffer.from(
      Uint8Array.of(0, ...new BN(
        Buffer.from(
          bs58.decode("4F7BsTMVPKFshM1MwLf6y23cid6fL3xMpazVoF9krzUw")
        )
      ).toArray("le", 32))
    )
  });

  const tx = new Transaction().add(
    rngesusInitIx
  );
  console.log("Sending init transaction...");
  await connection.sendTransaction(
    tx,
    [ourKeypair],
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
    ).equals(initYTokenAccountPubkey)
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
    `✨Escrow successfully initialized. Alice is offering ${terms.bobExpectedAmount}X for ${terms.initExpectedAmount}Y✨\n`
  );
  writePublicKey(escrowKeypair.publicKey, "escrow");
  console.table([
    {
      "Alice Token Account X": await getTokenBalance(
        initXTokenAccountPubkey,
        connection
      ),
      "Alice Token Account Y": await getTokenBalance(
        initYTokenAccountPubkey,
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

init();
