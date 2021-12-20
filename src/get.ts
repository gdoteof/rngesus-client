import { get_external_data } from "./on_chain_reads";

const get = async () => {
  const data = await get_external_data();
  console.log("Ptr: ", data.ptr, "\nPrevhash: " + data.prev_hash.toString(), + " " + data.prev_hash.toBase58());
};

get();
