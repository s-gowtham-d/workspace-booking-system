import { pricingService } from '../services/pricingService';

/**
 * Test script to verify pricing logic
 * Run this to ensure dynamic pricing works correctly
 */
export const testPricingLogic = () => {
    console.log('\n🧪 Testing Dynamic Pricing Logic\n');
    console.log('═'.repeat(60));
    const baseRate = 500;

    // Test 1: Off-peak hours (Saturday)
    const offPeakStart = new Date('2025-11-22T08:00:00.000Z'); // Saturday 1:30 PM IST
    const offPeakEnd = new Date('2025-11-22T10:00:00.000Z');   // Saturday 3:30 PM IST
    const offPeakResult = pricingService.calculateBookingPrice(offPeakStart, offPeakEnd, baseRate);

    console.log('\n📊 Test 1: Off-Peak (Weekend)');
    console.log(`Time: ${offPeakStart.toISOString()} to ${offPeakEnd.toISOString()}`);
    console.log(`Expected: ${baseRate * 2} (2 hours × ₹${baseRate})`);
    console.log(`Actual: ₹${offPeakResult.totalPrice}`);
    console.log(`✓ ${offPeakResult.totalPrice === baseRate * 2 ? 'PASS' : 'FAIL'}`);

    // Test 2: Peak hours (Monday morning)
    const peakStart = new Date('2025-11-24T04:30:00.000Z');  // Monday 10:00 AM IST
    const peakEnd = new Date('2025-11-24T07:00:00.000Z');    // Monday 12:30 PM IST
    const peakResult = pricingService.calculateBookingPrice(peakStart, peakEnd, baseRate);

    console.log('\n📊 Test 2: Peak Hours (Monday Morning 10 AM - 12:30 PM)');
    console.log(`Time: ${peakStart.toISOString()} to ${peakEnd.toISOString()}`);
    console.log(`Expected: ~₹${baseRate * 1.5 * 2.5} (2.5 hours × ₹${baseRate * 1.5})`);
    console.log(`Actual: ₹${peakResult.totalPrice}`);
    console.log('Breakdown:');
    peakResult.breakdown.forEach(slot => {
        console.log(`  ${slot.hour} - ${slot.isPeak ? '🔥 Peak' : '❄️  Off-Peak'}: ₹${slot.rate}`);
    });

    // Test 3: Mixed peak and off-peak
    const mixedStart = new Date('2025-11-24T03:00:00.000Z'); // Monday 8:30 AM IST (off-peak)
    const mixedEnd = new Date('2025-11-24T08:00:00.000Z');   // Monday 1:30 PM IST (crosses into peak)
    const mixedResult = pricingService.calculateBookingPrice(mixedStart, mixedEnd, baseRate);

    console.log('\n📊 Test 3: Mixed Hours (Monday 8:30 AM - 1:30 PM)');
    console.log(`Time: ${mixedStart.toISOString()} to ${mixedEnd.toISOString()}`);
    console.log(`Actual: ₹${mixedResult.totalPrice}`);
    console.log('Breakdown:');
    mixedResult.breakdown.forEach(slot => {
        console.log(`  ${slot.hour} - ${slot.isPeak ? '🔥 Peak' : '❄️  Off-Peak'}: ₹${slot.rate}`);
    });

    // Test 4: Evening peak
    const eveningStart = new Date('2025-11-24T10:30:00.000Z'); // Monday 4:00 PM IST
    const eveningEnd = new Date('2025-11-24T13:00:00.000Z');   // Monday 6:30 PM IST
    const eveningResult = pricingService.calculateBookingPrice(eveningStart, eveningEnd, baseRate);

    console.log('\n📊 Test 4: Evening Peak (Monday 4 PM - 6:30 PM)');
    console.log(`Time: ${eveningStart.toISOString()} to ${eveningEnd.toISOString()}`);
    console.log(`Actual: ₹${eveningResult.totalPrice}`);
    console.log('Breakdown:');
    eveningResult.breakdown.forEach(slot => {
        console.log(`  ${slot.hour} - ${slot.isPeak ? '🔥 Peak' : '❄️  Off-Peak'}: ₹${slot.rate}`);
    });

    console.log('\n' + '═'.repeat(60));
    console.log('✅ Pricing tests completed\n');
};