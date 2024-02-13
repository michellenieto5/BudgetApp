'use strict';

const PORT = 3000;

const express = require('express');
const app = express();

//when done the request, look into the public folder 
// is there a resource that is matching the request? 
app.use(express.static('public'));

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


app.post("/review", (req, res) => {

    const formData = req.body;

    // Process the data as needed (for now, just log it)
    console.log('Received data 3:', formData);
  
    // Respond with a success message
    res.send('Budget submitted successfully!'); 
   // const budgetData = req.body;
   // console.log(req.body)
   // res.send(budgetData);
})  
app.post('/submit-feedback', (req, res) => {
    const { question, userQuestion } = req.body;
  
    // Here, you can process the form data as needed
    console.log('Received form submission:');
    console.log('Question:', question);
    console.log('User Question:', userQuestion);
  
    // Send a response back to the client
    res.send('Form submission successful!');
  });
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});