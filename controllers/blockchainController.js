const SHA256 = require("crypto-js/sha256");

const BlockchainLog = require("../models/BlockchainLog");
const response = require("../utils/response");
const entityRegistry = require("../config/entityRegistry");
const generateSnapshotHash = require("../utils/generateSnapshotHash");
// const Patient = require("../models/Patient");

// const PatientVersion = require("../models/PatientVersion");

const { createBlockchainLog } = require("../utils/blockchain");

const generateBlockHash = require("../utils/generateBlockHash");

exports.explorer = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;

    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const total = await BlockchainLog.countDocuments();

    const blocks = await BlockchainLog.find()
      .sort({ index: -1 })
      .skip(skip)
      .limit(limit);

    return response.success(res, {
      message: "Blockchain explorer",

      data: blocks,

      pagination: {
        page,

        limit,

        total,

        total_pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    return response.error(res, {
      message: err.message,
    });
  }
};
exports.blockDetail = async (req, res) => {
  try {
    const block = await BlockchainLog.findOne({
      index: req.params.index,
    });

    if (!block) {
      return response.error(res, {
        code: 404,
        message: "Block tidak ditemukan",
      });
    }

    return response.success(res, {
      message: "Detail block",
      data: block,
    });
  } catch (err) {
    return response.error(res, {
      message: err.message,
    });
  }
};
exports.verify = async (req, res) => {
  try {
    const blocks = await BlockchainLog.find().sort({ index: 1 });

    for (let i = 1; i < blocks.length; i++) {
      const current = blocks[i];
      const previous = blocks[i - 1];
      // VERIFY HASH
      const recalculatedHash = generateBlockHash({
        index: current.index,
        previous_hash: current.previous_hash,
        timestamp: current.timestamp,
        payload: current.payload,
      });

      if (current.hash !== recalculatedHash) {
        return response.error(res, {
          code: 422,
          message: "Blockchain invalid",
          response: {
            valid: false,
            broken_block: current.index,
            entity: current.entity,
            entity_id: current.entity_id,
            action: current.action,
            reason: "Hash mismatch",
          },
        });
      }

      // VERIFY PREVIOUS HASH

      if (current.previous_hash !== previous.hash) {
        return response.error(res, {
          code: 422,
          message: "Blockchain invalid",
          response: {
            valid: false,
            broken_block: current.index,
            entity: current.entity,
            entity_id: current.entity_id,
            action: current.action,
            reason: "Previous hash mismatch",
          },
        });
      }
    }

    return response.success(res, {
      message: "Blockchain valid",
      data: {
        valid: true,
        total_blocks: blocks.length,
      },
    });
  } catch (err) {
    return response.error(res, {
      message: err.message,
    });
  }
};
exports.recover = async (req, res) => {
  try {
    const blockIndex = parseInt(req.params.blockIndex);

    const brokenBlock = await BlockchainLog.findOne({
      index: blockIndex,
    });

    if (!brokenBlock) {
      return response.error(res, {
        code: 404,
        message: "Block tidak ditemukan",
      });
    }

    const Model = entityRegistry[brokenBlock.entity];

    if (!Model) {
      return response.error(res, {
        code: 400,
        message: "Entity tidak terdaftar",
      });
    }

    const latestValidBlock = await BlockchainLog.findOne({
      entity: brokenBlock.entity,
      entity_id: brokenBlock.entity_id,
      index: {
        $lt: blockIndex,
      },
    }).sort({
      index: -1,
    });

    if (!latestValidBlock) {
      return response.error(res, {
        code: 404,
        message: "Snapshot tidak ditemukan",
      });
    }

    let restoreData;

    switch (latestValidBlock.action) {
      case "CREATE":
        restoreData = latestValidBlock.payload;
        break;
      case "UPDATE":
        restoreData = latestValidBlock.payload.new_data;
        break;
      case "DELETE":
        restoreData = latestValidBlock.payload.old_data;
        restoreData.is_deleted = false;
        break;
      default:
        return response.error(res, {
          code: 400,
          message: "Action tidak dapat direcover",
        });
    }

    delete restoreData._id;
    await Model.findByIdAndUpdate(brokenBlock.entity_id, restoreData, {
      new: true,
      upsert: true,
    });

    // CATAT KE BLOCKCHAIN
    await createBlockchainLog({
      module: "SYSTEM",
      entity: brokenBlock.entity,
      entity_id: brokenBlock.entity_id,
      action: "RECOVERY",
      payload: {
        recovered_from_block: latestValidBlock.index,
        restored_data: restoreData,
      },
    });
    return response.success(res, {
      message: "Recovery berhasil",
      data: {
        entity: brokenBlock.entity,
        entity_id: brokenBlock.entity_id,
        restored_from_block: latestValidBlock.index,
      },
    });
  } catch (err) {
    return response.error(res, {
      message: err.message,
      err,
    });
  }
};
exports.checkIntegrity = async (req, res) => {
  try {
    const { entity, entityId } = req.params;

    const Model = entityRegistry[entity];

    if (!Model) {
      return response.error(res, {
        code: 404,
        message: "Entity tidak ditemukan",
      });
    }

    const currentData = await Model.findById(entityId);

    if (!currentData) {
      return response.error(res, {
        code: 404,
        message: "Data tidak ditemukan",
      });
    }

    const latestBlock = await BlockchainLog.findOne({
      entity,
      entity_id: entityId,
    }).sort({
      index: -1,
    });

    const currentHash = generateSnapshotHash(currentData);
    // console.log("Current Data:", currentData);
    // console.log("Current Hash:", currentHash);
    // console.log("Blockchain Hash:", latestBlock ? latestBlock.snapshot_hash : "N/A");
    const valid = currentHash === latestBlock.snapshot_hash;

    return response.success(res, {
      message: valid ? "Data valid" : "Data dimodifikasi",
      data: {
        valid,
        entity,
        entity_id: entityId,
        current_hash: currentHash,
        blockchain_hash: latestBlock.snapshot_hash,
      },
    });
  } catch (err) {
    return response.error(res, {
      message: err.message,
    });
  }
};