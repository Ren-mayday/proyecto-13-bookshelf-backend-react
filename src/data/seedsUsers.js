const fs = require("fs");
const bcrypt = require("bcrypt");
const User = require("../api/models/User");

const usersData = fs.readFileSync("./src/data/users.csv", "utf-8");

const usersCsvArrayOfObjects = (usersData) => {
  const lines = usersData.split("\n");
  const headers = lines[0].split(",");

  return lines.slice(1).map((line) => {
    const values = line.split(",");
    return headers.reduce((obj, header, index) => {
      obj[header.trim()] = values[index] ? values[index].trim() : "";
      return obj;
    }, {});
  });
};

const users = usersCsvArrayOfObjects(usersData);

const seedUsers = async () => {
  await User.deleteMany();

  const usersWithHashedPasswords = await Promise.all(
    users.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, 10),
    })),
  );

  await User.insertMany(usersWithHashedPasswords);
  console.log("Usuarios insertados correctamente 👤✅");
};

module.exports = { seedUsers };
