import user from '../models/user.model.js'
import  generateTokenAndSetCookie  from '../lib/utils/generateTokens.js'
import bcrypt from 'bcryptjs'

export const signup = async(req, res) => {
  try{
    const {username, password, email, fullname} = req.body

    const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if(!emailregex.test(email)){
      return res.status(400).json({message: 'Invalid Email'})
    }

    const existingUser = await user.findOne({username})
    if(existingUser){
      return res.status(400).json({message: 'User already exists'})
    }
    const existingEmail = await user.findOne({email})
    if(existingEmail){
      return res.status(400).json({message: 'Email already exists'})
    }
    if(password.length < 6){
      return res.status(400).json({message: 'Password must be at least 6 characters'})
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)


    const newUser = new user({
      fullname, 
      username,
      email,
      password: hashedPassword
    })

    if(newUser){
      generateTokenAndSetCookie(newUser._id, res)
      await newUser.save()
      const {password, ...others} = newUser._doc
      res.status(201).json(others)
    }else{
      res.status(400).json({message: 'Invalid user data'})
    }

}
 catch(error) {
  console.log(error)
  res.status(500).json({message: 'Server Error'})
} }




export const login = async(req, res) => {
  res.json({
    message: 'Login success'
  })
}

export const logout = async(req, res) => {
  res.json({
    message: 'Logout success'
  })
}