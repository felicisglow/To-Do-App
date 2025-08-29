import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, beforeEach, afterEach, vi, expect } from "vitest";
import App from "../src/App";

const mockTasks = [
  { id: 1, title: "Task 1", description: "Desc 1", status: "open" },
  { id: 2, title: "Task 2", description: "Desc 2", status: "open" },
];

describe("App Component (Vitest)", () => {
  beforeEach(() => {
    // reset the fetch mock for each test
    vi.resetAllMocks();
  });

  afterEach(() => {
    // clear timers if you use fake timers elsewhere
    vi.useRealTimers();
  });

  it("renders form and fetched tasks", async () => {
    // initial fetch for tasks
    (global as any).fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockTasks,
    });

    render(<App />);

    expect(screen.getByText(/Add New Task/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();

    // wait for tasks to appear
    expect(await screen.findByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Desc 1")).toBeInTheDocument();
  });

  it("submits a new task and shows success message", async () => {
    // sequence: 1) initial GET -> [], 2) POST -> ok, 3) GET -> new list
    (global as any).fetch = vi.fn()
      // initial fetch returns empty list
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      // POST returns ok:true
      .mockResolvedValueOnce({
        ok: true,
      })
      // subsequent fetch returns the created task
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: 3, title: "New Task", description: "New Desc", status: "open" }],
      });

    render(<App />);

    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: "New Task" } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: "New Desc" } });
    fireEvent.click(screen.getByText(/Add Task/i));

    // The component sets a message "Task created!" on success
    expect(await screen.findByText(/Task created!/i)).toBeInTheDocument();
    // And it should fetch again and show the new task
    expect(await screen.findByText("New Task")).toBeInTheDocument();

    // ensure fetch was called for POST (second call)
    const calls = (global as any).fetch.mock.calls;
    expect(calls.length).toBeGreaterThanOrEqual(2);
    expect(calls[1][0]).toMatch("/api/tasks"); // POST URL
    expect(calls[1][1].method).toBe("POST");
  });

  it("marks a task as done (PATCH) and refetches", async () => {
    // initial fetch -> mockTasks
    // PATCH -> ok
    // fetch -> updated task list
    (global as any).fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockTasks,
      })
      .mockResolvedValueOnce({ ok: true }) // PATCH
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: 1, title: "Task 1", description: "Desc 1", status: "DONE" }],
      });

    render(<App />);

    // wait for task to render
    const taskItem = await screen.findByText("Task 1");
    const li = taskItem.closest("li") as HTMLElement;
    expect(li).toBeTruthy();

    // find the button inside that list item and click it
    const { getByRole } = within(li);
    const button = getByRole("button");
    fireEvent.click(button);

    // after clicking, the component triggers PATCH and refetches
    await waitFor(() => {
      expect((global as any).fetch).toHaveBeenCalled();
    });

    // verify a PATCH call to the expected endpoint happened among calls
    const calls = (global as any).fetch.mock.calls.map((c: any) => c[0]);
    expect(calls.some((url: string) => url.includes("/api/tasks/1"))).toBe(true);
  });
});
