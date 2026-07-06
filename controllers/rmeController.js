const RME = require("../models/RME");
const EntityVersion = require("../models/EntityVersion");
const Payment = require("../models/Payment");
const { createBlockchainLog } = require("../utils/blockchain");
const Registration = require("../models/Registration");
exports.saveRME = async (req, res) => {
  try {
    const { registration_id } = req.body;

    // cek apakah sudah ada
    const existing = await RME.findOne({
      registration_id,
    });

    const action = existing
      ? "UPDATE"
      : "CREATE";

    let version = 1;

    if (existing) {
      version =
        (existing.current_version || 1) + 1;
    }

    // save data
    const data =
      await RME.findOneAndUpdate(
        { registration_id },
        {
          ...req.body,
          current_version: version,
          is_deleted: false,
        },
        {
          new: true,
          upsert: true,
        }
      );

    await EntityVersion.create({
      entity: "MedicalRecord",
      entity_id: data._id,
      module: "RME",
      version: version,
      snapshot: data.toObject(),
      change_type: action,
      changed_by: "admin"
    });
    if(action=="CREATE"){
      // save blockchain
      await createBlockchainLog({
        module: "RME",
        entity: "MedicalRecord",
        entity_id: data._id.toString(),
        action,
        payload: data.toObject(),
        snapshot_data: data.toObject()
      });
    }else{
      // const oldData = await RME.findById(registration_id);
      await createBlockchainLog({
        module: "RME",
        entity: "MedicalRecord",
        entity_id: data._id.toString(),
        action,
        payload: {
          old_data: existing,
          new_data: data.toObject(),
        },
        snapshot_data: data.toObject()
      });
    }
    
    /* =========================
       2. AMBIL REGISTRATION
    ========================= */
    const registration = await Registration.findById(
      registration_id
    ).populate("patient_id");

    if (!registration) {
      return res.status(404).json({
        metadata: {
          code: 404,
          message: "Registration tidak ditemukan",
        },
      });
    }

    /* =========================
       3. BUILD ITEM OBAT
    ========================= */
    const medicineItems = (req.body.penggunaan_obat || []).map(
      (item) => ({
        item_type: "OBAT",
        item_name: item.medicine_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.subtotal,
      })
    );

    /* =========================
       4. BUILD ITEM TINDAKAN
    ========================= */
    const tindakanItems = (req.body.tindakan || []).map(
      (item) => ({
        item_type: "TINDAKAN",
        item_name: item.tariff_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.subtotal,
      })
    );

    /* =========================
       5. GABUNGKAN ITEM
    ========================= */
    const items = [...medicineItems, ...tindakanItems];

    /* =========================
       6. HITUNG TOTAL
    ========================= */
    const total_amount = items.reduce(
      (sum, i) => sum + Number(i.subtotal || 0),
      0
    );

    /* =========================
       7. GENERATE / UPSERT PAYMENT
    ========================= */
    await Payment.findOneAndUpdate(
      { registration_id },
      {
        registration_id,
        patient_id: registration.patient_id._id,

        items,
        total_amount,

        status: "UNPAID",
      },
      { upsert: true, new: true }
    );

    return res.json({
      metadata: {
        code: 200,
        message: "RME saved",
      },
      response: data,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      metadata: {
        code: 500,
        message: err.message,
      },
    });
  }
};
exports.getByRegistration = async (req, res) => {
  try {
    const data = await RME.findOne({
      registration_id: req.params.id,
    });

    return res.json({
      metadata: { code: 200 },
      response: data,
    });
  } catch (err) {
    return res.status(500).json({
      metadata: { code: 500, message: err.message },
    });
  }
};