# Nexus Global Logistics: Technical Specification

## 1. Advanced Site Architecture & UI/UX
- **Structure**:
    - **Home**: Immersive brand story and prime services.
    - **Tracking Portal**: Real-time progress stepper for live shipment status.
    - **Client Dashboard**: Administrative control panel with fleet health metrics.
    - **Services**: Detailed breakdown of logistical verticals (Air, Sea, Warehousing).
    - **Contact/Quote**: Integrated lead capture with built-in Rate Calculator.
- **Aesthetic**:
    - **Minimalist Dark Mode**: #050505 Background with high-contrast typography.
    - **Typography**: Inter (Sans) paired with Italic Serif accents for an established yet technical feel.
    - **GSAP/Framer Motion**: staggered entrances and fluid transitions for "freight movement" feel.

## 2. Database Schema (Supabase/SQL)
```sql
-- Shipments Table
CREATE TABLE shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tracking_id TEXT UNIQUE NOT NULL,
  sender_details JSONB NOT NULL, -- {name, address, contact}
  receiver_details JSONB NOT NULL,
  current_status shipment_status_enum DEFAULT 'PICKUP_PENDING',
  estimated_delivery TIMESTAMP WITH TIME ZONE,
  location_history JSONB DEFAULT '[]', -- Array of {timestamp, location, status}
  weight_kg DECIMAL NOT NULL,
  dimensions_cm JSONB NOT NULL, -- {l, w, h}
  ai_meta JSONB DEFAULT '{}', -- Predictive ETA, Eco-scores
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quotes Table
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  email TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  estimated_cost DECIMAL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 3. Business Logic & API Integration
- **Rate Calculator**:
    - `Volumetric Weight = (L * W * H) / 5000`
    - `Chargeable Weight = Max(Actual Weight, Volumetric Weight)`
    - `Total Cost = Chargeable Weight * Rate * Distance_Factor`
- **Essential APIs**:
    - **Google Maps**: Specialized for distance matrix and geodesic routing.
    - **Stripe**: Global payment rails for instant shipping authorization.
    - **Shippo/EasyPost**: Electronic Data Interchange (EDI) for label generation and carrier webhooks.

## 4. Logistics Intelligence (High-End Factor)
- **Predictive ETA**: Utilizing historical port congestion data and AIS (Automatic Identification System) for vessels to adjust delivery windows dynamically.
- **Dynamic Green Routing**: Real-time suggestions for routes with the lowest CO2 footprint, highlighting "Eco-friendly" lanes in the tracking UI.
- **Automated DocGen**: Instant generation of Commercial Invoices and Packing Slips using AI to parse SKU descriptions into harmonized (HS) codes for customs.
