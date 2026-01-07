# Workout Tracker

A full-stack web application for tracking and analyzing fitness workouts. Built as a personal project to showcase modern web development practices.

## Overview

Workout Tracker is a comprehensive fitness application that allows users to log workouts, track progress over time, and analyze performance through data visualization. The application supports both strength training and cardio exercises, with features for creating reusable workout templates and filtering historical data.

## Features

- **Workout Management**: Create and log workouts with detailed exercise information (sets, reps, weights, duration, distance)
- **Workout Templates**: Save and reuse favorite workout routines
- **Progress Analytics**: Visualize workout frequency, exercise progression, muscle group distribution, and workout duration trends
- **Advanced Filtering**: Filter workouts by exercise type, muscle group, weight type, and date ranges
- **Exercise Search**: Search workout history to quickly reference previous performance
- **Measurement Systems**: Support for both metric and imperial units with automatic conversion
- **Responsive Design**: Mobile-first design that works seamlessly across all devices
- **User Authentication**: Secure JWT-based authentication with password reset functionality

## Tech Stack

### Frontend

- **Next.js 14** (App Router) - React framework with server-side rendering
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Redux Toolkit** - State management
- **shadcn/ui + Radix UI** - Accessible component library
- **Recharts** - Data visualization and charts

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **MongoDB + Mongoose** - Database and ODM
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

### Development Tools

- **ESLint + Prettier** - Code quality and formatting
- **TypeScript** - Static type checking

## Key Implementation Highlights

- **Type-safe API routes** with Zod validation schemas
- **Server and client component architecture** following Next.js best practices
- **Optimistic UI updates** with Redux state management
- **Responsive mobile navigation** with adaptive UI components
- **Real-time form validation** and error handling
- **Efficient data fetching** with proper caching strategies

## Project Structure

```
src/
├── app/                 # Next.js App Router pages and API routes
├── components/          # React components and UI elements
├── lib/                 # Utility functions and helpers
├── models/              # MongoDB/Mongoose schemas
├── store/               # Redux slices and store configuration
├── types/               # TypeScript type definitions
└── middleware/          # Authentication and route protection
```

## Development

Built with modern development practices including:

- Strict TypeScript configuration
- Comprehensive error handling
- Accessible UI components
- Mobile-responsive design patterns
- Clean separation of concerns

---

_MVP Portfolio project showcasing full-stack web development skills._
