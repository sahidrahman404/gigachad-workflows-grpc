import * as restate from "@restatedev/restate-sdk";
import { Empty } from "./generated/proto/google/protobuf/empty";
import {
  WEEKLY_INTERVAL,
  getBaseMilliseconds,
} from "./utils/getBaseMilliseconds";
import {
  AddReminderRequest,
  CreateRemindersRequest,
  ReminderService,
  ReminderServiceClientImpl,
  RemoveReminderRequest,
  UpdateRemindersRequest,
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
      ctx
        .grpcChannel()
        .delayedCall(() => client.addReminder(request), WEEKLY_INTERVAL);
    }
    return {};
  }

  async createReminders(request: CreateRemindersRequest): Promise<Empty> {
    const ctx = restate.useKeyedContext(this);
    const { schedules, addReminderRequest } = request;
    const reminderClient = new ReminderServiceClientImpl(ctx.grpcChannel());
    if (addReminderRequest) {
      for (const schedule of schedules) {
        const baseMilliseconds = getBaseMilliseconds(schedule);
        ctx
          .grpcChannel()
          .delayedCall(
            () => reminderClient.addReminder(addReminderRequest),
            baseMilliseconds,
          );
      }
    }
    return {};
  }

  async updateReminders(request: UpdateRemindersRequest): Promise<Empty> {
    const ctx = restate.useKeyedContext(this);
    const reminderClient = new ReminderServiceClientImpl(ctx.grpcChannel());
    const { oldReminderId, createRemindersRequest } = request;
    reminderClient.removeReminder({ reminderId: oldReminderId });
    if (createRemindersRequest) {
      reminderClient.createReminders(createRemindersRequest);
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
