const axios = require('axios');
exports.handler = async(context, event, callback) => {
  console.log("IN FUNC");
  let response='';
  //let receipent_contact=event.receipent_contact;
  let receipent_contact='whatsapp:+94769094725';
  //whatsapp:+14155238886
  // let latitude=event.latitude;
  // let longitude=event.longitude;
  let latitude='6.9270786';
  let longitude='79.861243';
  //80.7062
  try {
    let userList = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude}%2C${longitude}&radius=3000&type=music&keyword=gym&keyword=fitness&key=AIzaSyBZF2DsnUPoZv9a0kwU8lZOw60j800HxpI`);
    console.log(userList.data);
    for(var i=0; i<userList.data.results.length; i++){
      var lat=userList.data.results[i].geometry.location.lat;
      var lng=userList.data.results[i].geometry.location.lng;
      var link=`https://www.google.com/maps?q=${lat},${lng}`;
      response=response+`\n\n${link}`;
    }

  } catch (error) {
    console.error(error);
  }
  //send the updated status
  const twilioClient = context.getTwilioClient();
  //const from = event.From || 'whatsapp:+94769094725';
  const from = event.From || 'whatsapp:+14155238886';
  const to = event.To || `${receipent_contact}`;
  const body = event.Body || `Here are a list of nearest gym/ fitness centers: ${response}`;
  twilioClient.messages
    .create({ body, to, from })
    .then((message) => {
      console.log('SMS successfully sent');
      console.log(message.sid);
      return callback(null, `Success! Message SID: ${message.sid}`);
    })
    .catch((error) => {
      console.error(error);
      return callback(error);
    });

};
