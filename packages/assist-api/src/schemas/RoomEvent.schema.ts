import { z } from 'zod';
import { UdpSocketClient } from '../udp-client/UDPClient';

import { RegisterLocalSchema } from './RegisterLocal.schema';
import { NonEmptyStringSchema } from './utils.schema';
import { z18n } from './zod-i18n';

/**
 * @description
 *  - This is the list of all the connection methods available
 */
export const ConnMethod = {
  None: 0,
  LANSocket: 1,
} as const;
export type IConnMethod = (typeof ConnMethod)[keyof typeof ConnMethod];
export type IConnAdapter = UdpSocketClient | null;

export const RoomServiceStatus = {
  Down: 0,
  Starting: 1,
  Up: 2,
} as const;
export type IRoomServiceStatus = (typeof RoomServiceStatus)[keyof typeof RoomServiceStatus];

export const RoomEventLiteral = {
  LookingForDevices: 'searching_devices',
  RespondToAdvertise: 'respond_to_ad',
  BroadcastStop: 'broadcast_stop',
  Listening: 'remote_listening',
  NotListening: 'remote_not_listening',
  RequestHelp: 'request_help',
  RequestStop: 'request_stop',
  RespondToHelp: 'respond_to_help',
  Invalid: 'invalid',

  AnnieAreYouOkay: 'ping',
  ImOkay: 'pong',
} as const;
export type IRoomEventLiteral = (typeof RoomEventLiteral)[keyof typeof RoomEventLiteral];

/**
 * 	This union is parsed at runtime to be used on device communication
 */
export const RoomEventSchema = z18n.union([
  z18n.object({
    event: z18n.literal(RoomEventLiteral.LookingForDevices),
  }),
  z18n.object({
    event: z18n.literal(RoomEventLiteral.RespondToAdvertise),
    appId: NonEmptyStringSchema,
    callerName: RegisterLocalSchema.shape.name,
    device: NonEmptyStringSchema,
  }),
  z18n.object({
    event: z18n.literal(RoomEventLiteral.BroadcastStop),
    appId: NonEmptyStringSchema,
  }),
  z18n.object({
    event: z18n.literal(RoomEventLiteral.Listening),
    appId: NonEmptyStringSchema,
    responderName: RegisterLocalSchema.shape.name,
  }),
  z18n.object({
    event: z18n.literal(RoomEventLiteral.NotListening),
    appId: NonEmptyStringSchema,
  }),
  z18n.object({
    event: z18n.literal(RoomEventLiteral.RequestHelp),
    appId: NonEmptyStringSchema,
    callerName: RegisterLocalSchema.shape.name,
  }),
  z18n.object({
    event: z18n.literal(RoomEventLiteral.RequestStop),
    appId: NonEmptyStringSchema,
  }),
  z18n.object({
    event: z18n.literal(RoomEventLiteral.RespondToHelp),
    responderName: z18n.nullable(RegisterLocalSchema.shape.name), // "null" needed to reset incoming responder,
  }),
  z18n.object({
    event: z18n.literal(RoomEventLiteral.Invalid),
    message: NonEmptyStringSchema,
  }),
  z18n.object({
    event: z18n.literal(RoomEventLiteral.AnnieAreYouOkay),
  }),
  z18n.object({
    event: z18n.literal(RoomEventLiteral.ImOkay),
    appId: NonEmptyStringSchema,
  }),
]);
export type IRoomEvent = z.infer<typeof RoomEventSchema>;
