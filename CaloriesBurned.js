import wixData from 'wix-data';
import { sendTextMessage } from 'backend/twilio.jsw';



/**
*	Adds an event handler that runs when the element is clicked.
	[Read more](https://www.wix.com/corvid/reference/$w.ClickableMixin.html#onClick)
*	 @param {$w.MouseEvent} event
*/
export function signUpButton_click(event) {
	// This function was added from the Properties & Events panel. To learn more, visit http://wix.to/UcBnC-4
	// Add your code for this event here: 
	let calGoal = $w('#calorieInput').value;
    let phoneNum = $w('#phoneNumber').value;
    let countryCode='+94'
    let dataToStore = {
		"calGoal":calGoal,
        "phoneNumber": `whatsapp:${countryCode}${phoneNum.slice(1)}`
    }
	console.log(dataToStore);
    wixData.insert("UserList", dataToStore).then((result) => {
        console.log(result);
        $w('#phoneNumber , #calorieInput').value = "";
    });
    sendTextMessage(phoneNum);
}
