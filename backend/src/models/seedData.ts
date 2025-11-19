import { Room } from '../types';
import { db } from './database';

/**
 * Seed initial rooms into the database
 */
export const seedRooms = (): void => {
    const rooms: Room[] = [
        {
            id: '101',
            name: 'Conference Room A',
            baseHourlyRate: 500,
            capacity: 10
        },
        {
            id: '102',
            name: 'Meeting Pod B',
            baseHourlyRate: 300,
            capacity: 4
        },
        {
            id: '103',
            name: 'Executive Suite C',
            baseHourlyRate: 800,
            capacity: 15
        },
        {
            id: '104',
            name: 'Focus Cabin D',
            baseHourlyRate: 200,
            capacity: 2
        },
        {
            id: '105',
            name: 'Board Room E',
            baseHourlyRate: 1000,
            capacity: 20
        }
    ];

    rooms.forEach(room => db.addRoom(room));

    console.log(`✅ Seeded ${rooms.length} rooms into database`);
};

/**
 * Initialize database with seed data
 */
export const initializeDatabase = (): void => {
    console.log('🌱 Initializing database...');
    seedRooms();
    console.log('✅ Database initialized successfully');
    console.log('📊 Stats:', db.getStats());
};