import {
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";


import BN = require("bn.js");
import { get_current_epoch } from "./on_chain_reads";

import {

  getKeypair,
  getProgramId,
  get_pair_by_epoch,
} from "./utils";

const increment_ptr = async () => {
  const rngesusProgramId = getProgramId();

  const ourKeypair = getKeypair("id");
  const dataKeypair = getKeypair('rng_data');

  const connection = new Connection("https://api.devnet.solana.com", "confirmed");


  const current_epoch = await get_current_epoch();
  const nextPair = await get_pair_by_epoch(current_epoch);
  const nextHashByteArray = nextPair.newHash.toBytes();
  const secretByteArray = nextPair.secret.toBytes();
  console.log("epoch: ", current_epoch);
  console.log("nextHash: ", new PublicKey(nextHashByteArray).toString());

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
};

increment_ptr();
