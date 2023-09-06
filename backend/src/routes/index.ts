import { Express, Router, Request, Response, NextFunction } from 'express';
import { di } from '../di';
import TestController from '../controllers/test.controller';
import TestService from '../services/test.service';
import {createUser} from './utils';
import * as TestUtils from "../../tests/utils/test_utils";

import { loggedInId, setAuthenticatedUserID, getAuthenticatedUserID } from '../services/list.service';
import users from '../database/users';
import games from '../database/games';
import lists from '../database/lists';
import posts from '../database/posts';

const router = Router();
const prefix = '/api';
const fs = require('fs'); //Module to read files
let loggedID = 1;
setAuthenticatedUserID(loggedID);

// -------------------------------- USERS ROUTES --------------------------------
//*Return Logged USer
router.get('/me', async (req,res) => {
  const loggedId_ = getAuthenticatedUserID();
  console.log(loggedId_)
  const requestedUser = users.find(user => user.id === loggedId_);
  console.log(requestedUser)

  if(!requestedUser){
    return res.status(404).json({ Error : 'User ' + String(loggedId_)  + ' not found' });
  }

  //PRINT USER PROFILE INFO
  res.status(200).json(requestedUser);
});


//*Create User
router.post('/users', async (req,res) => {
  const { user, email, password, name, lastName, pronouns, bio } = req.body;
  
  //Checking missing info
  if(!user){
    return res.status(400).json({ message: 'Username missing' });
  }else if(!email){
    return res.status(400).json({ message: 'Email missing' });
  }else if(!password){
    return res.status(400).json({ message: 'Password missing' });
  }else if(!name){
    return res.status(400).json({ message: 'Name missing' });
  }else if(!lastName){
    return res.status(400).json({ message: 'Last name missing' });
  }

  //Checking already registered info
  try{
    if(users.some((users:any) => users.user === user)){
      return res.status(409).json({ message: 'Username arealdy exists' });
    }else if(users.some((users:any) => users.email === email)){
      return res.status(409).json({ message: 'Email arealdy exists' });
    }
  }catch(err){
    return res.status(400).json({Error : 'Could not find registered logs'});
  }

  let userID = await TestUtils.getRandomInt(1,1000);
  while(users.find((users:any) => users.id === userID)){
    userID = await TestUtils.getRandomInt(1,1000);
  }

  const newUser = createUser(userID, user, email, password, name, lastName, pronouns, bio);
  try{
    await users.push(newUser);
  }catch (err){
    return res.status(400).json({ Error : 'File could not be written' });
  }
  return res.status(201).json({ message: 'User was successfully registered' });
});

//*Delete User
router.delete('/users/:id', async (req,res) => {
  const id = parseInt(req.params.id);
  loggedID = parseInt(req.query.loggedID as string);

  if(((loggedID !== 0) && (loggedID !== id))){
    return res.status(401).json({ Error : 'Unauthorized' });
  }

  const userIndex = await users.findIndex(user => user.id === id);

  if(userIndex !== -1){
    await users.splice(userIndex,1);
    return res.status(201).json({ message: 'User was successfully deleted' });
  }else{
    return res.status(404).json({ Error : 'User not found' });
  }
});

//*User Profile
router.get('/users/:id', (req,res) => {
  const id = parseInt(req.params.id);
  loggedID = parseInt(req.query.loggedID as string);

  // if(((loggedID !== 0) && (loggedID !== id))){
    // return res.status(401).json({ Error : 'Unauthorized' });
  // }

  const requestedUser = users.find(user => user.id === id);

  if(!requestedUser){
    return res.status(404).json({ Error : 'User not found' });
  }

  //PRINT USER PROFILE INFO
  res.status(200).json(requestedUser);
});

//Edit user profile
router.put('/users/:id', (req,res) => {
  const requestBody = req.body;
  const id = parseInt(req.params.id);
  loggedID = parseInt(req.query.loggedID as string);
  

  const userIndex = users.findIndex((user: any) => user.id === id);
  const requestedUser = users.find(user => user.id === id);

  if(!requestedUser){
    return res.status(404).json({ Error : 'User not found' });
  }else if(((loggedID !== 0) && (loggedID !== id))){
    return res.status(401).json({ Error : 'Unauthorized' });
  }else{
    if(users.some((users:any) => users.user === requestBody.user)){
      return res.status(409).json({ message: 'Username arealdy exists' });
    }else if(users.some((users:any) => users.email === requestBody.email)){
      return res.status(409).json({ message: 'Email arealdy exists' });
    }
  }

  //EDIT USER
  Object.assign(users[userIndex], requestBody);

  return res.status(201).json({ message: 'User was successfully modified' });
});

// END OF USER ROUTES //

// -------------------------------- FOLLOWERS ROUTES --------------------------------

// Route to get users
router.get('/users', (req: Request, res: Response) => {
  res.json(users);
});

// List followers for a user
router.get('/users/:id/followers', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = users.find(user => user.id === id);

  if (isNaN(id)) {
    res.status(400).json({ message: 'Invalid user ID format' });
    return;
  }

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const followers = user.followers.map(followerId => {
    const follower = users.find(user => user.id === followerId);
    return follower;
  });

  res.json(followers);
});

// List following for a user
router.get('/users/:id/following', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const user = users.find(user => user.id === id);

    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid user ID format' });
      return;
    }

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const following = user.following.map(followingId => {
      const followingUser = users.find(user => user.id === followingId);
      return followingUser;
    });

    res.json(following);
});

// Unfollow a user
router.post('/users/:id/unfollow', (req: Request, res: Response) => {
  const unfollowId = parseInt(req.params.id);
  const id = parseInt(req.body.id);

  const user = users.find(user => user.id === id);
  const unfollowedUser = users.find(user => user.id === unfollowId);

  if (isNaN(id)) {
    res.status(400).json({ message: 'Invalid user ID format' });
    return;
  }

  if(!user?.following.includes(unfollowId)) {
    res.status(400).json({ message: 'You are not following this user' });
    return;
  }

  if (!user || !unfollowedUser) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  user.following = user.following.filter(userId => userId !== unfollowId);
  unfollowedUser.followers = unfollowedUser.followers.filter(userId => userId !== id);

  res.json({ message: 'You are no longer following this user!'});
});

// Follow a user
router.post('/users/:id/follow', (req: Request, res: Response) => {
  const followId = parseInt(req.params.id);
  const id = parseInt(req.body.id);
  const user = users.find(user => user.id === id);
  const follower = users.find(user => user.id === followId);

  if (isNaN(id)) {
    res.status(400).json({ message: 'Invalid user ID format' });
    return;
  }

  if (user?.following.includes(followId)) {
    res.status(400).json({ message: 'You are already following this user' });
    return;
  }

  if (!user || !follower) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  user.following.push(followId);
  follower.followers.push(id);
  res.json({ message: 'You are now following this user!'});
});

// Blocks a user
router.post('/users/:id/block', (req: Request, res: Response) => {
  const blockId = parseInt(req.params.id);
  const id = parseInt(req.body.id);
  const user = users.find(user => user.id === id);
  const blockedUser = users.find(user => user.id === blockId);

  if (isNaN(id)) {
    res.status(400).json({ message: 'Invalid user ID format' });
    return;
  }

  if (user?.blocked.includes(blockId)) {
    res.status(400).json({ message: 'You have already blocked this user' });
    return;
  }

  if (!user || !blockedUser) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  user.blocked.push(blockId);
  res.json({ message: 'You have blocked this user!'});
});

// Unblocks a user
router.post('/users/:id/unblock', (req: Request, res: Response) => {
  const unblockId = parseInt(req.params.id);
  const id = parseInt(req.body.id);
  const user = users.find(user => user.id === id);
  const unblockedUser = users.find(user => user.id === unblockId);

  if (isNaN(id)) {
    res.status(400).json({ message: 'Invalid user ID format' });
    return;
  }

  if(!user?.blocked.includes(unblockId)) {
    res.status(400).json({ message: 'You have not blocked this user' });
    return;
  }

  if (!user || !unblockedUser) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  user.blocked = user.blocked.filter(userId => userId !== unblockId);
  res.json({ message: 'You have unblocked this user!'});
});

// List blocked users
router.get('/users/:id/blocked/count', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = users.find(user => user.id === id);

  if (isNaN(id)) {
    res.status(400).json({ message: 'Invalid user ID format' });
    return;
  }

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const blockedUsersCount = user.blocked.length;

  res.json({ blockedUsersCount });
});

// Counter for followers
router.get('/users/:id/followers/count', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = users.find(user => user.id === id);

  if (isNaN(id)) {
    res.status(400).json({ message: 'Invalid user ID format' });
    return;
  }

  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const followersCount = user.followers.length;

  res.json({ followersCount });
});

// Counter for following
router.get('/users/:id/following/count', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = users.find(user => user.id === id);

  if (isNaN(id)) {
    res.status(400).json({ message: 'Invalid user ID format' });
    return;
  }

  if(!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const followingCount = user.following.length;

  res.json({ followingCount });
});

// END OF FOLLOWERS ROUTES

// -------------------------------- LIST ROUTES --------------------------------

// Importing users, games, and lists
import { ListEntry, EntryType, GameList } from '../models/list.model';
import { User } from '../models/user.model';
import { Game } from '../models/game.model';
import * as utils from '../services/list.service'
import { get, request } from 'http';

function setUsers(newUsers : User[]){
  users.length = 0;
  users.push(...newUsers);
}
function setList(newList : GameList[]){
  lists.length = 0;
  lists.push(...newList);
}
function setGames(newGames : Game[]){
  games.length = 0;
  games.push(...newGames);
}
function getGames(){
  return games;
}
function getUsers(){
  return users;
}
function getLists(){
  return lists;
}

export {setUsers, setList, setGames, getGames, getUsers, getLists};
// GET : List of games for a user
router.get('/users/:id/list', async (req, res) => {
  const id : number = parseInt(req.params.id);
  const user = utils.getUser(id, users);
  const userLists = utils.getUsersList(id, lists);

  if (!user) {
    return res.status(404).json({ message : 'User not found' });
  }
  if(!userLists) {
    return res.status(404).json({ message : 'List not found' });
  }
  
  return res.status(200).json(userLists);

});


// POST : Add a game to a user's list
router.post('/users/:id/list', async (req, res) => {
  const id : number = parseInt(req.params.id);
  if(id !== loggedInId) {
    return res.status(401).json({ message : 'Unauthorized' });
  }
  
  const { gameId, entryType, reqDate } = req.body;

  const user = utils.getUser(id, users);
  const game = utils.getGame(gameId, games);
  const list = utils.getUsersList(id, lists);

  if (!user) {
    return res.status(404).json({ message : 'User not found' });
  }
  if (!game) {
    return res.status(404).json({ message : 'Game not found' });
  }
  if (!list) {
    return res.status(404).json({ message : 'List not found' });
  }
  if (utils.isGameInList(list, gameId)) {
    return res.status(409).json({ message : 'Game already exists in list' });
  }
  
  const lastEntryId = list.entries.length > 0 ? list.entries[list.entries.length - 1].entryId : 0;
  
  const nextEntry = {
    entryId : lastEntryId + 1,
    gameId,
    entryType,
    date : new Date(reqDate)
  };
  list.entries.push(nextEntry);
  return res.status(201).json(list);
});
  
// GET: Games of a certain entryType on a user's list
router.get('/users/:id/list/:entryType', async (req, res) => {
  const id : number = parseInt(req.params.id);
  const entryType : string = req.params.entryType;
  const user = utils.getUser(id, users);
  const userLists = utils.getUsersList(id, lists);
  if (!user) {
    return res.status(404).json({ message : 'User not found' });
  }
  if (entryType != EntryType.PLAYED && entryType != EntryType.ABANDONED && entryType != EntryType.WISHLIST) {
    return res.status(404).json({ message : 'Invalid entry type: ' + entryType });
  }
  if (!userLists) {
    return res.status(404).json({ message : 'List not found' });
  }

  const filteredEntries = userLists.entries.filter((entry) => entry.entryType === entryType);
  const filteredList = {
    userId : userLists.userId,
    entries : filteredEntries
  };
  return res.status(200).json(filteredList);

});

// PUT : Edit a game on a user's list
router.put('/users/:id/list/:entryId', async (req, res) => {
  const id : number = parseInt(req.params.id);
  const entryId : number = parseInt(req.params.entryId);
  const user = utils.getUser(id, users);
  const { entryType, reqDate } = req.body;
  if (id !== loggedInId) {
    return res.status(401).json({ message : 'Unauthorized' });
  }
  const userLists = utils.getUsersList(id, lists);
  if (!user) {
    return res.status(404).json({ message : 'User not found' });
  }
  if (!userLists) {
    return res.status(404).json({ message : 'List not found' });
  }
  if (! utils.isEntryInList(userLists, entryId)) {
    return res.status(404).json({ message : 'Entry not found' });
  }
  if (entryType != EntryType.PLAYED && entryType != EntryType.ABANDONED && entryType != EntryType.WISHLIST) {
    return res.status(400).json({ message : 'Invalid entry type' });
  }
  const entryIndex = userLists.entries.findIndex((entry) => entry.entryId === entryId);
  userLists.entries[entryIndex].entryType = entryType;
  userLists.entries[entryIndex].date = new Date(reqDate);
  return res.status(200).json(userLists.entries.find((entry) => entry.entryId === entryId));
});

// DELETE : Remove a game from a user's list
router.delete('/users/:id/list/:entryId', async (req, res) => {
  const id : number = parseInt(req.params.id);
  const entryId : number = parseInt(req.params.entryId);
  const user = utils.getUser(id, users);
  if (id !== loggedInId) {
    return res.status(401).json({ message : 'Unauthorized' });
  }
  const userLists = utils.getUsersList(id, lists);
  if (!user) {
    return res.status(404).json({ message : 'User not found' });
  }
  if (!userLists) {
    return res.status(404).json({ message : 'List not found' });
  }
  if (! utils.isEntryInList(userLists, entryId)) {
    return res.status(404).json({ message : 'Entry not found' });
  }
  const entryIndex = userLists.entries.findIndex((entry) => entry.entryId === entryId);
  userLists.entries.splice(entryIndex, 1);
  return res.status(200).json({ message : 'Entry deleted' });
});

// GET: Search a name in a user's list
router.get('/users/:id/list/search/:name', async (req, res) => {
  const id : number = parseInt(req.params.id);
  const name : string = req.params.name;
  const user = utils.getUser(id, users);
  const userLists = utils.getUsersList(id, lists);
  if (!user) {
    return res.status(404).json({ message : 'User not found' });
  }
  if (!userLists) {
    return res.status(404).json({ message : 'List not found' });
  }
  const filteredEntries = userLists.entries.filter((entry) => {
    const game = utils.getGame(entry.gameId, games);
    if (!game) {
      return false;
    }
    return game.gameName.replace(/\s+/g, "").toLowerCase().includes(name.toLowerCase());
  });
  const filteredList = {
    userId : userLists.userId,
    entries : filteredEntries
  };
  return res.status(200).json(filteredList);
});

// GET: List ordered by criteria
router.get('/users/:id/list/:criteria/:order', async (req, res) => {
  const id : number = parseInt(req.params.id);
  const criteria : string = req.params.criteria;
  const order : string = req.params.order;
  const user = utils.getUser(id, users);
  const userLists = utils.getUsersList(id, lists);
  if (!user) {
    return res.status(404).json({ message : 'User not found' });
  }
  if (!userLists) {
    return res.status(404).json({ message : 'List not found' });
  }
  if (criteria !== 'date' && criteria !== 'title') {
    return res.status(400).json({ message : 'Invalid criteria' });
  }
  if (order !== 'asc' && order !== 'desc') {
    return res.status(400).json({ message : 'Invalid order' });
  }
  const orderedEntries = userLists.entries.sort((a, b) => {
    if (criteria === 'date') {
      return (order.localeCompare('asc') == 0) ? (a.date.getTime() - b.date.getTime()) : (b.date.getTime() - a.date.getTime());
    }
    if (criteria === 'title') {
      const ag = utils.getGame(a.gameId, games);
      const bg = utils.getGame(b.gameId, games);
      if (!ag || !bg) {
        return 0;
      }
      return (order.localeCompare('asc') == 0) ? (ag.gameName.localeCompare(bg.gameName)) : (bg.gameName.localeCompare(ag.gameName));
    }
    return 0;
  });
  const orderedList = {
    userId : userLists.userId,
    entries : orderedEntries
  };
  return res.status(200).json(orderedList);
});


// ----------------------- END LIST ROUTES ------------------- //

// -------------------------------- HISTORIC ROUTES --------------------------------

//User with id 1 is logged in
const logged_in_id = 1;

//function to verify username
function verifyUserId(id: number) {
  const user = users.find((user) => user.id === id);
  //console.log(users);
  if (!user) {
    return null;
  }
  return user;
}

//function to verify review id
function verifyReviewId(id: number) {
  const post = posts.find((post) => post.post_id === id);
  if (!post) {
    return null;
  }
  return post;
}

//Route to get all reviews of that user by id
router.get('/users/:id_user/historic', (req: Request, res: Response) => {
  //check user
  const user = verifyUserId(parseInt(req.params.id_user));

  if (user === null) 
    return res.status(404).json({ error: 'User not found' });
  
  let review_list = posts.filter((post) => post.user_id === user.id);

  //para inverter a ordem da lista
  // /user/:id_user/historico?desc=true
  if (req.query.desc) 
  review_list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  else 
  review_list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
  res.json(review_list);
});


//Route to filter reviews by category
router.get('/users/:id_user/historic/category/:category', (req: Request, res: Response) => {
  //check user
  const user = verifyUserId(parseInt(req.params.id_user));
  if (user === null) 
    return res.status(404).json({ error: 'User not found' });

  //check category
  const category = req.params.category;
  let review = posts.filter((post) => post.category.includes(category) && post.user_id === user.id);

  if (req.query.desc) 
  review.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  else 
  review.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (review.length === 0) 
    return res.status(404).json({ error: 'Category not found' });

  res.json(review);
});

//Route to get a review by id
router.get('/users/:id_user/historic/post_id/:id_post', (req: Request, res: Response) => {
  //check user
  const user = verifyUserId(parseInt(req.params.id_user));
  if (user === null) 
    return res.status(404).json({ error: 'User not found' });

  //check review id
  const post = verifyReviewId(parseInt(req.params.id_post));
  if (post === null) 
    return res.status(404).json({ error: 'Post not found' });

  res.json(post);
});

//Route to update a review by id
//Only the author of the review can update it and only if the author is logged in
router.put('/users/:id_user/historic/post_id/:id_post', (req: Request, res: Response) => {
  //check user
  const user = verifyUserId(parseInt(req.params.id_user));
  if (user === null) 
    return res.status(404).json({ error: 'User not found' });

  //check review id
  let post_to_edit = verifyReviewId(parseInt(req.params.id_post));
  if (post_to_edit === null) 
    return res.status(404).json({ error: 'Post not found' });

  //check if user is logged in
  if (post_to_edit.user_id !== logged_in_id) 
    return res.status(404).json({ error: 'User must be logged in to edit a post' });
  
  const updatedPost = { ...post_to_edit, ...req.body };
  posts[parseInt(req.params.id_post) - 1] = updatedPost;

  res.json(posts[parseInt(req.params.id_post) - 1]);
});

//Route to delete a review by id
router.delete('/users/:id_user/historic/post_id/:id_post', (req: Request, res: Response) => {
  //check user
  const user = verifyUserId(parseInt(req.params.id_user));
  if (user === null) 
    return res.status(404).json({ error: 'User not found' });

  //check review id
  const post_to_delete = verifyReviewId(parseInt(req.params.id_post));
  if (post_to_delete === null) 
    return res.status(404).json({ error: 'Post not found' });

  //check if user is logged in
  if (post_to_delete.user_id !== logged_in_id) 
    return res.status(401).json({ error: 'user must to be logged in' });

  //delete review
  const index = posts.findIndex((post) => post.post_id === post_to_delete.post_id);

  if (index !== -1) {
    posts.splice(index, 1);
    return res.status(200).json({ message: 'Post deleted successfully' });
  }
  else 
    return res.status(404).json({ error: 'Post not found*' });
});

export default (app: Express) => {
  app.use(
    prefix,
    new TestController(router, di.getService(TestService)).router
  );
};