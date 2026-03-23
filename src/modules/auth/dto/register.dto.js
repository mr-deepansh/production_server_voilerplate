import BaseDTO from "../../../common/dto/base.dto.js";
import { registerSchema } from "../auth.schema.js";

class RegisterDTO extends BaseDTO {
  static schema = registerSchema;
}

export default RegisterDTO;
