import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";


import BN = require("bn.js");

import {

  getKeypair,
  getProgramId,
  get_pair_by_epoch,
  logError,
  RngesusLayout,
  RNGESUS_ACCOUNT_DATA_LAYOUT,
  writeKey,
} from "./utils";

const initData = async () => {
  const rngesusProgramId = getProgramId();

  const ourKeypair = getKeypair("id");




  const nextPair = await get_pair_by_epoch(0);
  const nextHashByteArray = nextPair.newHash.toBytes();
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");

  const dataKeypair = new Keypair();


  const initKeyByteArray = nextHashByteArray;



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
         nextHashByteArray 
      ).toArray("be", 32))
    )
  });

  let min_bal = await connection.getMinimumBalanceForRentExemption(3241);

  console.log("minimum balance is: ", min_bal);
  console.log("Data account public id: ", dataKeypair.publicKey.toBase58());


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
  let out = await connection.sendTransaction(
    tx,
    [ourKeypair, dataKeypair],
    { skipPreflight: false, preflightCommitment: "confirmed" }
  );

  console.log("Transaction output:");
  console.log(out);


  console.log('waiting..');
  // sleep to allow time to update
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const rngEsusAccount = await connection.getAccountInfo(
    dataKeypair.publicKey
  );

  console.log('done waiting');


  if (rngEsusAccount?.data.length === 0) {
    logError("account has not been initialized properly");
    process.exit(1);
  }

  const encodedRngesusState = rngEsusAccount?.data;

  const decodedRngesusState = RNGESUS_ACCOUNT_DATA_LAYOUT.decode(
    encodedRngesusState
  ) as RngesusLayout;

  const pubkey_last = new PublicKey( decodedRngesusState.prevHash );
  const pubkey_init = new PublicKey( initKeyByteArray );
  console.log("Pubkey_last:" + pubkey_last);
  console.log("Pubkey_init:" + pubkey_init);
  console.log("And they are equal?: " + (pubkey_init == pubkey_last));
  if(pubkey_last.equals(pubkey_init)
    && decodedRngesusState.ptr == 1
    && decodedRngesusState.numCallbacks == 0){
    console.log("Success!");
    console.log("Data public id: ", dataKeypair.publicKey.toString());
    writeKey(dataKeypair, "rng_data");
  } else {
    console.log(decodedRngesusState);
    //console.log("prevHash: ", decodedRngesusState.prevHash, " encoded: ", bs58.encode(initKeyByteArray));
    console.log("prevHash: ", decodedRngesusState.prevHash);
    console.log("iunitKey: ", initKeyByteArray);
    console.log("ptr: ", decodedRngesusState.ptr);
    console.log("numCallbacks: ", decodedRngesusState.numCallbacks);

    console.log("sadness");
  }

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
    ).equals(initDataYTokenAccountPubkey)
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
    `???Escrow successfully initialized. Alice is offering ${terms.bobExpectedAmount}X for ${terms.initDataExpectedAmount}Y???\n`
  );
  writePublicKey(escrowKeypair.publicKey, "escrow");
  console.table([
    {
      "Alice Token Account X": await getTokenBalance(
        initDataXTokenAccountPubkey,
        connection
      ),
      "Alice Token Account Y": await getTokenBalance(
        initDataYTokenAccountPubkey,
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

initData();
