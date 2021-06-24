module.exports = (sequelize, DataTypes) => {
    return sequelize.define('users', {
      user_key:{
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true
      },
      name:{
        type: DataTypes.STRING(45),
        allowNull: true,
        unique: false,
        defaultValue: null
      },
      email:{
        type: DataTypes.STRING(45),
        allowNull: true,
        unique: false,
        defaultValue: null
      },
      telephone_num: {
        type: DataTypes.STRING(45),
        allowNull: true,
        unique: false,
        defaultValue: null
      },
      coin: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: false,
        defaultValue: 0
      },
      sns_token:{
        type: DataTypes.STRING(5000),
        allowNull: true,
        unique: false,
        defaultValue: 0
      },
      waiting_charger:{
        type: DataTypes.INTEGER,
        allowNull: false,
        unique:false,
        defaultValue: 0
      },
    },{
      timestamps: false
    });
  };