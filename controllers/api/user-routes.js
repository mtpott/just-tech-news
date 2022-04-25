const router = require('express').Router();
const { User, Post, Vote, Comment } = require('../../models');

//GET /api/users
router.get('/', (req, res) => {
    //access our User model and run .findAll() method
    //.findAll() method lets us query all of the users from the user table in the database, and is the SQL equivalent of SELECT * FROM users;
    User.findAll({
        attributes: { exclude: ['password'] }
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//GET /api/users/1
router.get('/:id', (req, res) => {
    //indicating that we only want one piece of data back, rather than all. instead of writing an SQL query, we can use JavaScript objects to help configure the query. here, we're using the 'where' option to indicate we want to find a user where its id value equals whatever req.params.id is, like the SQL query SELECT * FROM users WHERE id = 1. in the case that we search for a user with a nonexistent id value, it sends a 404 back to the client to indicate that they asked for a nonexistent piece of data.
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'post_url', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            },
            {   
                model: Post, 
                attributes: ['title'],
                through: Vote,
                as: 'voted_posts'
            }
        ]
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'no user found with this id.' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//POST /api/users
router.post('/', (req, res) => {
    //expects {username: 'username', email: 'email@email.com', password: 'password' }

    //to insert data, we use sequelize's .create() method. pass in key/value pairs where the keys are what we defined in the User model and the values are what we get from the req.body. in SQL this looks like INSERT INTO users (username, email, password) VALUES ("abcde", "email@email.com", "password")
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => {
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

        res.json(dbUserData);
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.post('/login', (req,res) => {
    //expects {email: 'email@email.com', password: 'password'}
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({ message: 'no user with that email address.' });
            return;
        }
        //verify user
        const validPassword = dbUserData.checkPassword(req.body.password);
            if (!validPassword) {
                res.status(400).json({ message: 'incorrect password.' });
                return;
            }

            req.session.save(() => {
                //declare session variables
                req.session.user_id = dbUserData.id;
                req.session.username = dbUserData.username;
                req.session.loggedIn = true;

                res.json({ user: dbUserData, message: 'you are now logged in.' });
            });
    });
});

//PUT /api/users/1
router.put('/:id', (req, res) => {
    //expects {username: 'username', email: 'email@email.com', password: 'password' }

    //if req.body has exact key/value pairs to match the model, you can just use 'req.body' instead

    //.update() method combines the parameters for creating data and looking up data. we pass in the req.body to provide the new data we want to use in the update and req.params.id to indicate where exactly we want that new data to be used. in SQL, this looks like UPDATE users SET username = 'username', email = 'email@email.com', password = 'NEWpassword!' WHERE id = 1;
    User.update(req.body, {
        //individualHooks makes sure the hook for the hashed password is created
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData[0]) {
            res.status(404).json({ message: 'no user found with this id.' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//DELETE /api/users/1
router.delete('/:id', (req, res) => {
    //use .destroy() to delete data and provide some type of identifier to indicate where exactly we would like to delete data from the user database table
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'no user found with this id.' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//logout; destroy the session variables and reset the cookie
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            //send a 204 status code after the session has been successfully destroyed
            res.status(204).end();
        });
    } 
    else {
        res.status(404).end();
    }
});

module.exports = router;