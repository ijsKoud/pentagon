import { ApplyOptions } from "../../lib/decorators/StructureDecorators.js";
import { EventListener, EventListenerOptions } from "../../lib/structures/EventListener.js";

@ApplyOptions<EventListenerOptions>({
	name: "test"
})
export default class extends EventListener {
	public run() {
		console.log("test(EventListener): test complete, event was called.");
	}
}
