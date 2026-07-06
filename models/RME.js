const mongoose = require("mongoose");

const RMESchema = new mongoose.Schema(
  {
    registration_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
      required: true,
      unique: true,
    },

    anamnesis: {
      complaint: String,
      history_disease: String,
      allergy: String,
    },

    pemeriksaan: {
      systolic: Number,
      diastolic: Number,
      temperature: Number,
      pulse: Number,
      respiration: Number,
    },

    diagnosis: {
      diagnosis: String,
      icd10: {
        icd10_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ICD10",
          default: null,
        },
        code: {
          type: String,
          default: "",
        },
        name: {
          type: String,
          default: "",
        },
      },
    },

    penggunaan_obat: [
      {
        medicine_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Medicine",
        },
        medicine_name: String,
        quantity: Number,
        unit_price: Number,
        subtotal: Number,
        aturanpakai: String,
      },
    ],
    tindakan: [
      {
        tariff_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Tariff",
        },
        tariff_name: String,
        quantity: Number,
        unit_price: Number,
        subtotal: Number,
      },
    ],
    current_version: {
      type: Number,
      default: 1,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    deleted_at: Date,
    deleted_by: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("RME", RMESchema);