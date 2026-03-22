const fs = require("fs");
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
  await User.insertMany(users);
  console.log("Usuarios insertados correctamente 👤✅");
};

module.exports = { seedUsers };
