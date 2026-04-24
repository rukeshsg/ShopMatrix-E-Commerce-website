import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import Cart from './models/Cart.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const productsData = [
  // Electronics
  { name: 'Apple iPhone 15 Pro Max', category: 'Electronics', brand: 'Apple', price: 159900, description: 'Forged in titanium and featuring the groundbreaking A17 Pro chip.', images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800'] },
  { name: 'Sony WH-1000XM5 Headphones', category: 'Electronics', brand: 'Sony', price: 29990, description: 'Industry-leading noise cancellation and high-res audio.', images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800'] },
  { name: 'Dell XPS 13 Laptop', category: 'Electronics', brand: 'Dell', price: 144990, description: 'Stunning InfinityEdge display and ultra-thin design.', images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=800'] },
  { name: 'Logitech MX Master 3S', category: 'Electronics', brand: 'Logitech', price: 10995, description: 'Quiet clicks and an 8,000 DPI track-on-glass sensor.', images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=800'] },
  { name: 'EvoFox Pro Wired Gamepad', category: 'Electronics', brand: 'EvoFox', price: 1499, description: 'Ergonomic wired gamepad with dual vibration, 2m cable, compatible with PC & Android.', images: ['https://images.unsplash.com/photo-1592840496694-26d035b52b48?q=80&w=800'] },

  // Fashion
  { name: 'Classic Leather Moto Jacket', category: 'Fashion', brand: "Levi's", price: 8999, description: 'Timeless asymmetrical zip and genuine leather.', images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800'] },
  { name: 'Nike Air Max Running Shoes', category: 'Fashion', brand: 'Nike', price: 8995, description: 'Lightweight and breathable running shoes with Air Max cushioning.', images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800'] },
  { name: "Levi's 511 Slim Fit Jeans", category: 'Fashion', brand: "Levi's", price: 3499, description: 'Classic slim fit jeans in stretch denim.', images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800'] },
  { name: 'Casual Cotton Unisex T-Shirt', category: 'Fashion', brand: 'H&M', price: 899, description: '100% organic cotton crew-neck tee.', images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800'] },
  { name: 'Analog Wrist Watch – Leather Strap', category: 'Fashion', brand: 'Fossil', price: 8499, description: 'Classic stainless steel case with genuine leather strap.', images: ['/products/smart-ring.png'] },

  // Home & Garden
  { name: 'Mid-Century Modern Lounge Chair', category: 'Home & Garden', brand: 'Herman Miller', price: 45000, description: 'Iconic design with premium walnut and leather.', images: ['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=800'] },
  { name: 'Ceramic Non-Stick Pan Set', category: 'Home & Garden', brand: 'Caraway', price: 18500, description: 'Eco-friendly and beautifully designed cookware.', images: ['/products/nonstick-pan-set.png'] },
  { name: 'Ultrasonic Essential Oil Diffuser', category: 'Home & Garden', brand: 'Muji', price: 4500, description: 'Minimalist design with subtle ambient light.', images: ['/products/oil-diffuser-glow.png'] },
  { name: 'Indoor Ficus Lyrata (Fiddle Leaf)', category: 'Home & Garden', brand: 'Bloomscape', price: 3200, description: 'A gorgeous, live statement plant for any room.', images: ['/products/ficus-plant.png'] },
  { name: 'Luxury Cotton Percale Sheets', category: 'Home & Garden', brand: 'Brooklinen', price: 11500, description: 'Crisp, cool, and ultra-breathable bedding.', images: ['/products/percale-sheets.png'] },
  { name: 'Wooden Study Table', category: 'Home & Garden', brand: 'Wakefit', price: 7499, description: 'Sturdy engineered wood study table with storage drawer.', images: ['https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=800'] },

  // Sports/Fitness
  { name: 'Adjustable Dumbbell Set 10kg', category: 'Sports/Fitness', brand: 'Kore', price: 2499, description: 'Cast iron adjustable dumbbells with chrome handle.', images: ['/products/dumbbells.webp'] },
  { name: 'Resistance Bands Kit (Set of 5)', category: 'Sports/Fitness', brand: 'Fit Simplify', price: 899, description: '5 resistance levels for stretching and strength training.', images: ['/products/resistance-bands.png'] },
  { name: 'Protein Shaker Bottle 700ml', category: 'Sports/Fitness', brand: 'MuscleBlaze', price: 399, description: 'Leak-proof BPA-free shaker with blending ball.', images: ['/products/protein-shaker.png'] },
  { name: 'Pull-Up Bar for Home Workout', category: 'Sports/Fitness', brand: 'Aurion', price: 1599, description: 'Doorframe pull-up bar, multi-grip positions.', images: ['/products/pullup-bar.png'] },
  { name: 'Carbon Fiber Tennis Racquet', category: 'Sports/Fitness', brand: 'Wilson', price: 18500, description: 'Professional grade control and power.', images: ['/products/tennis-racquet.png'] },
  { name: 'Smart Fitness Tracker Ring', category: 'Sports/Fitness', brand: 'Oura', price: 29990, description: 'Advanced sleep and activity tracking in titanium.', images: ['/products/smart-ring.png'] },

  // Beauty
  { name: 'Volumizing Mascara', category: 'Beauty', brand: 'Too Faced', price: 2300, description: 'Intense black, thickening, and lengthening.', images: ['/products/mascara-catrice.png'] },
  { name: 'Advanced Night Repair Serum', category: 'Beauty', brand: 'Estée Lauder', price: 9500, description: 'Reduces multiple signs of aging.', images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800'] },

  // Books/Comics
  { name: 'Atomic Habits – James Clear', category: 'Books/Comics', brand: 'Penguin', price: 399, description: 'A practical guide to building good habits.', images: ['/products/atomic-habits.png'] },
  { name: 'Rich Dad Poor Dad – Robert Kiyosaki', category: 'Books/Comics', brand: 'Plata', price: 299, description: 'Transform how you think about money.', images: ['/products/rich-dad-poor-dad.png'] },
  { name: 'The Psychology of Money – Morgan Housel', category: 'Books/Comics', brand: 'Jaico', price: 349, description: 'Timeless lessons on wealth and happiness.', images: ['https://images.unsplash.com/photo-1579621970795-87facc2f976d?q=80&w=800'] },
  { name: 'Ikigai – Hector Garcia & Francesc Miralles', category: 'Books/Comics', brand: 'Penguin', price: 279, description: 'The Japanese secret to a long and happy life.', images: ['/products/ikigai.png'] },
  { name: 'The Alchemist – Paulo Coelho', category: 'Books/Comics', brand: 'HarperCollins', price: 249, description: 'Philosophical novel about following dreams.', images: ['/products/alchemist.png'] },
  { name: 'Invincible Vol. 1: Family Matters', category: 'Books/Comics', brand: 'Image Comics', price: 899, description: 'A fresh take on superheroes.', images: ['/products/invincible-vol1.jpg'] },
  { name: 'Invincible Vol. 2: Eight Is Enough', category: 'Books/Comics', brand: 'Image Comics', price: 949, description: 'Action-packed with jaw-dropping twists.', images: ['/products/invincible-vol2.jpg'] },
];

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('password123', salt);
    const guestPassword = await bcrypt.hash('password123', salt);

    const createdUsers = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: adminPassword,
        role: 'admin',
        isVerified: true,
      },
      {
        name: 'Guest User',
        email: 'guest@example.com',
        password: guestPassword,
        role: 'user',
        isVerified: true,
      },
    ]);

    const adminUser = createdUsers[0]._id;
    const sampleProducts = productsData.map(p => ({
      ...p,
      countInStock: Math.floor(Math.random() * 50) + 10,
      rating: parseFloat((Math.random() * 1 + 4).toFixed(1)),
      numReviews: Math.floor(Math.random() * 500) + 50,
      user: adminUser,
      isDeleted: false
    }));

    await Product.insertMany(sampleProducts);

    console.log('Database successfully seeded with clean production-ready data!');
    process.exit();
  } catch (error) {
    console.error(`Error during seeding: ${error.message}`);
    process.exit(1);
  }
};

importData();
