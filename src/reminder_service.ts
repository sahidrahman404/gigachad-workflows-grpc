import * as restate from "@restatedev/restate-sdk";
import { Empty } from "./generated/proto/google/protobuf/empty";
import { WEEKLY_INTERVAL } from "./utils/getBaseMilliseconds";
import { sendWorkoutReminder } from "./email";
import {
  AddReminderRequest,
  ReminderService,
  ReminderServiceClientImpl,
  RemoveReminderRequest,
} from "./generated/proto/gigachad/v1/reminder";

class ReminderSvc implements ReminderService {
  async addReminder(request: AddReminderRequest): Promise<Empty> {
    const ctx = restate.useContext(this);

    const removed = (await ctx.get<boolean>("REMOVED")) ?? false;
    if (!removed) {
      await sendWorkoutReminder(request);
      const client = new ReminderServiceClientImpl(ctx);
      await ctx.delayedCall(() => client.addReminder(request), WEEKLY_INTERVAL);
    }
    return {};
  }
  async removeReminder(_: RemoveReminderRequest): Promise<Empty> {
    const ctx = restate.useContext(this);
    ctx.set<boolean>("REMOVED", true);
    return {};
  }
}

export { ReminderSvc };
