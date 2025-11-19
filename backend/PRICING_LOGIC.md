# Dynamic Pricing Logic

## Overview
The system implements hour-based dynamic pricing with peak and off-peak rates.

## Peak Hours Definition
- **Morning Peak:** 10:00 AM - 1:00 PM
- **Evening Peak:** 4:00 PM - 7:00 PM
- **Days:** Monday - Friday only
- **Multiplier:** 1.5× base rate

## Pricing Algorithm

### Step 1: Split into Hourly Slots
The booking duration is divided into hourly slots starting from the start time.

Example: `10:30 AM - 1:30 PM` becomes:
- Slot 1: 10:30 AM - 11:30 AM
- Slot 2: 11:30 AM - 12:30 PM
- Slot 3: 12:30 PM - 1:30 PM

### Step 2: Determine Peak/Off-Peak
For each slot, check:
1. Is it a weekday (Mon-Fri)?
2. Does the hour fall in peak ranges?

### Step 3: Calculate Price
```
slotPrice = baseRate × duration × multiplier
where multiplier = 1.5 (peak) or 1.0 (off-peak)
```

### Step 4: Sum Total
```
totalPrice = sum of all slot prices
```

## Examples

### Example 1: Pure Off-Peak
- **Time:** Saturday 2:00 PM - 4:00 PM
- **Base Rate:** ₹500/hour
- **Calculation:** 2 hours × ₹500 = ₹1,000

### Example 2: Pure Peak
- **Time:** Monday 10:00 AM - 12:00 PM
- **Base Rate:** ₹500/hour
- **Calculation:** 2 hours × ₹750 = ₹1,500

### Example 3: Mixed
- **Time:** Monday 12:00 PM - 2:00 PM
- **Base Rate:** ₹500/hour
- **Breakdown:**
  - 12:00 PM - 1:00 PM: Peak (₹750)
  - 1:00 PM - 2:00 PM: Off-peak (₹500)
- **Total:** ₹1,250

## Conflict Detection

Bookings overlap if:
```
newStart < existingEnd AND newEnd > existingStart
```

**Edge Case:** If one booking ends exactly when another starts (e.g., ends at 11:00 AM, next starts at 11:00 AM), this is NOT a conflict.

## Validation Rules

1. **Time Constraints:**
   - Start time must be in the future
   - Start time < End time
   - Maximum duration: 12 hours

2. **Cancellation Policy:**
   - Must cancel at least 2 hours before start time
   - Cannot cancel bookings that have started or passed
   - Cannot cancel already cancelled bookings

## Timezone
All times are handled in **Asia/Kolkata (IST)** timezone.