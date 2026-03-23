import { z } from "zod";

class BaseDTO {
  static schema = z.object({});
  static validate(data) {
    const result = this.schema.safeParse(data);
    if (!result.success) {
      const errors = result.error.errors.map((err) => err.message);
      return { errors, value: null };
    }
    return { errors: null, value: result.data };
  }
}

export default BaseDTO;
