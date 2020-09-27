const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User
const Favorite = db.Favorite
const pageLimit = 10

const restService = {
 getRestaurants: (req, res, callback) => {
    let offset = 0
    let whereQuery = {}
    let categoryId = ''
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['categoryId'] = categoryId
    }
    Restaurant.findAndCountAll({ include: Category, where: whereQuery, offset: offset, limit: pageLimit }).then(result => {
      // data for pagination
      let page = Number(req.query.page) || 1
      let pages = Math.ceil(result.count / pageLimit)
      let totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      let prev = page - 1 < 1 ? 1 : page - 1
      let next = page + 1 > pages ? pages : page + 1
      // clean up restaurant data
      const data = result.rows.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        categoryName: r.dataValues.Category.name, 
        isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id), 
        isLiked: req.user.LikedRestaurants.map(d => d.id).includes(r.id)
      }))
      Category.findAll({ 
        raw: true,
        nest: true
      }).then(categories => {
        return callback({
          restaurants: data,
          categories: categories,
          categoryId: categoryId,
          page: page,
          totalPage: totalPage,
          prev: prev,
          next: next
        })
      })
    })
  },

  getRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category, 
        {model: User, as: 'FavoritedUsers'},
        {model: User, as: 'LikedUsers'},  
        {model: Comment, include: [User]}
      ]
    }).then(restaurant => {
      restaurant.viewCounts += 1
      restaurant.save()
        .then(restaurant => {
          const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id)
          const isLiked = restaurant.LikedUsers.map(d => d.id).includes(req.user.id)
          return callback({ 
            restaurant: restaurant, 
            isFavorited: isFavorited, 
            isLiked: isLiked
          })
        })
    })
  },

  getFeeds: (req, res, callback) => {
    return Restaurant.findAll({
      limit: 10,
      raw: true,
      nest: true,
      order: [['createdAt', 'DESC']],
      include: [Category]
    }).then(restaurants => {
      Comment.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant]
      }).then(comments => {
        return callback({
           restaurants: restaurants,
          comments: comments
        })
      })
    })
  },

  getDashboard: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category, 
        {model: Comment, include: [User]},
        {model: User, as: 'FavoritedUsers'}
      ]
    }).then(restaurant => {
      return callback({
        restaurant: restaurant
      })      
    })
  },

  getTopRestaurant: (req, res, callback) => {
    Restaurant.findAll({
      include:[
        {model: User, as: 'FavoritedUsers'}
      ]
    }).then((restaurants) => {
      restaurants = restaurants.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        FavoriteCount: r.FavoritedUsers.length,
        isFavorited: req.user.FavoritedRestaurants.map(r => r.id).includes(r.id)
      }))
      restaurants = restaurants.sort((a, b) => b.FavoriteCount - a.FavoriteCount).slice(0, 10)
      return callback({
        restaurants: restaurants
      })
    })
  }
}

module.exports = restService