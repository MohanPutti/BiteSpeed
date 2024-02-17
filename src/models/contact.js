import { DataTypes } from 'sequelize';
import sequelize from '../../config/sequelize.js';

const Contact = sequelize.define('contact', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement:true
  },
  phoneNumber: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  linkedId: {
    type: DataTypes.INTEGER,
  },
  linkPrecedence: {
    type: DataTypes.STRING,
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
  deletedAt: {
    type: DataTypes.DATE,
  }
});

export default Contact;
