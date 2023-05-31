const express = require("express")
const router = express.Router()
const Publishable_Key = 'pk_test_51N72caLzGzihVWNoSbs97CxSFoRMKkP1nJP2lJGyBOLYE6754wI5NE0GF3Hhq68aS1kcAAZL6ar971ycYWbMWM7Z009CQxhwRY'
const Secret_Key = 'sk_test_51N72caLzGzihVWNoN6t3MFV2eC2bjhdcxeNeUf8o1UnHhtOQo6zHXsijz3YFj28OdVM1JrUw0n36Ul4t3my2dNfh00xxEN6psM'
const stripe = require('stripe')(Secret_Key)


router.get("/", (req, res)=>{return res.render('payment', {key: Publishable_Key})})

router.post("/", (req, res)=>{
	// Moreover you can take more details from user
	// like Address, Name, etc from form
	stripe.customers.create({
		email: req.body.stripeEmail,
		source: req.body.stripeToken,
		name: 'Gourav Hammad',
		address: {
			line1: 'TC 9/4 Old MES colony',
			postal_code: '452331',
			city: 'Indore',
			state: 'Madhya Pradesh',
			country: 'India',
		}
	})
	.then((customer) => {

		return stripe.charges.create({
			amount: 2500,	 // Charging Rs 25
			description: 'Web Development Product',
			currency: 'INR',
			customer: customer.id
		});
	})
	.then((charge) => {
		res.send("Success") // If no error occurs
	})
	.catch((err) => {
		res.send(err)	 // If some error occurs
	});
})

module.exports = router