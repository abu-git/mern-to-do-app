const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  description:{
    type: String,
    required: 'This field is required'
  },
  done:{
    type: Boolean,
    default: false
  },
  owner:{
    type: String
  },
  deadline:{
    type: Date,
    required: 'This field is required'
  }
},{
  timestamps: true
});


module.exports = mongoose.model('Task', taskSchema);
