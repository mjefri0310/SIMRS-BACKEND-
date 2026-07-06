const Registration = require("../models/Registration");
module.exports = async () => {
  const today =
    new Date()
      .toISOString()
      .slice(0, 10)
      .replaceAll("-", "");
  const count =
    await Registration.countDocuments({
      createdAt: {
        $gte: new Date(
          new Date().setHours(
            0,
            0,
            0,
            0
          )
        ),
      },
    });
  return `REG${today}${String(
    count + 1
  ).padStart(4, "0")}`;
};