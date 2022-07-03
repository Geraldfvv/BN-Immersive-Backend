const app = require("./app");
const PORT = process.env.PORT || 3001;

/**
 * Server function
 *
 * PORT: 3001
 * HOSTNAME: localhost
 */
 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
