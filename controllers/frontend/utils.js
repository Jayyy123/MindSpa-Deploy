function formatDate(date) {
  let datePosted = new Date(date);
  const yyyy = datePosted.getFullYear();
  let mm = datePosted.getMonth() + 1; // Months start at 0!
  let dd = datePosted.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  return mm + " / " + dd + " / " + yyyy;
}

function getByKeyName(arr, key) {
  return arr.find((el) => el.dataValues?.key_name == key)?.dataValues;
}

function convertToSlug(str) {
  return str
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}

module.exports = { formatDate, getByKeyName, convertToSlug };
