import { User } from '../models/user.model';
import { getUser } from '../services/list.service';

function getFollowers(userid : number, users : User[]) {
  const user = getUser(userid, users);
  return user?.followers;
}

function getFollowing(userid : number, users : User[]) {
  const user = getUser(userid, users);
  return user?.following;
}

function getBlocked(userid : number, users : User[]) {
  const user = getUser(userid, users);
  return user?.blocked;
}

function isBlockedBy(userid1 : number, userid2 : number, users : User[]) {
    const user = getUser(userid1, users);
    const blocked = user?.blocked;
    return blocked?.includes(userid2);
}