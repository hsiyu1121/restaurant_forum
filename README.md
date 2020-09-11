# 餐廳評論網

使用Node.js, Express, MySQL, Sequeilze 套件製作而成

![Alt text](https://github.com/hsiyu1121/restaurant_forum/blob/master/restaurant_forum.png)

## 功能清單
* 使用者可以註冊自己的帳號 
* 使用者操作錯誤，會給予適當的回應 
* 管理者可以進入後台
* 管理者可以調整使用者權限
* 管理者可以建立餐廳清單
* 管理者可以編輯餐廳清單
* 管理者可以修改餐廳清單
* 管理者可以刪除餐廳清單



## 環境需求
* Node.js: v10.15.0
* express: v4.17.1
* sequelize: v6.3.5

## 啟動方式
* 將專案下載至本機內

  ``git clone https://github.com/hsiyu1121/restaurant_forum.git``
* 切換至資料夾內

  ``cd restaurant_forum``
* 安裝相關的套件

  ``npm install``
* 建立資料庫

  ``npx sequelize db:seed:all``
* 透過node執行程式

  ``npm run start``
* 透過nodemno執行程式

  ``npm run dev``
* 開啟瀏覽器輸入以下網址

  ``http://localhost:3000``
  
## 更改檔名 .env.example
 請將此檔案更名為 .env ，將可以順利運作。
  

## 測試帳號密碼清單
<table>
  <tr>
    <td>Email</td>
    <td>Password</td>
  </tr>
  <tr>
    <td>root@example.com</td>
    <td>12345678</td>
  </tr>
  <tr>
    <td>user1@example.com</td>
    <td>12345678</td>
  </tr>
    <tr>
    <td>user2@example.com</td>
    <td>12345678</td>
  </tr>
</table>
