import wixData from 'wix-data';

export async function resetStatus() {
    //console.log(toPhoneNumber);
    //let num = toPhoneNumber.splt('0')[1];
    console.log("IN FUNCTION resetStatus");
    wixData.query("CalorieCount")
        .find()
        .then((results) => {
            console.log(results.items);
            for (const i of results.items) {
                let toUpdate = {
                    "_id": `${i._id}`,
                    "title": `${i.title}`,
                    "calorie": `${i.phoneNumber}`
                };

                let options = {
                    "suppressAuth": true,
                    "suppressHooks": true
                };

                wixData.update("CalorieCount", toUpdate, options)
                .then((results) => {
                    console.log(results); //see item below
                })
                .catch((err) => {
                    console.log(err);
                });
            }
        })
        .catch((error) => {
            console.log(error);
        });
}
