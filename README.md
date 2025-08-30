# Filpmart Backend - E-commerce API

A comprehensive e-commerce backend system similar to Flipkart, built with Node.js, Express, and Supabase.

## 🚀 Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Customer, Vendor, Admin)
- Secure password hashing with bcrypt
- Protected routes with middleware

### Product Management
- Product catalog with categories and subcategories
- Advanced filtering and search capabilities
- Image management and specifications
- Stock management and inventory tracking
- Vendor product management

### Shopping Experience
- Shopping cart functionality
- Wishlist management
- Advanced product search and filtering
- Product reviews and ratings
- Order tracking and history

### Order Management
- Complete order processing workflow
- Multiple payment methods support
- Order status tracking
- Address management
- Order cancellation and refunds

### Admin Features
- Dashboard with analytics
- User management
- Product approval and management
- Order management
- Category management

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting
- **Testing**: Jest, Supertest

## 📋 Prerequisites

- Node.js (v18 or higher)
- Supabase account
- Git

## 🔧 Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd filpmart-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your Supabase credentials in the `.env` file

5. Run database migrations (handled automatically when connecting to Supabase)

6. Start the development server:
```bash
npm run dev
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - User logout

### Products
- `GET /api/products` - Get products with filtering
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (vendor/admin)
- `PUT /api/products/:id` - Update product (vendor/admin)
- `DELETE /api/products/:id` - Delete product (vendor/admin)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/hierarchy` - Get category hierarchy
- `POST /api/categories` - Create category (admin)
- `PUT /api/categories/:id` - Update category (admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove cart item
- `DELETE /api/cart` - Clear cart

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders/create` - Create order from cart
- `PATCH /api/orders/:id/cancel` - Cancel order

### Reviews
- `GET /api/reviews/product/:productId` - Get product reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/change-password` - Change password
- `GET /api/users/addresses` - Get addresses
- `POST /api/users/addresses` - Add address
- `PUT /api/users/addresses/:id` - Update address
- `DELETE /api/users/addresses/:id` - Delete address

### Admin
- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/users` - Get all users
- `PATCH /api/admin/users/:id/status` - Update user status
- `GET /api/admin/orders` - Get all orders
- `PATCH /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/products/stats` - Get product statistics

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- CORS configuration
- Input validation with Joi
- SQL injection protection
- XSS protection with Helmet

## 🗄️ Database Schema

The database includes the following tables:
- `users` - User accounts and profiles
- `categories` - Product categories with hierarchy
- `products` - Product catalog
- `addresses` - User delivery addresses
- `cart_items` - Shopping cart items
- `orders` - Order information
- `order_items` - Order line items
- `reviews` - Product reviews and ratings

## 🚀 Deployment

The application is configured for easy deployment to various platforms:

1. **Environment Setup**: Configure production environment variables
2. **Database**: Supabase handles database hosting and scaling
3. **Application**: Deploy to your preferred Node.js hosting platform

## 🧪 Testing

Run the test suite:
```bash
npm test
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if necessary
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please create an issue in the GitHub repository.