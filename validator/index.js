exports.userSignupValidator = (req, res, next) =>{
    req.check('name', 'Name is Required').notEmpty()
    req.check('email', 'Email must be between 3 and 32 characters')
        .matches(/.+\@.+\..+/)
        .withMessage("Invalid Email")
        .isLength({
            min: 3,
            max: 32
        });
    req.check('password', 'Password is Required').notEmpty()
    req.check('password')
        .isLength({min: 6})
        .withMessage("Password must contain at least 6 characters")
        .matches(/\d/)
        .withMessage("Password must contain at least 1 number")
        const errors = req.validationErrors();
        if(errors) {
            const firstError = errors.map(error => error.msg)[0]
            return res.status(400).json({ error: firstError })
        }
        next();
}