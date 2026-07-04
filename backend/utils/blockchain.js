const BlockchainLog = require("../models/BlockchainLog");
const generateBlockHash = require("./generateBlockHash");
// const generateSnapshotHash = require("./generateSnapshotHash");
exports.createBlockchainLog = async ({
module,
entity,
entity_id,
action,
payload,
snapshot_hash,
created_by,
}) => {
// GET LAST BLOCK
const latestBlock = await BlockchainLog.findOne().sort({
  index: -1,
});

console.log("latestBlock =", latestBlock);

// PREVIOUS HASH
const previousHash = latestBlock ? latestBlock.hash : "0";

// BLOCK INDEX
const index =
  latestBlock && latestBlock.index != null
    ? Number(latestBlock.index) + 1
    : 1;

console.log("index =", index);
// TIMESTAMP
const timestamp = new Date();
// GENERATE HASH
const hash = generateBlockHash({
index,
previous_hash: previousHash,
timestamp,
payload,
});
// CREATE BLOCK
const block = await BlockchainLog.create({
index,
module,
entity,
entity_id,
action,
payload,
snapshot_hash,
previous_hash: previousHash,
hash,
created_by,
timestamp,
});
return block;
};