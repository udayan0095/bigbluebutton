import { check } from 'meteor/check';
import Users from '/imports/api/2.0/users';
import Logger from '/imports/startup/server/logger';
import removeVoiceUser from '/imports/api/2.0/voice-users/server/modifiers/removeVoiceUser';

const CLIENT_TYPE_HTML = 'HTML5';

export default function removeUser(meetingId, userId) {
  check(meetingId, String);
  check(userId, String);

  const selector = {
    meetingId,
    userId,
  };

  const modifier = {
    $set: {
      'user.connection_status': 'offline',
      'user.time_of_joining': 0,
      'user.listenOnly': false,
      'user.validated': false,
      'user.emoji': 'none',
      'user.presenter': false,
      'user.role': 'VIEWER',
    },
  };

  removeVoiceUser(meetingId, {
    voiceConf: '',
    voiceUserId: '',
    intId: userId,
  });

  const cb = (err) => {
    if (err) {
      return Logger.error(`Removing user from collection: ${err}`);
    }

    return Logger.info(`Removed ${CLIENT_TYPE_HTML} user id=${userId} meeting=${meetingId}`);
  };

  return Users.update(selector, modifier, cb);
}
