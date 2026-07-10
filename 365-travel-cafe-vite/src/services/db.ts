export interface BookingData {
  id?: string;
  name: string;
  phone: string;
  email: string;
  date: string;
  timeSlot: string;
  guests: number;
  seatingType: 'indoor' | 'outdoor';
  specialRequest?: string;
  createdAt?: string;
}

export interface BookingResult {
  success: boolean;
  message: string;
  booking?: BookingData;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const STORAGE_KEY = '365_cafe_bookings';
const MAX_CAPACITY_PER_SLOT = 5;

export const dbService = {
  async checkAvailability(date: string, timeSlot: string): Promise<{ available: boolean; remaining: number }> {
    await delay(300);
    if (typeof window === 'undefined') return { available: true, remaining: MAX_CAPACITY_PER_SLOT };
    const bookings = this.getAllLocalBookings();
    const matchingBookings = bookings.filter(
      (b) => b.date === date && b.timeSlot.toLowerCase() === timeSlot.toLowerCase()
    );
    const remaining = MAX_CAPACITY_PER_SLOT - matchingBookings.length;
    return { available: remaining > 0, remaining: Math.max(0, remaining) };
  },

  async saveBooking(data: BookingData): Promise<BookingResult> {
    await delay(1000);
    try {
      if (data.guests < 1 || data.guests > 12) {
        return { success: false, message: 'Guests count must be between 1 and 12.' };
      }
      const { available } = await this.checkAvailability(data.date, data.timeSlot);
      if (!available) {
        return { success: false, message: `Apologies! All tables for ${data.timeSlot} on ${data.date} are fully booked.` };
      }
      const newBooking: BookingData = {
        ...data,
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        createdAt: new Date().toISOString(),
      };
      if (typeof window !== 'undefined') {
        const currentBookings = this.getAllLocalBookings();
        currentBookings.push(newBooking);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentBookings));
      }
      return { success: true, message: 'Your table has been reserved successfully! See you soon.', booking: newBooking };
    } catch (error) {
      console.error('Error saving booking:', error);
      return { success: false, message: 'Server error. Please try again later.' };
    }
  },

  async getBookings(): Promise<BookingData[]> {
    await delay(400);
    return this.getAllLocalBookings();
  },

  getAllLocalBookings(): BookingData[] {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }
};
