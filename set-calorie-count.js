const axios = require('axios');
const cohere = require('cohere-ai');

async function sendTwilioMessage(context, callback, receipent_contact, message_input, compiledResponse, calGoal, type, totalCal, calGoalProgress, calInput, calCount, calStatus){
  response=`${compiledResponse}`
  const twilioClient = context.getTwilioClient();
    const from = 'whatsapp:+14155238886';
    const to = `${receipent_contact}` ;
    const body = `${response}`;
    twilioClient.messages
      .create({ body, to, from })
      .then((message) => {
        console.log('SMS successfully sent');
        console.log(message.sid);
        return callback(null, ``);
      })
      .catch((error) => {
        console.error(error);
        return callback(error);
      });
}

async function postData(context, callback, receipent_contact, message_input, compiledResponse, calGoal, type, totalCal, calGoalProgress, calInput, calCount, calStatus) {
  try {
    let calorieList = await axios.get(`https://shafnazainabfahim.wixsite.com/apptiv/_functions/calorieList`);
    calorieList=calorieList.data.items
    console.log("CALORIE LIST IS:",calorieList);
    let toAdd={"calInput":`${calInput}`, "calCount": calCount,"calStatus": `${calStatus}`};
    const addCalEntry = await axios.post(`https://shafnazainabfahim.wixsite.com/apptiv/_functions/addCalInput/`,toAdd);
    await sendTwilioMessage(context, callback, receipent_contact, message_input, compiledResponse, calGoal, type, totalCal, calGoalProgress, calInput, calCount, calStatus);
  } catch (error) {
    console.error(`ERROR IN postData: ${error}`);
  }   
}

async function getFoodCal(context, callback, receipent_contact, message_input, compiledResponse, calGoal, type, totalCal, calGoalProgress, calInput, calCount, calStatus) {
  //get food calorie count
  calStatus="Addition";
  console.log("get food calorie count");
  const options = {
    method: 'GET',
    url: 'https://nutrition-by-api-ninjas.p.rapidapi.com/v1/nutrition',
    params: {query: `${message_input}`},
    headers: {
      'X-RapidAPI-Key': 'OPENAI_API_KEY',
      'X-RapidAPI-Host': 'nutrition-by-api-ninjas.p.rapidapi.com'
    }
  };

  await axios.request(options).then(function (response) {
    console.log(`TOTAL FOOD RESULT: ${JSON.stringify(response.data)}`);
    console.log(`TOTAL CALORIE GAINED: ${response.data[0]['calories']}`);
    calInput+=`${response.data[0]['name']}`;
    calCount+=parseInt(response.data[0]['calories']);
    calGoalProgress=parseInt(calGoal)-parseInt(calCount);
    compiledResponse+=`Based on your food intake, your calorie count has increased by ${parseInt(calCount)} calorie units.`;
    
    
  }).catch(function (error) {
    console.error(`ERROR IN getFoodCal: ${error}`);
  });
  //add new calEntry
  await postData(context, callback, receipent_contact, message_input, compiledResponse, calGoal, type, totalCal, calGoalProgress, calInput, calCount, calStatus);
 
}

async function getActivityCal(context, callback, receipent_contact, message_input, compiledResponse, calGoal, type, totalCal, calGoalProgress, calInput, calCount, calStatus) {
  console.log("in activity calorie count ");
  const options = {
    method: 'GET',
    url: 'https://calories-burned-by-api-ninjas.p.rapidapi.com/v1/caloriesburned',
    params: {activity: `${message_input}`},
    headers: {
      'X-RapidAPI-Key': 'OPENAI_API_KEY',
      'X-RapidAPI-Host': 'calories-burned-by-api-ninjas.p.rapidapi.com'
    }
  };

  await axios.request(options).then(function (response) {
    console.log(`TOTAL CALORIE RESULT: ${JSON.stringify(response.data[0])}`);
    console.log(`TOTAL CALORIE LOST: ${response.data[0]['total_calories']}`);
    calInput+=`${response.data[0]['name']}`;
    calCount+=parseInt(response.data[0]['total_calories']);
    calGoalProgress=parseInt(calGoal)-parseInt(calCount);
    compiledResponse+=`Congratualiation on your recent activity! Keep up the great work\nBased on your activity, your calorie count has decreased by ${parseInt(calCount)} calorie units. `;
  }).catch(function (error) {
    console.error(`ERROR IN getActivityCal: ${error}`);
  });
  //add new calEntry
  await postData(context, callback, receipent_contact, message_input, compiledResponse, calGoal, type, totalCal, calGoalProgress, calInput, calCount, calStatus);
 
}

async function classifyType(context, callback, receipent_contact, message_input, compiledResponse, calGoal, type, totalCal, calGoalProgress, calInput, calCount, calStatus) {
  //classify if input is food or activity
  try{
    console.log("in classify if input is food or activity")
    cohere.init('COHERE_API_KEY'); // This is your trial API key
      const response = await cohere.classify({
        model: '3e573f19-73a6-447c-a1cb-3eb9b4f2bcf8-ft',
        inputs: [`${message_input}`]
      });
      console.log(`The confidence levels of the labels are ${JSON.stringify(response.body.classifications)}`);
      console.log(`Classify response is: ${JSON.stringify(response.body.classifications[0].prediction)}`);
      type=`${JSON.stringify(response.body.classifications[0].prediction)}`;
      //get calorie count
      console.log(`TYPE IS: ${type}`);
      if (type=='"food"'){
        console.log("TYPE IS INDEED FOOD");
        await getFoodCal(context, callback, receipent_contact, message_input, compiledResponse, calGoal, type, totalCal, calGoalProgress, calInput, calCount, calStatus);
      }else{
        console.log("TYPE IS INDEED ACTIVIITYYYYY");
        await getActivityCal(context, callback, receipent_contact, message_input, compiledResponse, calGoal, type, totalCal, calGoalProgress, calInput, calCount, calStatus);
      }
  } catch (error) {
    console.error(`ERROR IN classifyType: ${error}`);
  }
}

async function getUserCalGoal(context, callback, receipent_contact, message_input, compiledResponse, calGoal, type, totalCal, calGoalProgress, calInput, calCount, calStatus) {
  //get user calGoal
  try {
  let userList = await axios.get(`https://shafnazainabfahim.wixsite.com/apptiv/_functions/userList`);
  userList=userList.data.items
  console.log("USER LIST IS:",userList);
  for (let i = 0; i < userList.length; i++) {
    console.log("Current Number in loop is: ",userList[i].phoneNumber);
    if (userList[i].phoneNumber==receipent_contact){
      calGoal=userList[i].calGoal;
    }
  }
  //classify if input is food or activity
  await classifyType(context, callback, receipent_contact, message_input, compiledResponse, calGoal, type, totalCal, calGoalProgress, calInput, calCount, calStatus) ;
  } catch (error) {
    console.error(`ERROR IN getUserCalGoal: ${error}`);
  }
}

async function getWeekTotalCal(context, callback, receipent_contact, message_input, compiledResponse, calGoal, type, totalCal, calGoalProgress, calInput, calCount, calStatus) {
  //get total cal for the week
  try {
    let calorieList = await axios.get(`https://shafnazainabfahim.wixsite.com/apptiv/_functions/calorieList`);
    calorieList=calorieList.data.items
    console.log("CALORIE LIST IS:",calorieList);
    for (let i = 0; i < calorieList.length; i++) {
      totalCal+=calorieList[i].calCount;
    }
  //get user calGoal
  await getUserCalGoal(context, callback, receipent_contact, message_input, compiledResponse, calGoal, type, totalCal, calGoalProgress, calInput, calCount, calStatus) ;
  } catch (error) {
    console.error(`ERROR IN getWeekTotalCal: ${error}`);
  }
}

exports.handler = async(context, event, callback) => {
  const receipent_contact=event.From;
  //console.log(`receipent_contact is: ${receipent_contact}`)
  let message_input=event.Body;
  let compiledResponse='';
  let type;
  let calGoal;
  let calGoalProgress;
  let calStatus;
  let calCount=0;
  let calInput;
  let totalCal=0;
  await getWeekTotalCal(context, callback, receipent_contact, message_input, compiledResponse, calGoal, type, totalCal, calGoalProgress, calInput, calCount, calStatus);
};
