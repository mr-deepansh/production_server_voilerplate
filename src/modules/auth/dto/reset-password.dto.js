import BaseDTO from "../../../common/dto/base.dto.js";
import { resetPasswordSchema } from "../auth.schema.js";

class ResetPasswordDTO extends BaseDTO {
  static schema = resetPasswordSchema;
}

export default ResetPasswordDTO;
