const Registration =
  require("../models/Registration");

module.exports = async (
  clinic_id,
  registrationDate = new Date()
) => {

  const startDate = new Date(
    registrationDate
  );

  startDate.setHours(
    0,
    0,
    0,
    0
  );

  const endDate = new Date(
    registrationDate
  );
  endDate.setHours(
    23,
    59,
    59,
    999
  );
  const totalQueue =
    await Registration.countDocuments({
      clinic_id,
      registration_date: {
        $gte: startDate,
        $lte: endDate,
      },
      is_deleted: false,
    });
  return totalQueue + 1;
};