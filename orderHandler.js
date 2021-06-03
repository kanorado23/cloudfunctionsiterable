//GCF runs off of Node - any NPM library can be used, make sure to add it as a dependency under the package.json native to the GCF creation

const request = require('request');


exports.orderHandler = (req, res) => {

 var newObj = {};
  // new object to store data elements that need to be sent to Iterable
  
 if(req.body)
  {
	try {

	    newObj.id = req.body.number;  
		newObj.user = {
		    email : req.body.billing.email,
		    preferUserId : false,
		    mergeNestedObjecgts : false
		    };
        newObj.items = [];
		for(let item of req.body.line_items) {
            	newObj.items.push
		    (
			{"id" : item.id.toString(), 
			"name" : item.name, 
			"quantity" : item.quantity, 
			"price" : parseFloat(item.subtotal), 
			"sku": item.sku});
                };
            
        newObj.total = parseFloat(req.body.total),
        newObj.dataFields = {
            status : req.body.status,
            customerId : req.body.customer_id, 
            parentId : req.body.parent_id, 
            id : req.body.number 
        }

	console.log('created new obj' + newObj) // logging for validation turn off once push to prod

  	request.post({'uri': 'https://api.iterable.com/api/commerce/trackPurchase', json: newObj, headers: { 'api-key': 'fadfladjfd;lfjdlfj' }}, function (error, response, body) {
      	if(error) 
		{
		console.error('error:', error); // Print the error if one occurred 
		 res.status(500).send(JSON.stringify({"status" : "failed" , "message" : "Processing error ! " + error}));
		}
		else {
			console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
			console.log('sent to iterable' + newObj);  //for debug purposes and data validation only 
				
			if(response && response.statusCode == 200) {
			res.status(200).send(JSON.stringify({"status" :"success"}));  //gratification logging keeep this on in prod. pew pew gold start of success
			}
			else {
			    res.status(500).send(JSON.stringify({"status" :"failed" , "message" : body}));
			    }
			}
    		});
	}catch(error) {
		//error handling for debug purposes 
		console.error(error);
		res.status(500).send(JSON.stringify({"status" : "failed" , "message" : "Processing error ! " + error}));
	}

     }
else {
	//catch all 
	console.error("Bad request body or key missing !");
	res.status(500).send("Processing error !");
  }
};

