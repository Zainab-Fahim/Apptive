import { ok, notFound, serverError } from 'wix-http-functions';
import wixData from 'wix-data';


export function get_userList() {
    const options = {
        "headers": {
            'Content-Type': 'application/json'
        }
    };

    return wixData.query("UserList")
        .find()
        .then(results => {
            if (results.items.length > 0) {
                options.body = {
                    "items": results.items
                }
                return ok(options)
            }
        })

}


export function get_calorieList() {
    const options = {
        "headers": {
            'Content-Type': 'application/json'
        }
    };

    return wixData.query("CalorieCount")
        .find()
        .then(results => {
            if (results.items.length > 0) {
                options.body = {
                    "items": results.items
                }
                return ok(options)
            }
        })

}

export function post_addCalInput(request) {
  let options = {
    "headers": {
      "Content-Type": "application/json",
      "suppressAuth": true, // Setting this option to true will bypass the permissions.
        "suppressHooks": true // Setting this option to true will bypass the hooks.
    }
  };
  // get the request body
  return request.body.json()
  .then( (body) => {
      // update the item in a collection
      return wixData.insert("CalorieCount", body);
    } )
    .then( (results) => {
      options.body = {
        "inserted": results
      };
      return ok(options);
    } )
    // something went wrong
    .catch( (error) => {
      options.body = {
        "error": error
      };
      return serverError(options);
    } );
}


