const express = require('express');
const path = require('path');
const port = process.env.PORT || 5000;
const app = express();

app.get('/ping', function (req, res) {
 return res.send('pong');
});

// production mode
// if(process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, 'build')));
    
//     app.get('*', (req, res) => {
//       res.sendfile(path.join(__dirname = 'build/index.html'));
//     })
// }

// build mode
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.listen(port);
