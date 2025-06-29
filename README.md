# 🌍 Xplorer

**Your AI-powered travel companion** — plan, chat, and book trips seamlessly with real-time collaboration and smart automation.  
Xplorer is a full-stack travel platform built using modern web technologies, offering both clients and admins a rich, interactive experience.

---

## 🚀 Features

- 🧠 **AI Trip Planner**  
  Generate personalized travel itineraries using **Gemini AI**, tailored to your preferences, budget, and duration.

- 🧠 **AI Destination Suggestion**  
  Generate mood based destination suggestion using **Gemini AI**, based on your mood of travel

- 💬 **Real-time Group Chat**  
  Coordinate with fellow travelers using **WebSocket-based group chat** — view messages instantly and track the latest conversations.

- 🔐 **Secure Authentication**  
  Robust login system powered by **Firebase Authentication**, with role-based access for clients and admins.

- 💳 **Stripe Payments**  
  Seamless integration with **Stripe Checkout** to book trips and purchase credits. Backend securely verifies `payment_intent` and updates bookings or credits.

- 🧳 **Trip Management System**  
  - Admins can create, update, and monitor trip packages.
  - Clients can browse curated trips, view details, and initiate bookings.

- 🌐 **Search & Explore Destinations**  
  Search any city or country and explore available trips, hotels, and flights in an intuitive UI.

- 📊 **Client & Admin Dashboards**  
  - **Client Dashboard**: View upcoming trips, bookings, and credit balance.  
  - **Admin Dashboard**: Monitor users, trips, transactions, and platform activity.

- 📦 **Modular Booking System**  
  Bookings support:
  - 🏨 Hotels  
  - ✈️ Flights  
  - 🌄 Tour Packages  
  with time/date validation and availability tracking.



---

## 🛠️ Tech Stack

- **Frontend**: [Next.js 14](https://nextjs.org) (App Router) + TypeScript + TailwindCSS
- **Backend**: [Express.js](https://expressjs.com) (TypeScript)
- **Database**: [MongoDB](https://www.mongodb.com)
- **Authentication**: [Firebase Authentication](https://firebase.google.com)
- **Payments**: [Stripe](https://stripe.com)
- **Real-time**: [Socket.io](https://socket.io) (for group chat)
- **AI**: [Gemini API](https://ai.google.dev/gemini) (for itinerary generation)

---


