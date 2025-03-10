import { ErrorLogModel } from "@/models/errorlog.model";

export async function logError(
  error: Error,
  context: {
    endpoint: string;
    method: string;
    requestData?: any;
    statusCode?: number;
    severity?: "LOW" | "MEDIUM" | "HIGH";
    userId?: string;
  }
) {
  try {
    const errorLog = new ErrorLogModel({
      errorMessage: error.message,
      stackTrace: error.stack,
      environment: process.env.NODE_ENV || "development",
      ...context,
    });

    await errorLog.save();

    // 심각도가 HIGH인 경우 알림 발송
    if (context.severity === "HIGH") {
      await sendErrorNotification({
        message: error.message,
        endpoint: context.endpoint,
        severity: "HIGH",
      });
    }
  } catch (loggingError) {
    console.error("Error logging failed:", loggingError);
  }
}

async function sendErrorNotification(data: {
  message: string;
  endpoint: string;
  severity: string;
}) {
  // 슬랙/디스코드 등으로 알림 발송 구현
}
