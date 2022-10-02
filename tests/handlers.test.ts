import { PentagonClient } from "./mocks/ClientMock";
import { describe, test, expect, vi } from "vitest";

describe("test(EventHandler): handling & running functions", () => {
	const client = new PentagonClient();

	test("client(Handlers): loading the classes", async () => {
		expect(await client.run()).toEqual({ commands: 1, events: 1 });
	});

	test("client(EventListener): test event listening", () => {
		const log = vi.spyOn(console, "log").mockImplementation(() => void 0);
		client.emit("test");

		expect(log).toBeCalledWith("test(EventListener): test complete, event was called.");
	});
});
