export const getFetchStationsMock = () => {
  return [
    {
      id: "1",
      name: "Station 1",
      bookings: [
        {
          id: "1",
          pickupReturnStationId: "1",
          customerName: "Kera",
          startDate: "2025-01-02T20:04:19.032Z",
          endDate: "2025-07-17T08:51:27.402Z",
        },
        {
          id: "7",
          pickupReturnStationId: "1",
          customerName: "Elmira Larkin Sr.",
          startDate: "2021-02-19T17:22:15.117Z",
          endDate: "2021-08-10T10:35:41.773Z",
        },
      ],
    },
    {
      id: "2",
      name: "Station 2",
      bookings: [
        {
          id: "8",
          pickupReturnStationId: "2",
          customerName: "John Doe",
          startDate: "2021-04-01T10:00:00.000Z",
          endDate: "2021-04-03T12:00:00.000Z",
        },
        {
          id: "9",
          pickupReturnStationId: "2",
          customerName: "Jane Smith",
          startDate: "2021-05-15T09:30:00.000Z",
          endDate: "2021-05-25T11:00:00.000Z",
        },
      ],
    },
  ];
};
