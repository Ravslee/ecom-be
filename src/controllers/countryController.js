const Country = require("../models/Country");

const DEFAULT_COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "India",
  "Japan",
  "Singapore",
  "Brazil",
];

exports.listCountries = async (req, res, next) => {
  try {
    let countries = await Country.find({}).sort("country_name");
    if (!countries.length) {
      await Country.insertMany(
        DEFAULT_COUNTRIES.map((c) => ({ country_name: c }))
      );
      countries = await Country.find({}).sort("country_name");
    }
    res.json(countries);
  } catch (err) {
    next(err);
  }
};
