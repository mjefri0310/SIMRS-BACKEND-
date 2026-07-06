const response = require("./response");
const EntityVersion = require("../models/EntityVersion");
const { createBlockchainLog } = require("./blockchain");
/**
 * Factory CRUD Generic
 *
 * @param {Object} options
 * @param {mongoose.Model} options.Model
 * @param {String} options.entity
 * @param {String} options.module
 * @param {Array} options.searchFields
 * @param {Array} options.populate
 */
module.exports = ({ Model, entity, module = "MASTER", searchFields = [], populate = [], }) => {
  /**
   * Build Search Filter
   */
  const buildFilter = (keyword = "") => {
    const filter = {
      is_deleted: false,
    };
    if (keyword && searchFields.length > 0) {
      filter.$or = searchFields.map((field) => ({
        [field]: {
          $regex: keyword,
          $options: "i",
        },
      }));
    }
    return filter;
  };

  /**
   * LIST DATA
   */
  const index = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const keyword = req.query.keyword || "";
      const skip = (page - 1) * limit;
      const filter = buildFilter(keyword);
      const total = await Model.countDocuments(filter);
      let query = Model.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      if (populate.length > 0) {
        populate.forEach(p => {
          query = query.populate(p);
        });
      }

      const data = await query;
      return response.success(res, {
        message: "Data berhasil diambil",
        data,
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
        err,
      });
    }
  };
  

  /**
   * All Data without pagination, for dropdown or lookup
   */
  const all = async (req, res) => {
    try {
      const data = await Model.find({
        is_deleted: false,
      }).sort({
        createdAt: -1,
      });
      return response.success(res, {
        message: "Data berhasil diambil",
        data,
      });
    } catch (err) {
      return response.error(res, {
        message: err.message,
        err,
      });
    }
  };

  /**
   * DETAIL DATA
   */
  const show = async (req, res) => {
    try {
      const data = await Model.findOne({
        _id: req.params.id,
        is_deleted: false,
      });

      if (!data) {
        return response.error(res, {
          code: 404,
          message: "Data tidak ditemukan",
        });
      }

      return response.success(res, {
        message: "Data berhasil diambil",
        data,
      });
    } catch (err) {
      return response.error(res, {
        message: err.message,
        err,
      });
    }
  };

  /**
   * CREATE
   */
  const store = async (req, res) => {
    try {
      const data = await Model.create({
        ...req.body,
        current_version: 1,
        is_deleted: false,
      });

      await EntityVersion.create({
        module,
        entity,
        entity_id: data._id,
        version: 1,
        snapshot: data,
        change_type: "CREATE",
        changed_by: "admin",
      });
      // await saveVersion({
      //   module: "REGISTRATION",
      //   entity: "PATIENT",
      //   entity_id: patient._id,
      //   version: 1,
      //   snapshot: patient.toObject(),
      //   change_type: "CREATE",
      //   changed_by: "admin",
      // });
      await createBlockchainLog({
        module,
        entity,
        entity_id: data._id,
        action: "CREATE",
        payload: data,
        snapshot_data: data,
      });

      return response.success(res, {
        code: 201,
        message: "Data berhasil disimpan",
        data,
      });
    } catch (err) {
      return response.error(res, {
        message: err.message,
        err,
      });
    }
  };

  /**
   * UPDATE
   */
  const update = async (req, res) => {
    try {
      const oldData = await Model.findById(req.params.id);
      if (!oldData) {
        return response.error(res, {
          code: 404,
          message: "Data tidak ditemukan",
        });
      }
      const nextVersion = (oldData.current_version || 1) + 1;
      const updated = await Model.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
          current_version: nextVersion,
        },
        {
          new: true,
        },
      );

      await EntityVersion.create({
        module,
        entity,
        entity_id: updated._id,
        version: nextVersion,
        snapshot: updated,
        change_type: "UPDATE",
        changed_by: "admin",
      });

      await createBlockchainLog({
        module,
        entity,
        entity_id: updated._id,
        action: "UPDATE",
        payload: {
          old_data: oldData,
          new_data: updated,
        },
        snapshot_data: updated,
      });

      return response.success(res, {
        message: "Data berhasil diupdate",
        data: updated,
      });
    } catch (err) {
      return response.error(res, {
        message: err.message,
        err,
      });
    }
  };

  /**
   * SOFT DELETE
   */
  const destroy = async (req, res) => {
    try {
      const data = await Model.findById(req.params.id);

      if (!data) {
        return response.error(res, {
          code: 404,
          message: "Data tidak ditemukan",
        });
      }

      await Model.findByIdAndUpdate(req.params.id, {
        is_deleted: true,
      });

      await createBlockchainLog({
        module,
        entity,
        entity_id: data._id,
        action: "DELETE",
        payload: data,
        snapshot_data: data,
      });

      return response.success(res, {
        message: "Data berhasil dihapus",
      });
    } catch (err) {
      return response.error(res, {
        message: err.message,
        err,
      });
    }
  };

  /**
   * VERSION HISTORY
   */
  const versions = async (req, res) => {
    try {
      const data = await EntityVersion.find({
        entity,
        entity_id: req.params.id,
      }).sort({
        version: -1,
      });

      return response.success(res, {
        message: "Version berhasil diambil",
        data,
      });
    } catch (err) {
      return response.error(res, {
        message: err.message,
        err,
      });
    }
  };

  return {
    index,
    all,
    show,
    store,
    update,
    destroy,
    versions,
  };
};