# BOOKING CALENDAR COMPONENT

The key ideas behind this project are:

- Creating a front-end component in React with a mobile-first design.
  The component must show seven natural days in calendar or schedule view, detailing bookings that start or end each day.
- It must include another reusable autocomplete component. This component will search and filter locations obtained from an API endpoint.
- It must have a pagination system to jump between weeks.
- There must also be a way to jump directly to a week by selecting the year and week.
- When you click on each booking, a detailed view of the booking information obtained from another API endpoint should be displayed.

## NEXT ELEMENTS I WANT TO WORK IN TO IMPROVE

- Add i18n/internationalization support.
- Allow bookings to be modified using drag and drop. I ran out of time for this version, sorry.
- Automate testing of all small components that make up the WeeklyCalendar component.

## DECISSIONS ABOUT STATE MANAGEMENT

I decided not to use state management on this specific component because the final version allows a large number of users (final clients, admins, stakeholders, etc.) to modify the booking details. It would be a high risk to work on cached information instead of calling the API when necessary.

## To execute the project

```bash
# needs node >= 22
npm install
npm run dev
```

Open [http://localhost:5173/booking-calendar-component/](http://localhost:5173/booking-calendar-component/) with your browser to see the result.

## To execute the Tests

Component testing using React Testing Library

```bash
npx vitest
```
