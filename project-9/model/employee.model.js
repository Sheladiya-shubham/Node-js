const mongoose = require('mongoose');

const employeeSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true, // Ensure password is required
    },
    gender: {
      type: String,
      enum: ['Male', 'Female'],
      required: true,
    },
    profileImage: {
      type: String,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
