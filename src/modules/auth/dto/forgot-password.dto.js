import BaseDTO from "../../../common/dto/base.dto.js";
import { forgotPasswordSchema } from "../auth.schema.js";

class ForgotPasswordDTO extends BaseDTO {
  static schema = forgotPasswordSchema;
}

export default ForgotPasswordDTO;
