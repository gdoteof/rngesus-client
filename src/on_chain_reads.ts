import {
  Connection,
  Keypair,
  PublicKey,
} from "@solana/web3.js";



import {
  logError,
  RngesusLayout,
  RNGESUS_ACCOUNT_DATA_LAYOUT,
  SecretKey
} from "./utils";

export interface RngesusOffchainContext {
  ptr: number,
  prev_hash: SecretKey
}

export const get_external_data = async (dataKeypair: Keypair, connection: Connection) : Promise<RngesusOffchainContext> => {
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
