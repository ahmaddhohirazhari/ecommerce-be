const Request = require('express');
import { User } from '../models';

export interface AuthenticatedRequest extends Request {
  user: User;
}
