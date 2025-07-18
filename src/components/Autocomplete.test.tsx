import { render, screen, fireEvent } from "@testing-library/react";
import { Autocomplete } from "./Autocomplete";
import { expect, vi, it, beforeEach, describe } from "vitest";
// act is deprecated, but when executing the test we receive a warning in the console log!!
import { act } from "react-dom/test-utils";
import { getFetchStationsMock } from "../lib/mock";

beforeEach(() => {
  global.fetch = vi.fn().mockImplementation((url) => {
    if (url.includes("/bookings/")) {
      return Promise.resolve({
        ok: true,
        json: async () => [
          { id: "1", name: "Station 1" },
          { id: "2", name: "Station 2" },
        ],
      });
    } else if (url.includes("/stations")) {
      return Promise.resolve({
        ok: true,
        json: async () => getFetchStationsMock(),
      });
    }
    // Default mock for other URLs
    return Promise.resolve({
      ok: true,
      json: async () => [],
    });
  });
});

describe("Autocomplete Component", () => {
  it("fetches values from the provided URL", async () => {
    await act(async () => {
      render(<Autocomplete url="/stations" onSelectValue={() => {}} />);
    });
    fireEvent.focus(screen.getByPlaceholderText(/Choose a value/i));
    expect(await screen.findByText("Station 1")).toBeInTheDocument();
    expect(await screen.findByText("Station 2")).toBeInTheDocument();
  });

  it("shows loading and error states correctly", async () => {
    global.fetch = vi.fn().mockImplementationOnce(() => Promise.resolve({ ok: false, status: 500 }));
    await act(async () => {
      render(<Autocomplete url="/error" onSelectValue={() => {}} />);
    });
    fireEvent.focus(screen.getByPlaceholderText(/Choose a value/i));
    expect(await screen.findByText(/HTTP error! status: 500/i)).toBeInTheDocument();
  });

  it("filters and sorts values as user types", async () => {
    await act(async () => {
      render(<Autocomplete url="/stations" onSelectValue={() => {}} />);
    });
    fireEvent.focus(screen.getByPlaceholderText(/Choose a value/i));
    await screen.findByText("Station 1");
    const input = screen.getByPlaceholderText(/Choose a value/i);
    fireEvent.change(input, { target: { value: "Station 2" } });
    expect(await screen.findByText("Station 2")).toBeInTheDocument();
    expect(screen.queryByText("Station 1")).not.toBeInTheDocument();
  });

  it("calls onSelectValue with the correct id when a value is selected", async () => {
    const onSelectValue = vi.fn();
    await act(async () => {
      render(<Autocomplete url="/stations" onSelectValue={onSelectValue} />);
    });
    fireEvent.focus(screen.getByPlaceholderText(/Choose a value/i));
    const value = await screen.findByText("Station 1");
    fireEvent.click(value);
    expect(onSelectValue).toHaveBeenCalledWith("1");
  });
});
