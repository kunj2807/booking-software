'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      // Define any associations if needed in the future
    }
  }

  Booking.init({
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerEmail: {
      type: DataTypes.STRING,
    },
    bookingDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    bookingType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bookingSlot: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bookingTime: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Assuming your users table is called 'Users'
        key: 'id',
      },
      onDelete: 'CASCADE', // Optional: this will delete bookings if the associated user is deleted
    }
  }, {
    sequelize,
    modelName: 'Booking',
  });

  return Booking;
};
