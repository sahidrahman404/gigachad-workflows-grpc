import * as restate from "@restatedev/restate-sdk";
import { Empty } from "./generated/proto/google/protobuf/empty";
import { getBaseMilliseconds } from "./utils/getBaseMilliseconds";
import {
  CreateScheduleRequest,
  ScheduleService,
  ScheduleServiceClientImpl,
  UpdateScheduleRequest,
} from "./generated/proto/gigachad/v1/schedule";
import { ReminderServiceClientImpl } from "./generated/proto/gigachad/v1/reminder";

class ScheduleSvc implements ScheduleService {
  async createSchedule(request: CreateScheduleRequest): Promise<Empty> {
    const ctx = restate.useContext(this);
    const { schedules, addReminderRequest } = request;
    for (const schedule of schedules) {
      if (addReminderRequest) {
        const base = getBaseMilliseconds(schedule);
        const client = new ReminderServiceClientImpl(ctx.grpcChannel());
        await ctx
          .grpcChannel()
          .delayedCall(
            () => client.addReminder({ ...addReminderRequest }),
            base,
          );
      }
    }
    return {};
  }
  async updateSchedule(request: UpdateScheduleRequest): Promise<Empty> {
    const ctx = restate.useKeyedContext(this);
    const scheduleClient = new ScheduleServiceClientImpl(ctx.grpcChannel());
    const reminderClient = new ReminderServiceClientImpl(ctx.grpcChannel());
    await reminderClient.removeReminder({
      scheduleId: request.oldReminderId,
    });

    if (request.createScheduleRequest)
      await scheduleClient.createSchedule(request.createScheduleRequest);
    return {};
  }
}

export { ScheduleSvc };
