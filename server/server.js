// //server.js
// const express = require('express');
// const cors = require('cors');
// const authRoutes = require('./routes/authRoutes');
// const scoreRoutes = require('./routes/scoreRoutes');

// const app = express();
// // app.use(cors());


// app.use(cors({ 
//     origin: "https://client-production-7bca.up.railway.app", // Allow only your frontend
//     methods: "GET,POST,PUT,DELETE",
//     credentials: true, // Allow cookies if needed
// }));

// app.use(express.json());

// app.use('/api/auth', authRoutes);
// app.use('/api/score', scoreRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




// // [deploy]
// // healthcheckPath = "/ping"
// // restartPolicyMaxRetries =10 
// // restartPolicyType = "ON_FAILURE"

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const scoreRoutes = require('./routes/scoreRoutes');

const app = express();

// CORS configuration
app.use(cors({
  origin: "https://client-production-7bca.up.railway.app",  // Allow only your frontend domain
  methods: "GET,POST,PUT,DELETE",  // Allow these HTTP methods
  credentials: true,  // Allow cookies if needed (this might be useful for auth)
}));

// Body parser for JSON requests
app.use(express.json());

// Handle preflight requests
app.options('*', cors());  // Allow OPTIONS method for preflight checks

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/score', scoreRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
