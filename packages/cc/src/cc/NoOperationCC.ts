import {
	CommandClasses,
	MessagePriority,
	TransmitOptions,
} from "@zwave-js/core";
import { PhysicalCCAPI } from "../lib/API.js";
import { CommandClass } from "../lib/CommandClass.js";
import {
	API,
	commandClass,
	implementedVersion,
} from "../lib/CommandClassDecorators.js";

// @noSetValueAPI This CC has no set-type commands
// @noInterview There's nothing to interview here

@API(CommandClasses["No Operation"])
export class NoOperationCCAPI extends PhysicalCCAPI {
	public async send(): Promise<void> {
		await this.host.sendCommand(
			new NoOperationCC({
				nodeId: this.endpoint.nodeId,
				endpointIndex: this.endpoint.index,
			}),
			{
				// Unless instructed otherwise, don't try too hard to
				// reach the node. Pings are supposed to be short commands
				// and not block the send queue for multiple seconds.
				transmitOptions: TransmitOptions.ACK,
				...this.commandOptions,
				// Don't retry sending ping packets
				maxSendAttempts: 1,
				// Pings have their own dedicated priority, since they
				// are used to test whether a node is awake/alive
				priority: MessagePriority.Ping,
			},
		);
	}
}

@commandClass(CommandClasses["No Operation"])
@implementedVersion(1)
export class NoOperationCC extends CommandClass {
	declare ccCommand: undefined;
}
