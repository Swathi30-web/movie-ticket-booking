import type { Dispatch, SetStateAction } from "react";

interface Props {
  selectedSeats: string[];
  setSelectedSeats: Dispatch<SetStateAction<string[]>>;
  bookedSeats: string[];
}

const SeatLayout = ({
  selectedSeats,
  setSelectedSeats,
  bookedSeats,
}: Props) => {

  const rows = ["A", "B", "C", "D", "E", "F"];

  const seats = Array.from(
    { length: 10 },
    (_, index) => index + 1
  );

  const toggleSeat = (seat: string) => {

    if (bookedSeats.includes(seat)) return;

    if (selectedSeats.includes(seat)) {

      setSelectedSeats(
        selectedSeats.filter(
          (item) => item !== seat
        )
      );

    } else {

      setSelectedSeats([
        ...selectedSeats,
        seat,
      ]);

    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-xl font-bold mb-5">
        Select Seats
      </h2>

      <div className="space-y-3">

        {rows.map((row) => (

          <div
            key={row}
            className="flex justify-center gap-2"
          >

            {seats.map((number) => {

              const seat = `${row}${number}`;

              const booked =
                bookedSeats.includes(seat);

              const selected =
                selectedSeats.includes(seat);

              return (
                <button
                  key={seat}
                  disabled={booked}
                  onClick={() =>
                    toggleSeat(seat)
                  }
                  className={`w-9 h-9 rounded text-xs font-semibold
                    ${
                      booked
                        ? "bg-red-500 text-white"
                        : selected
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 hover:bg-blue-300"
                    }
                  `}
                >
                  {seat}
                </button>
              );
            })}

          </div>

        ))}

      </div>

      <div className="flex gap-5 justify-center mt-6 text-sm">

        <span>⬜ Available</span>
        <span>🟩 Selected</span>
        <span>🟥 Booked</span>

      </div>

    </div>
  );
};

export default SeatLayout;