const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const User = db.User
const Comment = db.Comment
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship
const bcrypt = require('bcryptjs')
const imgur = require("imgur-node-api");
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;

const userService = {
  getUser: (req, res, callback) => {   
    User.findByPk(req.params.id, {
      include: [
        {model: Comment, include:[Restaurant]},
        {model: Restaurant, as: 'FavoritedRestaurants'}, 
        {model: User, as: 'Followers'},
        {model: User, as: 'Followings'}
      ]
      })
      .then(user => {
        const userSelf = req.user.id
        const isFollowed = req.user.Followings.map(d => d.id).includes(user.id)
        callback({user:user.toJSON(), 
        isFollowed: isFollowed, 
        userSelf:userSelf })
      })
  },

  getTopUser: (req, res, callback) => {
    return User.findAll({
      include: [{ model: User, as: "Followers" }],
    }).then((users) => {
      users = users.map((user) => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: req.user.Followings.map((d) => d.id).includes(user.id),
      }));
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount);
      callback({ users: users })
    })
  },

}

module.exports = userService