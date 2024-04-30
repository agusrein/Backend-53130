const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://agusrei:15623748@cluster0.kdax9sq.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Cluster0')
.then(console.log('conectado'))
.catch(error=>{console.log(error)})