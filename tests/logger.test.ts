import { Timestamp } from "@sapphire/timestamp";
import { Logger } from "../src/lib/logger/Logger";
import { LogLevel } from "../src/lib/logger/LoggerTypes";
import { describe, test, expect, vi } from "vitest";

describe("test(Logger): logging func", () => {
	const clear = (str: string | number) => str.toString();
	const date = new Timestamp("YYYY-MM-DD HH:mm:ss").display(new Date());
	const timestamp = `${date} `;
	const logger = new Logger({
		format: { none: { timestamp: { formatter: () => timestamp, color: null }, level: false, message: clear } },
		level: LogLevel.Trace,
		console
	});

	test("Logger: Trace function", () => {
		const trace = vi.spyOn(console, "trace").mockImplementation(() => void 0);
		logger.trace("Hello World");

		expect(trace).toBeCalledWith(`${timestamp}[TRACE] » Hello World`);
	});

	test("Logger: Debug function", () => {
		const debug = vi.spyOn(console, "debug").mockImplementation(() => void 0);
		logger.debug("Hello World");

		expect(debug).toBeCalledWith(`${timestamp}[DEBUG] » Hello World`);
	});

	test("Logger: Warn function", () => {
		const warn = vi.spyOn(console, "warn").mockImplementation(() => void 0);
		logger.warn("Hello World");

		expect(warn).toBeCalledWith(`${timestamp}[WARN]  » Hello World`);
	});

	test("Logger: Info function", () => {
		const info = vi.spyOn(console, "info").mockImplementation(() => void 0);
		logger.info("Hello World");

		expect(info).toBeCalledWith(`${timestamp}[INFO]  » Hello World`);
	});

	test("Logger: Error function", () => {
		const error = vi.spyOn(console, "error").mockImplementation(() => void 0);
		logger.error("Hello World");

		expect(error).toBeCalledWith(`${timestamp}[ERROR] » Hello World`);
	});

	test("Logger: Fatal function", () => {
		const fatal = vi.spyOn(console, "error").mockImplementation(() => void 0);
		logger.fatal("Hello World");

		expect(fatal).toBeCalledWith(`${timestamp}[FATAL] » Hello World`);
	});

	test("Logger: write function", () => {
		const log = vi.spyOn(console, "log").mockImplementation(() => void 0);
		logger.write(LogLevel.None, "Hello World");

		expect(log).toBeCalledWith(`${timestamp}Hello World`);
	});
});
