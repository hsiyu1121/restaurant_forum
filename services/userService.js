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

  putUser: (req, res, callback) => {
    if (!req.body.name) {
      return callback({status:'error', message:"name didn't exist"})
    }

    const { file } = req;
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id).then((user) => {
          user
            .update({
              name: req.body.name,
              image: file ? img.data.link : null,
            })
            .then((user) => {
              return callback({status:'success', message:"user was successfully to update"})
            });
        });
      });
    } else {
      return User.findByPk(req.params.id).then((user) => {
        user.update({
            name: req.body.name,
            image: user.image,
          })
          .then((user) => {
            return callback({status:'success', message:"user was successfully to update"})
          });
      });
    }
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

  addFavorite: (req, res, callback) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId,
    }).then((restaurant) => {
      return callback({status:'success', message:''})
    });
  },

  removeFavorite: (req, res, callback) => {
    return Favorite.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId,
      },
    }).then((favorite) => {
      favorite.destroy().then((restaurant) => {
        return callback({status:'success', message:''})
      })
    })
  },

  addLike: (req, res, callback) => {
    return Like.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId,
    }).then((restaurant) => {
      return callback({status:'success', message:''})
    });
  },

  removeLike: (req, res, callback) => {
    return Like.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId,
      },
    }).then((like) => {
      like.destroy().then((restaurant) => {
        return callback({status:'success', message:''})
      });
    });
  },

  addFollowing: (req, res, callback) => {
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId,
    }).then((followship) => {
      return callback({status:'success', message:''})
    });
  },

  removeFollowing: (req, res, callback) => {
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId,
      },
    }).then((followship) => {
      followship.destroy().then((followship) => {
        return callback({status:'success', message:''})
      });
    });
  }

}
 
module.exports = userService