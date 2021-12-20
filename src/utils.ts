import { Connection, Keypair, PublicKey } from "@solana/web3.js";
//@ts-expect-error missing types
import * as BufferLayout from "buffer-layout";

import * as fs from "fs";
import { get_external_data } from "./on_chain_reads";

export type SecretKey = PublicKey;

export const logError = (msg: string) => {
  console.log(`\x1b[31m${msg}\x1b[0m`);
};

export const writePublicKey = (publicKey: PublicKey, name: string) => {
  fs.writeFileSync(
    `./keys/${name}_pub.json`,
    JSON.stringify(publicKey.toString())
  );
};

export const writePrivateKey = (keypair: Keypair, name: string) => {
fs.writeFileSync(
    `./keys/${name}.json`,
    `[${keypair.secretKey.join(",")}]`
  );
};

export const writeKey = (keypair: Keypair, name: string) => {
  writePublicKey(keypair.publicKey,name);
  writePrivateKey(keypair,name);
};

export const getPublicKey = (name: string) =>
  new PublicKey(
    JSON.parse(fs.readFileSync(`./keys/${name}_pub.json`) as unknown as string)
  );

export const getPrivateKey = (name: string) =>
  Uint8Array.from(
    JSON.parse(fs.readFileSync(`./keys/${name}.json`) as unknown as string)
  );

export const getKeypair = (name: string) =>
  new Keypair({
    publicKey: getPublicKey(name).toBytes(),
    secretKey: getPrivateKey(name),
  });

export const getProgramId = () => {
  try {
    return getPublicKey("program");
  } catch (e) {
    logError("Given programId is missing or incorrect");
    process.exit(1);
  }
};

export const getTerms = (): {
  aliceExpectedAmount: number;
  bobExpectedAmount: number;
} => {
  return JSON.parse(fs.readFileSync(`./terms.json`) as unknown as string);
};

export const getTokenBalance = async (
  pubkey: PublicKey,
  connection: Connection
) => {
  return parseInt(
    (await connection.getTokenAccountBalance(pubkey)).value.amount
  );
};


export const RNGESUS_ACCOUNT_DATA_LAYOUT = BufferLayout.struct([
  BufferLayout.u8("isInitialized"),
  BufferLayout.blob(32, "prevHash"),
  BufferLayout.u32("ptr"),
  BufferLayout.u32("numCallbacks"),
  BufferLayout.blob(3241-1-32-4-4, "callbackPubkeys"), 
]);

export interface RngesusLayout {
  isInitialized: number;
  prevHash: SecretKey;
  ptr: number;
  numCallbacks: number;
  callbackPubkeys: Uint8Array;
}

export interface RngEpochPair {
  newHash: PublicKey,
  secret: SecretKey
}

/**
 * Returns the next hash/secret to send to the onchain program.
 * 
 * If `epoch` is supplied, instead of looking on-chain, we will use `epoch`
 * instead of what is stored on-chain.
 *
 * @param [epochs=0]
 * @param [mode=0o666]
 */

export const get_pair_by_epoch = async (epoch:number) : Promise<RngEpochPair> => {
  const  buffer = Buffer.alloc(64); //32 each for secret, prev_hash
  const file = fs.openSync('data/piapprec.bin', 'r');
  const start = (epoch) * 64;
  const end = start + 64;
  
  await readBytes(file, buffer, start, end);
  const firstHalf = buffer.slice(0,32);
  const secondHalf = buffer.slice(32);

  return {
    newHash : new PublicKey(firstHalf),
    secret : new PublicKey(secondHalf),
  }
}

export const getCurrentPair = async () => {
  const  buffer = Buffer.alloc(64); //32 each for secret, prev_hash
  const file = fs.openSync('data/piapprec.bin', 'r');
  const on_chain_data = await get_external_data();
  const start = (on_chain_data.ptr) * 32;
  const end = start + 64;
  
  await readBytes(file, buffer, start, end);
  const firstHalf = buffer.slice(0,32);
  const secondHalf = buffer.slice(32);

  return {
    newHash : new PublicKey(firstHalf),
    secret : new PublicKey(secondHalf),
  }
}

const readBytes = async (fd: number, buffer: Buffer, start: number, end: number) => {
  return new Promise<void>((resolve, reject) => {
      fs.read(
          fd, 
          buffer,
          0,
          end-start,
          start,
          (err) => {
              if(err) { return reject(err); }
              resolve();
          }
      );
  });
}