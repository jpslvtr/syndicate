# Syndicate

A private newsletter platform for sharing meaningful updates with your own circles.

## Features

- Private newsletter creation and management
- Group-based subscriber and follower management
- Google and email/password authentication
- Rich text editor with email delivery
- Profile customization

## Tech stack

- React + Vite
- Firebase Auth & Firestore
- Cloud Functions (Nodemailer) for email delivery
- Tailwind CSS + Material Tailwind

## Local setup

```bash
git clone https://github.com/jpslvtr/syndicate.git
cd syndicate
npm install
cp .env.example .env   # fill in your Firebase web config
npm run dev
```

For email delivery, copy `functions/.env.example` to `functions/.env` and add a
Gmail account plus an app password.

## Screenshots

![Syndicate](/public/img/readme/1.jpg "Syndicate")

![Syndicate](/public/img/readme/4.jpg "Syndicate")
