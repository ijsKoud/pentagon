/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { EventListener } from "../../../../src/lib/structures/EventListener";

export default class extends EventListener {
	constructor(client) {
		super(client, {
			name: "test"
		});
	}

	run() {
		console.log("test(EventListener): test complete, event was called.");
	}
}
