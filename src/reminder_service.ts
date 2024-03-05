import * as restate from "@restatedev/restate-sdk";
import { Empty } from "./generated/proto/google/protobuf/empty";
import { WEEKLY_INTERVAL } from "./utils/getBaseMilliseconds";
import { sendWorkoutReminder } from "./email";
import {
  RemindRequest,
  ReminderService,
  ReminderServiceClientImpl,
  RemoveRequest,
} from "./generated/proto/reminder";

class ReminderSvc implements ReminderService {
  async remind(request: RemindRequest): Promise<Empty> {
    const ctx = restate.useContext(this);

    const removed = (await ctx.get<boolean>("REMOVED")) ?? false;
    if (!removed) {
      await sendWorkoutReminder(request);
      const client = new ReminderServiceClientImpl(ctx);
      await ctx.delayedCall(() => client.remind(request), WEEKLY_INTERVAL);
    }
    return {};
  }
  async remove(_: RemoveRequest): Promise<Empty> {
    const ctx = restate.useContext(this);
    ctx.set<boolean>("REMOVED", true);
    return {};
  }
}

export { ReminderSvc };
