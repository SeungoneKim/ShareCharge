module.exports = (sequelize, DataTypes) => {
    return sequelize.define('chargers', {
      charger_key:{
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true
      },
      price_per_hour:{
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: false,
      },
      available_time_left:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        unique: false,
        defaultValue: 1
      },
      x: {
        type: DataTypes.STRING(45),
        allowNull: true,
        unique: false,
        defaultValue: null
      },
      y: {
        type: DataTypes.STRING(45),
        allowNull: true,
        unique: false,
        defaultValue: null
      },
      address_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: false,
        defaultValue: null
      },
      region_1depth_name: {
        type: DataTypes.STRING(45),
        allowNull: true,
        unique: false,
        defaultValue: null
      },
      region_2depth_name: {
        type: DataTypes.STRING(45),
        allowNull: true,
        unique: false,
        defaultValue: null
      },
      region_3depth_name: {
        type: DataTypes.STRING(45),
        allowNull: true,
        unique: false,
        defaultValue: null
      },
      image_src: {
        type: DataTypes.STRING(45),
        allowNull: true,
        unique: false,
        defaultValue: null
      },
      email: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: false,
      },
      owner_name: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: false,
      },
      reservation_key: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: false,
        defaultValue: null
      },
    },{
      timestamps: false
    });
  };