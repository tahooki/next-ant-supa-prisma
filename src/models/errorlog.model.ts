import { Model } from "@/models/model";
import { UserModel } from "@/models/user.model";

export class ErrorLogModel extends Model {
  tableName = "errorlog";

  id: string | undefined;
  timestamp: string | undefined;
  errorMessage: string | undefined;
  stackTrace: string | undefined;
  endpoint: string | undefined;
  method: string | undefined;
  requestData: string | undefined;
  statusCode: number | undefined;
  severity: "LOW" | "MEDIUM" | "HIGH" | undefined;
  environment: string | undefined;
  resolved: boolean | undefined;
  resolvedAt: string | undefined;
  user: UserModel | undefined;

  constructor(data: Partial<ErrorLogModel> = {}) {
    super();

    this.id = data.id ?? undefined;
    this.timestamp = data.timestamp ?? undefined;
    this.errorMessage = data.errorMessage ?? undefined;
    this.stackTrace = data.stackTrace ?? undefined;
    this.endpoint = data.endpoint ?? undefined;
    this.method = data.method ?? undefined;
    this.requestData = data.requestData ?? undefined;
    this.statusCode = data.statusCode ?? undefined;
    this.severity = data.severity ?? undefined;
    this.environment = data.environment ?? undefined;
    this.resolved = data.resolved ?? undefined;
    this.resolvedAt = data.resolvedAt ?? undefined;
    this.user = data.user ? new UserModel(data.user) : undefined;
  }
}
