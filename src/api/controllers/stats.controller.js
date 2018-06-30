const Post = require('../models/post.model');
const User = require('../models/user.model');
const httpStatus = require('http-status');

/**
 * Method to generate a MongoDB query based on a given criteria
 * @param {String} filter: criteria to determine the query
 * @private
 * @author Jayser Mendez
 */
const buildQuery = (filter, req) => {
  // List and count all the posts pending of moderation
  if (filter === 'moderation_pending') {
    return {
      'moderation.moderated': false,
      'moderation.reservedUntil': { $lt: Date.now() },
    };

  // List and count all the approved posts
  } else if (filter === 'moderation_approved') {
    let query = { 'moderation.approved': true };

    // If the request has params, it is the username, append it.
    if (Object.keys(req.query).length !== 0) {
      query = { ...query, 'moderation.moderatedBy': req.query.username };
    }

    return query;

  // List and count all the not approved posts
  } else if (filter === 'moderation_not_approved') {
    let query = { 'moderation.approved': false };

    // If the request has params, it is the username, append it.
    if (Object.keys(req.query).length !== 0) {
      query = { ...query, 'moderation.moderatedBy': req.query.username };
    }

    return query;

  // List and count all the reserved posts
  } else if (filter === 'reserved') {
    let query = { 'moderation.reserved': true };

    // If the request has params, it is the username, append it.
    if (Object.keys(req.query).length !== 0) {
      query = {
        ...query,
        'moderation.reservedBy': req.query.username,
        'moderation.reservedUntil': { $gt: Date.now() },
      };
    }

    return query;

  // List and count all moderated posts
  } else if (filter === 'moderated') {
    let query = { 'moderation.moderated': true };

    // If the request has params, it is the username, append it.
    if (Object.keys(req.query).length !== 0) {
      query = { ...query, 'moderation.moderatedBy': req.query.username };
    }

    return query;
  }

  return false;
};

/**
 * Send stats response with the provided criteria
 * @param {String} filter: criteria to determine the query
 * @param {Object} req: url params
 * @param {Function} res: Express.js response callback
 * @param {Function} next: Express.js middleware callback
 * @public
 * @author Jayser Mendez
 */
exports.sendStats = filter => async (req, res, next) => {
  try {
    // Grab the params from the request
    let { limit, skip } = req.query;
    limit = parseInt(limit, 10);
    skip = parseInt(skip, 10);

    // Find the post in the database
    const posts = await Post.find(buildQuery(filter, req)).limit(limit || 25).skip(skip || 0);

    // Send the response to the client formatted.
    return res.status(httpStatus.OK).send({
      status: httpStatus.OK,
      results: posts,
      count: posts.length,
    });

  // Catch errors here.
  } catch (err) {
    return next({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: 'Opps! Something is wrong in our server. Please report it to the administrator.',
      error: err,
    });
  }
};

/**
 * Method to query and list all users in database
 * @param {Object} req: url params
 * @param {Function} res: Express.js response callback
 * @param {Function} next: Express.js middleware callback
 * @public
 * @author Jayser Mendez
 */
exports.allUsers = async (req, res, next) => {
  try {
    // Grab the params from the request
    let { limit, skip } = req.query;
    const { username, search } = req.query;
    limit = parseInt(limit, 10);
    skip = parseInt(skip, 10);

    // Query for search
    const searchQuery = { username: { $regex: req.query.search, $options: 'i' } };

    // eslint-disable-next-line
    const query = username ? { username } : ( search ? searchQuery : {});

    // Find all the users from database
    const users = await User.find(query)
      .limit(limit || 25)
      .skip(skip || 0)
      .select({
        _id: 0,
        username: 1,
        roles: 1,
        isBanned: 1,
        bannedUntil: 1,
        banReason: 1,
        bannedBy: 1,
        createdAt: 1,
      });

    // Check if there is a response
    if (users.length > 0) {
      // Send the response to the client formatted.
      return res.status(httpStatus.OK).send({
        status: httpStatus.OK,
        results: users,
        count: users.length,
      });
    }

    // Otherwise, return 404
    return res.status(httpStatus.NOT_FOUND).send({
      status: httpStatus.NOT_FOUND,
      message: 'This username does not exist in our records.',
    });

  // Catch errors here.
  } catch (err) {
    return next({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: 'Opps! Something is wrong in our server. Please report it to the administrator.',
      error: err,
    });
  }
};

