import * as restate from "@restatedev/restate-sdk";
import { Empty } from "./generated/proto/google/protobuf/empty";
import { WEEKLY_INTERVAL } from "./utils/getBaseMilliseconds";
import {
  AddReminderRequest,
  ReminderService,
  ReminderServiceClientImpl,
  RemoveReminderRequest,
} from "./generated/proto/gigachad/v1/reminder";
import { Email } from "./email";

class ReminderSvc implements ReminderService {
  async addReminder(request: AddReminderRequest): Promise<Empty> {
    const ctx = restate.useKeyedContext(this);

    const removed = (await ctx.get<boolean>("REMOVED")) ?? false;
    if (!removed) {
      await ctx.sideEffect(
        async () => await new Email().sendWorkoutReminder(request),
        {
          maxRetries: 1,
        },
      );
      const client = new ReminderServiceClientImpl(ctx.grpcChannel());
      await ctx
        .grpcChannel()
        .delayedCall(() => client.addReminder(request), WEEKLY_INTERVAL);
    }
    return {};
  }
  async removeReminder(_: RemoveReminderRequest): Promise<Empty> {
    const ctx = restate.useKeyedContext(this);
    ctx.set<boolean>("REMOVED", true);
    return {};
  }
}

export { ReminderSvc };
