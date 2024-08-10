const express = require('express');
const Stripe = require('stripe');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const stripe = Stripe('sk_test_51PmJK1AaKRJTC7agjo54SaWTvm5aUvdjq2PkpocZGaoew3tz9RPibYuwyOZmDwy10AoVhfdD6hK64OJ8BabI1OX200cD6Y0oRg'); // Replace with your Stripe Secret Key

app.use(cors());
app.use(bodyParser.json());

app.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Villa Booking',
                    },
                    unit_amount: 7500 * 100, // Replace with the dynamic amount
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: 'https://villaonclick.webflow.io/profile', // Replace with your success URL
        cancel_url: 'https://villaonclick.webflow.io',   // Replace with your cancel URL
    });

    res.json({ id: session.id });
});

app.listen(4242, () => console.log('Server is running on port 4242'));
