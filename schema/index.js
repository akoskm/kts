import Sequelize from 'sequelize';

export default(db) => {

  let Token = db.define('token', {
    token_string: {
      type: Sequelize.TEXT,
      unique: true,
      primaryKey: true
    }
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true
  });

  let User = db.define('account', {
    id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: Sequelize.TEXT,
      unique: true
    },
    email: {
      type: Sequelize.TEXT,
      unique: true
    },
    password: {
      type: Sequelize.TEXT
    },
    status: {
      type: Sequelize.TEXT
    }
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true
  });

  User.hasMany(Token);
  Token.belongsTo(User, { foreignKey: 'account_id' });

  return {
    user: User,
    token: Token
  };
};
