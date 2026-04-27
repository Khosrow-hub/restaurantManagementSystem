const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "demo_secret_change_me";
const JWT_EXPIRE = process.env.JWT_EXPIRE || "7d";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const makeId = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

const users = [];
const carts = new Map();
const orders = [];

const restaurants = [
  {
    _id: "rest1",
    name: "Demo Biryani House",
    address: "City Center",
    ratings: 4.6,
    numOfReviews: 128,
    isVeg: false,
    images: [{ public_id: "r1", url: "https://picsum.photos/400/250?random=1" }],
  },
  {
    _id: "rest2",
    name: "Green Bowl",
    address: "North Avenue",
    ratings: 4.3,
    numOfReviews: 72,
    isVeg: true,
    images: [{ public_id: "r2", url: "https://picsum.photos/400/250?random=2" }],
  },
];

const foodItems = [
  {
    _id: "f1",
    name: "Chicken Biryani",
    price: 280,
    description: "Aromatic basmati rice with chicken.",
    stock: 20,
    restaurant: "rest1",
    images: [{ public_id: "f1", url: "https://picsum.photos/200/140?random=3" }],
  },
  {
    _id: "f2",
    name: "Paneer Tikka",
    price: 220,
    description: "Grilled paneer with spices.",
    stock: 16,
    restaurant: "rest1",
    images: [{ public_id: "f2", url: "https://picsum.photos/200/140?random=4" }],
  },
  {
    _id: "f3",
    name: "Veg Burger",
    price: 160,
    description: "Veg patty burger.",
    stock: 30,
    restaurant: "rest2",
    images: [{ public_id: "f3", url: "https://picsum.photos/200/140?random=5" }],
  },
];

const menusByRestaurant = {
  rest1: [{ _id: "m1", category: "Main Course", items: ["f1", "f2"] }],
  rest2: [{ _id: "m2", category: "Snacks", items: ["f3"] }],
};

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phoneNumber: user.phoneNumber,
  role: user.role,
  avatar: user.avatar,
  createdAt: user.createdAt,
});

const signAndSendToken = (user, res) => {
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
  res.cookie("jwt", token, { httpOnly: true });
  return token;
};

const protect = (req, res, next) => {
  try {
    const bearer = req.headers.authorization?.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : null;
    const token = bearer || req.cookies.jwt;
    if (!token) return res.status(401).json({ message: "Please login first" });
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find((u) => u._id === decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only route" });
  }
  next();
};

router.post("/users/signup", async (req, res) => {
  const { name, email, password, passwordConfirm, phoneNumber, avatar } = req.body;
  if (!name || !email || !password || !passwordConfirm || !phoneNumber) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }
  if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
  if (password !== passwordConfirm) return res.status(400).json({ message: "Passwords are not same" });
  if (!/^[0-9]{10}$/.test(String(phoneNumber))) return res.status(400).json({ message: "Enter valid phone number" });
  if (users.some((u) => u.email.toLowerCase() === String(email).toLowerCase())) {
    return res.status(400).json({ message: "Duplicate email entered" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = {
    _id: makeId(),
    name,
    email: String(email).toLowerCase(),
    password: hashed,
    phoneNumber: String(phoneNumber),
    role: "user",
    avatar: avatar ? { public_id: "demo", url: avatar } : { public_id: "default", url: "/images/images.png" },
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  const token = signAndSendToken(user, res);
  return res.status(200).json({ success: true, token, data: { user: sanitizeUser(user) } });
});

router.post("/users/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === String(email).toLowerCase());
  if (!user) return res.status(401).json({ message: "Invalid Email or Password" });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: "Invalid Email or Password" });
  const token = signAndSendToken(user, res);
  return res.status(200).json({ success: true, token, data: { user: sanitizeUser(user) } });
});

router.get("/users/me", protect, (req, res) => {
  res.status(200).json({ success: true, user: sanitizeUser(req.user) });
});

router.get("/users/logout", (req, res) => {
  res.cookie("jwt", null, { expires: new Date(Date.now()), httpOnly: true });
  res.status(200).json({ success: true, message: "Logged out" });
});

router.get("/eats/stores", (req, res) => {
  const keyword = String(req.query.keyword || "").toLowerCase().trim();
  const filtered = keyword
    ? restaurants.filter((r) => r.name.toLowerCase().includes(keyword) || r.address.toLowerCase().includes(keyword))
    : restaurants;
  res.status(200).json({ restaurants: filtered, count: filtered.length });
});

router.post("/eats/stores", protect, adminOnly, (req, res) => {
  const rest = {
    _id: makeId(),
    name: req.body.name || "New Restaurant",
    address: req.body.address || "Unknown",
    ratings: 4,
    numOfReviews: 0,
    isVeg: !!req.body.isVeg,
    images: req.body.images || [{ public_id: "new", url: "https://picsum.photos/400/250?random=9" }],
  };
  restaurants.push(rest);
  menusByRestaurant[rest._id] = [{ _id: makeId(), category: "Default", items: [] }];
  res.status(201).json({ success: true, data: rest });
});

router.delete("/eats/stores/:storeId", protect, adminOnly, (req, res) => {
  const i = restaurants.findIndex((r) => r._id === req.params.storeId);
  if (i === -1) return res.status(404).json({ message: "Restaurant not found" });
  restaurants.splice(i, 1);
  delete menusByRestaurant[req.params.storeId];
  res.status(200).json({ success: true, message: "Restaurant deleted" });
});

router.get("/eats/stores/:storeId/menus", (req, res) => {
  const storeId = req.params.storeId;
  const menuDoc = {
    _id: `menu_doc_${storeId}`,
    restaurant: storeId,
    menu: (menusByRestaurant[storeId] || []).map((m) => ({
      _id: m._id,
      category: m.category,
      items: m.items.map((id) => foodItems.find((f) => f._id === id)).filter(Boolean),
    })),
  };
  res.status(200).json({ success: true, data: [menuDoc] });
});

router.get("/eats/items/:storeId", (req, res) => {
  const items = foodItems.filter((f) => f.restaurant === req.params.storeId);
  res.status(200).json({ success: true, data: items });
});

router.post("/eats/item", protect, adminOnly, (req, res) => {
  const item = {
    _id: makeId(),
    name: req.body.name,
    price: Number(req.body.price || 0),
    description: req.body.description || "",
    stock: Number(req.body.stock || 0),
    restaurant: req.body.restaurant,
    images: [{ public_id: "new-item", url: req.body.imageUrl || "https://picsum.photos/200/140?random=11" }],
  };
  foodItems.push(item);
  res.status(201).json({ success: true, data: item });
});

router.post("/eats/cart/add-to-cart", protect, (req, res) => {
  const { foodItemId, restaurantId, quantity = 1 } = req.body;
  const item = foodItems.find((f) => f._id === foodItemId);
  if (!item) return res.status(404).json({ message: "Food item not found" });
  let cart = carts.get(req.user._id) || { user: req.user._id, restaurant: restaurantId, items: [] };
  if (cart.restaurant !== restaurantId) cart = { user: req.user._id, restaurant: restaurantId, items: [] };
  const existing = cart.items.find((i) => i.foodItem === foodItemId);
  if (existing) existing.quantity += Number(quantity);
  else cart.items.push({ foodItem: foodItemId, quantity: Number(quantity) });
  carts.set(req.user._id, cart);
  return res.status(200).json({ message: "Cart updated", cart: formatCart(cart) });
});

router.post("/eats/cart/update-cart-item", protect, (req, res) => {
  const { foodItemId, quantity } = req.body;
  const cart = carts.get(req.user._id);
  if (!cart) return res.status(404).json({ message: "Cart not found" });
  const row = cart.items.find((i) => i.foodItem === foodItemId);
  if (!row) return res.status(404).json({ message: "Food item not found in cart" });
  row.quantity = Number(quantity);
  carts.set(req.user._id, cart);
  return res.status(200).json({ message: "Cart item quantity updated", cart: formatCart(cart) });
});

router.delete("/eats/cart/delete-cart-item", protect, (req, res) => {
  const { foodItemId } = req.body;
  const cart = carts.get(req.user._id);
  if (!cart) return res.status(404).json({ message: "Cart not found" });
  cart.items = cart.items.filter((i) => i.foodItem !== foodItemId);
  if (cart.items.length === 0) {
    carts.delete(req.user._id);
    return res.status(200).json({ message: "Cart deleted" });
  }
  carts.set(req.user._id, cart);
  return res.status(200).json({ message: "Cart item deleted", cart: formatCart(cart) });
});

router.get("/eats/cart/get-cart", protect, (req, res) => {
  const cart = carts.get(req.user._id);
  if (!cart) return res.status(404).json({ message: "No cart found" });
  return res.status(200).json({ status: "success", data: formatCart(cart) });
});

router.post("/payment/process", protect, (req, res) => {
  const sessionId = makeId();
  res.status(200).json({ url: `${FRONTEND_URL}/success?session_id=${sessionId}` });
});

router.post("/eats/orders/new", protect, (req, res) => {
  const cart = carts.get(req.user._id);
  if (!cart || cart.items.length === 0) return res.status(400).json({ message: "Cart is empty" });
  const orderItems = cart.items.map((i) => {
    const f = foodItems.find((x) => x._id === i.foodItem);
    return { _id: makeId(), name: f.name, quantity: i.quantity, image: f.images[0].url, price: f.price, fooditem: f._id };
  });
  const itemsPrice = orderItems.reduce((a, i) => a + i.price * i.quantity, 0);
  const deliveryCharge = 55;
  const order = {
    _id: makeId(),
    orderItems,
    deliveryInfo: {
      address: "Demo Address",
      city: "Demo City",
      phoneNo: req.user.phoneNumber,
      postalCode: "10000",
      country: "IN",
    },
    paymentInfo: { id: req.body.session_id || makeId(), status: "paid" },
    deliveryCharge,
    itemsPrice,
    finalTotal: itemsPrice + deliveryCharge,
    user: sanitizeUser(req.user),
    restaurant: restaurants.find((r) => r._id === cart.restaurant) || null,
    orderStatus: "Processing",
    paidAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  carts.delete(req.user._id);
  return res.status(200).json({ success: true, order });
});

router.get("/eats/orders/me/myOrders", protect, (req, res) => {
  const mine = orders.filter((o) => o.user._id === req.user._id);
  res.status(200).json({ success: true, orders: mine });
});

router.get("/eats/orders/:id", protect, (req, res) => {
  const order = orders.find((o) => o._id === req.params.id);
  if (!order) return res.status(404).json({ message: "No Order found with this ID" });
  res.status(200).json({ success: true, order });
});

function formatCart(cart) {
  return {
    user: cart.user,
    restaurant: restaurants.find((r) => r._id === cart.restaurant) || null,
    items: cart.items
      .map((i) => ({
        _id: makeId(),
        foodItem: foodItems.find((f) => f._id === i.foodItem),
        quantity: i.quantity,
      }))
      .filter((i) => i.foodItem),
  };
}

module.exports = router;
