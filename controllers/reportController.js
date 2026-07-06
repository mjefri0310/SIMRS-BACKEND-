const Registration = require("../models/Registration");
const response = require("../utils/response");

exports.visitReport = async (req, res) => {
  try {
    const { start, end } = req.query;

    const filter = {
      is_deleted: false,
    };

    if (start && end) {
      filter.registration_date = {
        $gte: new Date(start),
        $lte: new Date(end + "T23:59:59"),
      };
    }

    const data = await Registration.find(filter)
      .populate("patient_id")
      .populate("clinic_id")
      .populate("doctor_id")
      .populate("insurance_id")
      .populate("service_type_id")
      .sort({
        registration_date: -1,
      });

    return response.success(res, {
      message: "Berhasil mengambil laporan kunjungan",
      data,
    });
  } catch (err) {
    return response.error(res, {
      message: err.message,
    });
  }
};