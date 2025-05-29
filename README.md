# PowerGym - Fitness Club Website

A modern web application for a fitness club built with Laravel and React, featuring a comprehensive subscription and membership management system.

## Features

### Home Page
- Dynamic content based on user authentication and subscription status
- Interactive gallery and program showcases
- Testimonials from gym members
- Membership plans display

### Subscription System
- Multiple subscription tiers (Basic, Premium, Elite)
- Flexible billing periods (Monthly, Quarterly, Yearly)
- Promo code support with discounts
- Subscription management for users

### Advanced Subscription Management
- Prevents users from having multiple active subscriptions
- Supports subscription upgrades with prorated pricing
- Tracks subscription status and remaining days
- Progress visualization for subscription duration

### Payment Processing
- Secure checkout flow
- Multiple payment method support (Credit Card, PayPal, Bank Transfer)
- Order summary with discount application
- Success and failure handling

## Subscription Flow

1. **Plan Selection**:
   - Users browse available plans on the pricing page
   - Can view different tiers and billing periods
   - Compare features across plans

2. **Order Summary**:
   - After selecting a plan, users see detailed order information
   - Can apply promo codes for discounts
   - Displays original price, discount amount, and final price

3. **Payment Processing**:
   - Secure payment information entry
   - Multiple payment methods available
   - Order details displayed during checkout

4. **Subscription Activation**:
   - Subscription becomes active after successful payment
   - User is redirected to the subscription management page
   - Email confirmation is sent

5. **Subscription Management**:
   - Users can view their active subscriptions
   - Check remaining time and progress
   - Upgrade to higher tiers when eligible
   - Cancel subscriptions if needed

## Upgrade Flow

1. **Upgrade Eligibility**:
   - Only users with active subscriptions can upgrade
   - Only allows upgrading to higher tiers (e.g., Basic → Premium)

2. **Prorated Pricing**:
   - Calculates upgrade cost based on remaining time in current subscription
   - Credit for unused portion of current subscription
   - Transparent pricing breakdown

3. **Payment and Activation**:
   - Collect payment for the upgrade difference
   - Previous subscription is marked as upgraded
   - New subscription begins immediately

## Technical Implementation

- Laravel backend with Inertia.js + React frontend
- Database structure optimized for subscription tracking
- Controllers handle business logic for subscriptions and payments
- React components for interactive user experience
- Responsive design for mobile and desktop

## Setup Instructions

1. Clone the repository
2. Run `composer install` to install PHP dependencies
3. Run `npm install` to install JavaScript dependencies
4. Copy `.env.example` to `.env` and configure your database
5. Run `php artisan migrate` to set up the database tables
6. Run `npm run dev` to compile assets
7. Run `php artisan serve` to start the development server

## License

This project is licensed under the MIT License.
