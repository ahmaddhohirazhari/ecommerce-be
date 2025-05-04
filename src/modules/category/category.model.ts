import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';

class Category extends Model {}

Category.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: 'categories',
    paranoid: true,
  }
);

export default Category;
