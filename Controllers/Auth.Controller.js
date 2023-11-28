const createError = require('http-errors')
const User = require('../Models/User.model')
const { authSchema } = require('../helpers/validation_schema')
const { signAccessToken } = require('../helpers/jwt_helper')
const { 
    signRefreshToken,
    verifyRefreshToken 
} = require('../helpers/jwt_helper')
const client = require('../helpers/init_redis')
const crypto = require('crypto')


module.exports = {
    register:async(req, res, next) => {
    
        try{
            //const { email, password } = req.body
            //if (!email || !password) throw createError.BadRequest()
            const result = await authSchema.validateAsync(req.body)
    
            const doesExist = await User.findOne({ email: result.email })
            if(doesExist) throw createError.Conflict(`${result.email} is already been registred`)
    
            const user = new User (result)
            const savedUser = await user.save()
            const accessToken = await signAccessToken(savedUser.id)
            const refreshToken = await signRefreshToken(savedUser.id)
    
            res.send({accessToken, refreshToken })
    
    
        } catch(error){
            if(error.isJoi === true) error.status = 422
            next(error)
        }
    },
    login: async(req, res, next) => {
        try{
            const result = await authSchema.validateAsync(req.body)
            const user = await User.findOne({email: result.email })
    
            if(!user) throw createError.NotFound('User not registered')
    
            const isMatch = await user.isValidPassword(result.password)
            if(!isMatch) throw createError.Unauthorized('Username or password not valid')
       
            const accessToken = await signAccessToken(user.id)
            const refreshToken = await signRefreshToken(user.id)
    
            res.send({ accessToken, refreshToken })
        }catch (error){
            if(error.isJoi === true) return next(createError.BadRequest("invalide username or password"))
            next(error)
        }
    },
    refreshToken: async(req, res, next) => {
        try{
            const { refreshToken } = req.body
            if(!refreshToken) throw createError.BadRequest()
           const userId = await verifyRefreshToken(refreshToken)
            
           const accessToken = await signAccessToken(userId)
           const refToken = await signRefreshToken(userId)
           res.send({accessToken: accessToken, refreshToken: refToken })
        }catch (error){
            next(error)
        }
    },
    logout:  async(req, res, next) => {
        try{
            const { refreshToken } = req.body
            if(!refreshToken) throw createError()
            const userId = await verifyRefreshToken(refreshToken)
            client.DEL(userId, (err, val) =>{
                if(err){
                    console.log(err.message)
                    throw createError.InternalServerError()
                }
                console.log(val)
                res.sendStatus(204)
            })
        }catch (error){
            next(error)
        }
    },

    forgotPassword: async (req, res, next) => {
        try {
            const { email } = req.body;
    
            // Validate if the user exists
            const user = await User.findOne({ email });
            if (!user) {
                throw createError.NotFound('User not found');
            }
    
            // Check if the user has recently requested a reset (you may adjust the time frame)
            const lastResetRequest = user.resetPasswordRequestedAt;
            if (lastResetRequest && (Date.now() - lastResetRequest) < 60000) {
                // Less than 1 minute ago
                throw createError.BadRequest('Password reset already requested recently');
            }
    
            // Generate a reset token
            const resetToken = crypto.randomBytes(20).toString('hex');
    
            // Store the reset token and its expiration time in the user record
            user.resetPasswordToken = resetToken;
            user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
            user.resetPasswordRequestedAt = Date.now();
            await user.save();
    
            // Send the reset link to the user's email
            const resetLink = `http://your-app.com/reset-password/${resetToken}`;
            // Use your email service to send the link to the user
            // You might use a library like Nodemailer for this
    
            res.status(200).json({ success: true, message: 'Reset link sent successfully' });
        } catch (error) {
            next(error);
        }
    },
    
    resetPassword: async (req, res, next) => {
        try {
            const { token } = req.params;
            const { password } = req.body;
    
            // Find the user with the given reset token
            const user = await User.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() }, // Check if the token is still valid
            });
    
            if (!user) {
                throw createError.BadRequest('Invalid or expired reset token');
            }
    
            // Validate the password (you can customize this according to your requirements)
            if (password.length < 6) {
                throw createError.BadRequest('Password must be at least 6 characters');
            }
    
            // Update the user's password
            user.password = password;
            // Clear the reset token and its expiration time
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            user.resetPasswordRequestedAt = undefined;
            await user.save();
    
            // Send a response to the client
            res.status(200).json({ success: true, message: 'Password reset successfully' });
        } catch (error) {
            next(error);
        }
    }
}



