import {
  Connection,
} from "@solana/web3.js";

import {
  getKeypair,
} from "./utils";

import { get_external_data } from "./on_chain_reads";

const get = async () => {
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  const dataKeypair = getKeypair("rng_data");

  const data = await get_external_data(dataKeypair, connection);
  console.log("Ptr: ", data.ptr, "\nPrevhash: " + data.prev_hash.toString(), + " " + data.prev_hash.toBase58());
};

get();
