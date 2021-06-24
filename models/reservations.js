module.exports = (sequelize, DataTypes) => {
    return sequelize.define('reservations', {
      reservation_key:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      time_0: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: false,
        defaultValue: 1
      },
      time_1: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: false,
        defaultValue: 1
      },
      time_2: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: false,
        defaultValue: 1
      },
      time_3: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: false,
        defaultValue: 1
      },
      time_4: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: false,
        defaultValue: 1
      },
      time_5: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: false,
        defaultValue: 1
      },
      time_6: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: false,
        defaultValue: 1
      },
      time_7: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: false,
        defaultValue: 1
      },
      time_8: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: false,
        defaultValue: 1
      },
      time_9: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: false,
        defaultValue: 1
      },
      time_10: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: false,
        defaultValue: 1
      },
      time_11: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: false,
        defaultValue: 1
      },
      time_12: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: false,
        defaultValue: 1
      },
      time_13: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: false,
        defaultValue: 1
      },
      time_14: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: false,
        defaultValue: 1
      },
      time_15: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: false,
        defaultValue: 1
      },
      time_16: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: false,
        defaultValue: 1
      },
      time_17: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: false,
        defaultValue: 1
      },
      time_18: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: false,
        defaultValue: 1
      },
      time_19: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: false,
        defaultValue: 1
      },
      time_20: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: false,
        defaultValue: 1
      },
      time_21: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: false,
        defaultValue: 1
      },
      time_22: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: false,
        defaultValue: 1
      },
      time_23: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: false,
        defaultValue: 1
      },
    },{
      timestamps: false
    });
  };