import { Model } from 'sutando';

/**
 * Stores FCM device tokens for user (student) accounts.
 * Columns:
 *   - id (auto)
 *   - user_id (foreign key to users.id)
 *   - token (varchar(255)) – Firebase token string
 *   - created_at, updated_at timestamps
 */
class UserFCMToken extends Model {
  // Table name (Sutando defaults to snake_case plural → user_fcm_tokens)
  table = 'user_fcm_tokens';

  casts = {
    created_at: 'datetime',
    updated_at: 'datetime',
  };
}

export default UserFCMToken;
