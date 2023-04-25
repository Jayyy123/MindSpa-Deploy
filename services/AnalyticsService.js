const geoip = require('geoip-lite');
const dns = require('dns');
const { default: Axios } = require('axios');
const DeviceDetector  = require("device-detector-js");
const deviceDetector = new DeviceDetector();

// http://ip-api.com/json/
// https://geolocation-db.com/json/
const apiKey = "819ababb3826465b95ef1c092f0b285d"
const imageConfig = {
  mapId: '6d888c05-ea09-4e5b-9514-d804aa2ce3df',
  zoom: 17,
  width: 600,
  height: 450,
  scale: 1,
  format: 'png',
}

async function verifyReq(req,user,db){
  const { lat, lon } = await getCoord();
  try{
    await db.user.update({
      verify:1,
      data: JSON.stringify({
        userAgent: req.headers["user-agent"],
        lat,
        lon,
        verified: (new Date()).toISOString()
      }
  )}, {where: {id: user.id}})
    return {
      continue: true,
    }
  }catch(e) {
    return {
      continue: false,
    }
  }
}

async function checkReq(req,user,db){
  let verifiedAgent = user?.data;
  if(!verifiedAgent){
    const { lat, lon } = await getCoord();
    await db.user.update({data: JSON.stringify({
      userAgent: req.headers["user-agent"],
      lat,
      lon
  })}, {where: {id: user.id}})
    return {
      continue: true,
    }
  }
  verifiedAgent = JSON.parse(verifiedAgent);
  const verifiedDevice = deviceDetector.parse(verifiedAgent.userAgent);
  const currentDevice = getDevice(req.headers["user-agent"]);
  if(checkMatch(verifiedDevice,currentDevice)){
    return {
      continue: true,
    }
  }
  const suspiciousDevice = await sendDetails(req);
  return {
    continue: false,
    ...suspiciousDevice
  }
}

 function getDevice(userAgent){
  const device = deviceDetector.parse(userAgent);
  return device;
}

async function getCoord(){
  const coordsURL = 'http://ip-api.com/json/';
  try{
    const coords = (await Axios.get(coordsURL)).data
    const { lat, lon,city,country } = coords
    return {
      lat,
      lon,
      city,
      country
    }
  }catch(e) {
    console.log(e)
    return {
      lat: null,
      lon: null
    }
  }
}

function checkMatch(array1, array2){
  const keys = Object.keys(array1);
  let cont = true;
  keys.forEach(key => {
    if(key === "client"){
      return;
    }
    console.log(key,array1[key], array2[key])
    if(array1[key] !== array2[key]){
      cont = false;
    }
  })
  return cont;
}

async function sendDetails(req){
  const { mapId, zoom, width, height, scale, format } = imageConfig
  try{
    const coords = await getCoord();
    const { lat, lon, city, country } = coords
  const imageURL = `https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=${width}&height=${height}&center=lonlat:${lon},${lat}&zoom=14&marker=lonlat:${lon},${lat};type:material;color:%23ff3421;icontype:awesome&apiKey=${apiKey}`
  const device = getDevice(req.headers["user-agent"]);
  return {
    imageURL: imageURL,
    device,
    location: city + ', ' + country
  }
  }catch(e) {
    console.log(e)
    return {
      imageURL: null,
    }
  }
// 6d888c05-ea09-4e5b-9514-d804aa2ce3df


  // let IPAddress = req.headers["X-Real-Ip"];
  // IPAddress = req.headers['x-forwarded-for']
  // if (IPAddress == "") {
  // }
  // const geo = geoip.lookup(IPAddress);
  // return dns.reverse(req.connection.remoteAddress, function(err, domains) {
  //   return {domains, geo}
  // });
}

module.exports = {checkReq,verifyReq}

// const { sqlDateFormat, sqlDateTimeFormat } = require('../utils/date');
// if (req.ip) {
//   const geo = geoip.lookup(req.ip);
//   country = geo ? geo.country : "na";
// }

// const payload = {
//   user_id: req.user_id ? req.user_id : 0,
//   role: req.role ? req.role : 'na',
//   url: req.originalUrl,
//   path: req.baseUrl + req.path,
//   hostname: referrer ? referrer : 'na',
//   ip: req.ip ? req.ip : 'na',
//   browser: req.headers["user-agent"] ? req.headers["user-agent"] : 'na',
//   country: country,
//   create_at: sqlDateFormat(new Date()),
//   update_at: sqlDateTimeFormat(new Date()),
// };

// https://api.maptiler.com/maps/6d888c05-ea09-4e5b-9514-d804aa2ce3df/?key=XjfrkR2Pvrr8fEQ7gScI#-0.2/0.00000/116.61831

// https://api.maptiler.com/maps/6d888c05-ea09-4e5b-9514-d804aa2ce3df?key=XjfrkR2Pvrr8fEQ7gScI/static/3.3903,6.4474,17/500x2501.png


// https://api.maptiler.com/maps/streets/static/auto/400x300.png?path=stroke:green|width:3|fill:none|5.9,45.8|5.9,47.8|10.5,47.8|10.5,45.8|5.9,45.8&key=YOUR_MAPTILER_API_KEY
// https://api.maptiler.com/maps/streets/static/3.3903,6.4474,3/400x300.png?key=XjfrkR2Pvrr8fEQ7gScI#-0.2/0.00000/116.61831


// https://maps.geoapify.com/v1/staticmap?apiKey=819ababb3826465b95ef1c092f0b285d&lonlat:3.3903,6.4474;type:awesome;color:%231db510;size:x-large;icon:apple-alt;whitecircle:no&center=lonlat:3.3903,6.4474&area=rect:3.3903,6.4474,3.3903,6.4474,41.542&width=500&height=600&format=png



// Latitude 37°21′N to 34°51′15″S and Longitude 51°27′52″E to 17°33′22″W

// https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=600&height=400&center=lonlat:3.3903,6.4474&zoom=14&marker=lonlat:3.3903,6.4474;type:material;color:%23ff3421;icontype:awesome&apiKey=819ababb3826465b95ef1c092f0b285d




















