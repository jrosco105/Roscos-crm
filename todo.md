# Rosco's Moving CRM - Project TODO

## Phase 1: Database Schema & Architecture
- [x] Design and implement database schema (users, leads, jobs, quotes, invoices, crew, vehicles)
- [x] Create data models for move details, inventory, pricing rules
- [x] Set up relationships between leads, jobs, and invoices

## Phase 2: Core Backend - Quote Calculator & Lead Management
- [x] Implement quote calculator procedure with distance-based pricing
- [x] Build inventory form data structure and estimation logic
- [x] Create lead management procedures (create, list, update status)
- [x] Implement lead-to-job conversion workflow
- [x] Add quote history tracking

## Phase 3: Job Scheduling & Admin Dashboard
- [x] Build job scheduling system with calendar view
- [x] Implement crew and vehicle assignment logic
- [x] Create admin dashboard with key metrics (pending quotes, scheduled jobs, revenue, crew utilization)
- [ ] Build crew management interface (availability, assignments)
- [ ] Build vehicle management interface (availability, assignments)

## Phase 4: Quote Form UI & Website Integration
- [x] Build multi-step quote form with room-by-room inventory
- [x] Create room inventory dropdowns (living room, bedroom, kitchen, bathroom, dining, office, garage, storage)
- [x] Add appliance selection options (washer, dryer, refrigerator, stove, dishwasher, etc.)
- [x] Add special items (stairs, elevator, piano, pool table, etc.)
- [x] Implement instant quote calculation display
- [x] Build email notification system to contact@roscosmoving.com
- [x] Add SMS notification option for customers
- [x] Integrate quote form into website homepage
- [x] Test end-to-end quote submission and notifications

## Phase 5: Digital BOL & Invoicing
- [ ] Implement digital Bill of Lading form with e-signature
- [ ] Create invoice generation system
- [ ] Build payment tracking interface
- [ ] Integrate PayPal for deposits and final payments
- [ ] Add invoice history and status tracking

## Phase 5: SMS Notifications
- [x] Set up email notification system (quote confirmations, job reminders, follow-ups)
- [x] Implement SMS notification system for customer alerts
- [x] Add SMS configuration to Settings page
- [x] Send SMS on quote submission
- [x] Send SMS when admin responds to quote

## Phase 6: Route Optimization & Mobile Interface
- [ ] Implement route optimization between job locations
- [ ] Build mobile crew interface with turn-by-turn directions
- [ ] Add real-time crew location tracking
- [ ] Implement job status updates from mobile

## Phase 7: Testing & Deployment
- [ ] Write comprehensive vitest tests for all procedures
- [ ] Test payment integration and notifications
- [ ] Performance optimization
- [ ] Final deployment and monitoring setup
