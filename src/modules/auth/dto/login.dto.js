import BaseDTO from "../../../common/dto/base.dto.js";
import { loginSchema } from "../auth.schema.js";

class LoginDTO extends BaseDTO {
  static schema = loginSchema;
}

export default LoginDTO;
