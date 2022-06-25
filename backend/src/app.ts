import express from 'express';
import 'dotenv/config';
import './config/database';
import morgan from 'morgan';
import { errorMiddleware } from './middlewares/error.middleware';
import { notFoundMiddleware } from './middlewares/notfound.middleware';
import UserRoute from './routes/user.route';
import AuthRoute from './routes/auth.route';
import CategoryRoute from './routes/category.route';
import SubCategoryRoute from './routes/sub.category.route';
import BrandRoute from './routes/brand.route';
import expressUpload from 'express-fileupload';
import ProductRoute from './routes/product.route';
import RatingRoute from './routes/rating.route';

const app = express();
const PORT: number = parseInt(process.env.PORT || '3000');
const userRoutes = new UserRoute();
const authRoutes = new AuthRoute();
const categoryRoutes = new CategoryRoute();
const subCategoryRoutes = new SubCategoryRoute();
const brandRoutes = new BrandRoute();
const productRoutes = new ProductRoute();
const ratingRoutes = new RatingRoute();
app.use(morgan('combined'));
app.use(expressUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  '/api/user',
  userRoutes.router,
  authRoutes.router,
  categoryRoutes.router,
  subCategoryRoutes.router,
  brandRoutes.router,
  productRoutes.router,
  ratingRoutes.router,
);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server on the running PORT http://localhost:${PORT}`);
});
