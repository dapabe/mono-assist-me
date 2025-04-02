import { z } from "zod";
import { UdpSocketClient } from "../udp-client/UDPClient";
import { RegisterLocalSchema } from "./RegisterLocal.schema";
import { NonEmptyStringSchema } from "./utils.schema";

/**
 * @description
 *  - This is the list of all the connection methods available
 */
export type IConnMethod = InstanceType<typeof UdpSocketClient> | null;

export const RoomServiceStatus = {
	Down: 0,
	Starting: 1,
	Up: 2,
} as const;
export type IRoomServiceStatus =
	(typeof RoomServiceStatus)[keyof typeof RoomServiceStatus];

export const RoomEventLiteral = {
	LookingForDevices: "searching_devices",
	RespondToAdvertise: "respond_to_ad",
	BroadcastStop: "broadcast_stop",
	Listening: "remote_listening",
	NotListening: "remote_not_listening",
	RequestHelp: "request_help",
	RequestStop: "request_stop",
	RespondToHelp: "respond_to_help",
	Invalid: "invalid",

	AnnieAreYouOkay: "ping",
	ImOkay: "pong",
} as const;
export type IRoomEventLiteral =
	(typeof RoomEventLiteral)[keyof typeof RoomEventLiteral];

/**
 * 	This union is parsed at runtime to be used on device communication
 */
export const RoomEventSchema = z.union([
	z.object({
		event: z.literal(RoomEventLiteral.LookingForDevices),
	}),
	z.object({
		event: z.literal(RoomEventLiteral.RespondToAdvertise),
		appId: NonEmptyStringSchema,
		callerName: RegisterLocalSchema.shape.name,
		device: NonEmptyStringSchema,
	}),
	z.object({
		event: z.literal(RoomEventLiteral.BroadcastStop),
		appId: NonEmptyStringSchema,
	}),
	z.object({
		event: z.literal(RoomEventLiteral.Listening),
		appId: NonEmptyStringSchema,
		responderName: RegisterLocalSchema.shape.name,
	}),
	z.object({
		event: z.literal(RoomEventLiteral.NotListening),
		appId: NonEmptyStringSchema,
	}),
	z.object({
		event: z.literal(RoomEventLiteral.RequestHelp),
		appId: NonEmptyStringSchema,
		callerName: RegisterLocalSchema.shape.name,
	}),
	z.object({
		event: z.literal(RoomEventLiteral.RequestStop),
		appId: NonEmptyStringSchema,
	}),
	z.object({
		event: z.literal(RoomEventLiteral.RespondToHelp),
		responderName: z.nullable(RegisterLocalSchema.shape.name), // "null" needed to reset incoming responder,
	}),
	z.object({
		event: z.literal(RoomEventLiteral.Invalid),
		message: NonEmptyStringSchema,
	}),
	z.object({
		event: z.literal(RoomEventLiteral.AnnieAreYouOkay),
	}),
	z.object({
		event: z.literal(RoomEventLiteral.ImOkay),
		appId: NonEmptyStringSchema,
	}),
]);
export type IRoomEvent = z.infer<typeof RoomEventSchema>;
