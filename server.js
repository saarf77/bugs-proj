const express = require('express');
const cookieParser = require('cookie-parser');

const bugService = require('./services/bug.service');
const pdfService = require('./services/pdf.service');
const userService = require('./services/user.service')


const app = express();
// const PORT = 3030;

const PORT = process.env.PORT || 3030

app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());



//READ LIST
app.get('/api/bug', (req, res) => {
  const filterBy = req.query;

  bugService.query(filterBy).then((results) => res.status(200).send(results));
});


// download
app.get('/api/bug/download', (req, res) => {
  bugService
    .query({ itemsPerPage: Infinity })
    .then(({ bugs }) => pdfService.buildBugsPDF(bugs))
    .then(() => res.download('Bugs.pdf'));
})




// READ
app.get('/api/bug/:bugId', (req, res) => {
  const { bugId } = req.params;
  if (!bugId) return res.status(400).send('invalid bugId');

  let visitBugs = req.cookies.visitBugs || [];
  if (visitBugs.length >= 3 && !visitBugs.includes(bugId)) {
    return res.status(401).send('Wait for a bit');
  }

  bugService
    .getById(bugId)
    .then((bug) => {
      !visitBugs.includes(bugId) && visitBugs.push(bugId);
      res.cookie('visitBugs', visitBugs, { maxAge: 7000 });
      res.status(200).send(bug);
    })
    .catch((msg) => res.status(400).send(msg));
});

app.get('/api/user-list', (req, res) => {

  userService.query()
     .then(users => {
        res.send(users)
     })
     .catch((err) => {
        console.log('OOPS:', err)
        res.status(400).send('Cannot load users')
      })
})


// ADD
app.post('/api/bug', (req, res) => {
  const loggedinUser = userService.validateToken(req.cookies.loginToken)
  if (!loggedinUser) return res.status(401).send('Cannot add bug')
  loggedinUser.bugCount++
  console.log('req.body', req.body);
  const bug = {
    _id: null,
    title: req.body.title,
    description: req.body.description,
    severity: +req.body.severity,
    createdAt: +req.body.createdAt,
    owner: loggedinUser
  };
  
  bugService.save(bug).then((savedBug) => res.status(201).send(savedBug));
});


// UPDATE
app.put('/api/bug/:bugId', (req, res) => {
  const loggedinUser = userService.validateToken(req.cookies.loginToken)
  if(!loggedinUser.isAdmin){
    if (!loggedinUser) return res.status(401).send('Cannot update car')
    if(loggedinUser.fullname !== req.body.owner.fullname && loggedinUser._id !== req.body.owner._id) return res.status(401).send('Cannot update bug')
 }
 const { bugId } = req.params;
  const bug = {
    _id: bugId,
    title: req.body.title,
    description: req.body.description,
    severity: +req.body.severity,
    createdAt: +req.body.createdAt,
    owner: loggedinUser
  };
  bugService
    .save(bug)
    .then((updatedBug) => res.status(201).send(updatedBug))
    .catch((msg) => res.status(400).send(msg));
    
  });

  
  // delete
app.delete('/api/bug/:bugId', (req, res) => {
  const loggedinUser = userService.validateToken(req.cookies.loginToken)
  if (!loggedinUser) return res.status(401).send('Cannot remove bug')

  const { bugId } = req.params;
  bugService
    .remove(bugId, loggedinUser)
    .then(() => res.status(200).send('The bug is removed!'))
    .catch((msg) => res.status(400).send(msg));
})

// delete user
app.delete('/api/user-list/:userId', (req, res) => {
  const { userId } = req.params
  userService.remove(userId )
     .then(() => {
        res.send('user removed!!')
     })
     .catch((err) => {
        console.log('OPS: ', err)
        res.status(404).send('Unkown user')
     })
})



// LOGIN
app.post('/api/auth/login', (req, res) => {
  userService.checkLogin(req.body)
    .then(user => {
      if (user) {
        const loginToken = userService.getLoginToken(user)
        res.cookie('loginToken', loginToken)
        res.send(user)

      } else {
        res.status(401).send('Invalid login')
      }
    })
})


// SIGNUP
app.post('/api/auth/signup', (req, res) => {
  userService.save(req.body)
    .then(user => {
      const loginToken = userService.getLoginToken(user)
      res.cookie('loginToken', loginToken)
      res.send(user)
    })
})

// LOGOUT
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('loginToken')
  res.send('logged out')
})









app.listen(PORT, () => console.log(`Server ready at port: ${PORT}!`))


// app.listen(PORT, () => console.log('Server ready at port 3030!'));
