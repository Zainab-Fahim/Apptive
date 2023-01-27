## Inspiration
I have always desired a comprehensive app that can track my calorie intake, so that I can monitor my progress in my diet and exercise regimen. A chatbot-like interface would make it easier to achieve my fitness goals, which is exactly what Apptive delivers.

## What it does
Apptive is a web application that allows you to set up a WhatsApp chatbot to track your calorie intake, locate nearby fitness centers and determine the specific exercises needed to target specific muscles.

## How we built it
- We used Twilio to create the WhatsApp integration for the application. Specifically, we utilized the Twilio Messaging API, the WhatsApp messaging API, the WhatsApp Sandbox, and Twilio Serverless Functions to host the functions on Twilio's platform.
- We used Velo by Wix to construct both the front-end and back-end of the application. The Wix-data API was employed to read and write data to the database. We also used HTTP Functions to expose the site's database as an API, allowing for the addition and retrieval of data. The Wix Window was used to obtain the user's current latitude and longitude.
- We employed three different API endpoints from apininjas in the Rapid API library collection to access calorie and exercise information.
- We utilized Cohere to develop our first language model, which is used to identify if the user inputs a food or activity, thus determining if there is an increase or decrease in calories

## Challenges we ran into
- Exposing the Site API point was a challenge, it took a lot of reading of documentation and understanding how axios works to finally get the application to function.
- Integrating Twilio with Wix was also a significant challenge, as it involved working with many configurations.
- This was our first time using Cohere or any other language model, and we chose to use a custom model, so it was definitely a learning curve to understand how a language model works with datasets.

## Accomplishments that we're proud of
- We are thrilled that all the features we planned to implement were successfully completed.
- We are proud of including multiple features in the application.
- We are glad we took the step to build our first Cohere model.

## What we learned
- Twilio Serverless Function
- Wix Window
- Wix data
- Velo scripting
- Velo HTTP Functions
- Cohere basics
- Language model basics


## What's next for Apptive
- We plan to incorporate many more innovative features to the application.
	
## Apptive Links
- [Devpost](https://devpost.com/software/apptive)
- [Video Demonstration](https://youtu.be/Hf6CUPhp1Dg)
- [Project building process](https://www.youtube.com/QHvhTc6ibKE)


