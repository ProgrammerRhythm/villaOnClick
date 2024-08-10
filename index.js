const express = require('express');
const key = "sk_test_51PmJK1AaKRJTC7agjo54SaWTvm5aUvdjq2PkpocZGaoew3tz9RPibYuwyOZmDwy10AoVhfdD6hK64OJ8BabI1OX200cD6Y0oRg"
const stripe = require('stripe')(key);
const app = express();
const cors = require("cors")
app.use(express.json());

app.use(cors())

app.get('/', (req, res) => {
    res.status(200).json({message: "running"});
});
app.post('/create-checkout-session', async (req, res) => {
    const { name, email, phone, amount } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'villaonclick',
                        },
                        unit_amount: amount, // Amount in cents
                    },
                    quantity: 1,
                },
            ],
            customer_email: email,
            mode: 'payment',
            success_url: 'https://villaonclick.webflow.io/profile?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'https://villaonclick.webflow.io/payment-fail',
            metadata: {
                name,
                phone,
            },
        });

        res.json({ id: session.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));