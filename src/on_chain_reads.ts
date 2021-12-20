import {
  Connection,
  PublicKey,
} from "@solana/web3.js";



import {
  getKeypair,
  logError,
  RngesusLayout,
  RNGESUS_ACCOUNT_DATA_LAYOUT,
  SecretKey
} from "./utils";

export interface RngesusOffchainContext {
  ptr: number,
  prev_hash: SecretKey
}

export const get_external_data = async () : Promise<RngesusOffchainContext> => {
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  const dataKeypair = getKeypair("rng_data");

  const rngEsusAccount = await connection.getAccountInfo(
    dataKeypair.publicKey
  );

  if (rngEsusAccount?.data.length === 0) {
    logError("account has not been initialized properly");
    process.exit(1);
  }

  const encodedRngesusState = rngEsusAccount?.data;

  const decodedRngesusState = RNGESUS_ACCOUNT_DATA_LAYOUT.decode(
    encodedRngesusState
  ) as RngesusLayout;


  return {
    ptr: decodedRngesusState.ptr, prev_hash: new PublicKey ( decodedRngesusState.prevHash)
  }
};

export const get_current_epoch = async () : Promise<number> => {
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  const dataKeypair = getKeypair("rng_data");

  const rngEsusAccount = await connection.getAccountInfo(
    dataKeypair.publicKey
  );

  if (rngEsusAccount?.data.length === 0) {
    logError("account has not been initialized properly");
    process.exit(1);
  }

  const encodedRngesusState = rngEsusAccount?.data;

  const decodedRngesusState = RNGESUS_ACCOUNT_DATA_LAYOUT.decode(
    encodedRngesusState
  ) as RngesusLayout;

  return decodedRngesusState.ptr
}