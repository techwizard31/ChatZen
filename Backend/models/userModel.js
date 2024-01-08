const mongoose = require("mongoose");
const bcrypt = require("bcrypt")

const userSchema = mongoose.Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true,unique:true },
    password: { type: String, require: true },
    pic: {
      type: String,
      default:
        "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg",
    },
   
  },
  {timestamp: true,}
);

userSchema.methods.matchPassword = async function (enteredPassword){
  return await bcrypt.compare(enteredPassword,this.password)
}

userSchema.pre('save',async function (next){
  if(!this.isModified){
     next();
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(this.password,salt)
  this.password=hash;
})

const User = mongoose.model("User",userSchema)

module.exports = User;
