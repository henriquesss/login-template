const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
let bcrypt = require('bcrypt');
const saltRounds = 10;

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: Number, default: 0 },
},
  { timestamps: true });

UserSchema.plugin(uniqueValidator);

UserSchema.pre('save', async function (next) {
  const document = this;
  if (this.isNew) {
    let hashedPassword = bcrypt.hashSync(document.password, saltRounds)
    document.password = hashedPassword;

    let name = document.name.toLowerCase().replace(/(?:^|\s)\S/g, function (_capitalize) { return _capitalize.toUpperCase(); });

    var PreposM = ["Da", "Do", "Das", "Dos", "A", "E"];
    var prepos = ["da", "do", "das", "dos", "a", "e"];

    for (var i = PreposM.length - 1; i >= 0; i--) {
      name = name.replace(RegExp("\\b" + PreposM[i].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "\\b", "g"), prepos[i]);
    }
    document.name = name;
  } else if (this.isModified('password')) {
    let hashedPassword = bcrypt.hashSync(document.password, saltRounds)
    document.password = hashedPassword;
  } else if (this.isModified('name')) {
    let name = document.name.toLowerCase().replace(/(?:^|\s)\S/g, function (_capitalize) { return _capitalize.toUpperCase(); });

    var PreposM = ["Da", "Do", "Das", "Dos", "A", "E"];
    var prepos = ["da", "do", "das", "dos", "a", "e"];

    for (var i = PreposM.length - 1; i >= 0; i--) {
      name = name.replace(RegExp("\\b" + PreposM[i].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + "\\b", "g"), prepos[i]);
    }
    document.name = name;
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);