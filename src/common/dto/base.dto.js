import { z } from "zod";

class BaseDTO {
  static schema = z.object({});
  static validate(data) {
    if (!this.schema || typeof this.schema.safeParse !== "function") {
      return {
        errors: ["DTO schema is not defined or invalid"],
        value: null,
      };
    }
    const result = this.schema.safeParse(data);
    if (!result.success) {
      const issues = result.error?.issues ?? result.error?.errors ?? [];
      const errors = issues.map((issue) => {
        const field = issue.path?.length ? issue.path.join(".") : null;
        return field ? `${field}: ${issue.message}` : issue.message;
      });
      return { errors: errors.length ? errors : ["Validation failed"], value: null };
    }
    return { errors: null, value: result.data };
  }
}

export default BaseDTO;
