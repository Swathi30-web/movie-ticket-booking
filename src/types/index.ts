export interface Movie {
  id: string;
  name: string;
  poster: string;
  genre: string;
  language: string;
  duration: string;
  releaseDate: string;
  rating: number;
  status: "Now Showing" | "Upcoming";
  description: string;
}

export interface Theatre {
  id: string;
  name: string;
  location: string;
}

export interface Show {
  id: string;
  movieId: string;
  theatreId: string;
  screen: string;
  date: string;
  showTime: string;
  ticketPrice: number;
  availableSeats: number;
}

export interface Booking {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  movieId: string;
  theatreId: string;
  date: string;
  showTime: string;
  seats: string[];
  numberOfTickets: number;
  totalAmount: number;
  bookingStatus: "Confirmed" | "Cancelled";
}